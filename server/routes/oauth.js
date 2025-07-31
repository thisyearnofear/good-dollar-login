/**
 * Canva OAuth2 login/redirect endpoints.
 */
import express from "express";
import { CANVA_OAUTH } from "../config/canva.js";
import { generateCodeVerifier, codeChallenge } from "../utils/pkce.js";
import { getToken, setToken } from "../services/tokenStore.js";
import dotenv from "dotenv";
import axios from "axios";
import crypto from "crypto";

dotenv.config();

const router = express.Router();

// For expiry of temporary state
const TMP_EXPIRY_MS = 5 * 60 * 1000;

// In-memory expiry map for temp PKCE states (production: replace with Redis or similar)
function setTmp(key, value) {
  setToken(key, { ...value, _expires: Date.now() + TMP_EXPIRY_MS });
}
function getTmp(key) {
  const item = getToken(key);
  if (!item || item._expires < Date.now()) return null;
  return item;
}

/**
 * GET /oauth/login?wallet=<address>
 * Generates PKCE challenge, state, stores temp, returns {authUrl}
 */
router.get("/login", (req, res) => {
  const wallet = req.query.wallet;
  if (!wallet) return res.status(400).json({ error: "Missing wallet param" });

  const state = crypto.randomUUID();
  const codeVerifier = generateCodeVerifier();
  const codeChal = codeChallenge(codeVerifier);

  setTmp(`tmp:${state}`, { wallet, codeVerifier });

  const params = new URLSearchParams({
    client_id: process.env.CANVA_CLIENT_ID,
    redirect_uri: process.env.CANVA_REDIRECT_URI,
    scope: "openid profile asset:read asset:write design:read design:write offline",
    response_type: "code",
    state,
    code_challenge: codeChal,
    code_challenge_method: "S256",
  });

  const authUrl = `${CANVA_OAUTH.authorizeUrl}?${params.toString()}`;
  res.json({ authUrl });
});

/**
 * GET /oauth/redirect?code&state
 * Exchanges code for tokens, stores under canva:${wallet}.
 * Returns HTML that closes popup & posts message to window.opener.
 */
router.get("/redirect", async (req, res) => {
  const { code, state } = req.query;
  if (!code || !state) {
    return res.status(400).send("Missing code or state");
  }
  const tmp = getTmp(`tmp:${state}`);
  if (!tmp) {
    return res.status(400).send("State expired or invalid");
  }
  const { wallet, codeVerifier } = tmp;

  try {
    // Exchange code for tokens
    const tokenResp = await axios.post(
      CANVA_OAUTH.tokenUrl,
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.CANVA_REDIRECT_URI,
        client_id: process.env.CANVA_CLIENT_ID,
        code_verifier: codeVerifier,
        client_secret: process.env.CANVA_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, refresh_token, expires_in } = tokenResp.data;
    setToken(`canva:${wallet}`, {
      access: access_token,
      refresh: refresh_token,
      expires_at: Date.now() + (expires_in * 1000) - 30 * 1000
    });

    // Respond with HTML to close popup and post message to opener
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ canvaLinked: true }, "*");
              window.close();
            } else {
              document.body.innerHTML = "Canva linked! You may close this window.";
            }
          </script>
          <p>Canva authorization complete. You may close this window.</p>
        </body>
      </html>
    `);
  } catch (e) {
    console.error("Canva token exchange failed:", e?.response?.data || e.message);
    res.status(500).send("Token exchange failed");
  }
});

export default router;