import crypto from "crypto";

/**
 * Generates a random code verifier for PKCE.
 * @returns {string}
 */
export function generateCodeVerifier() {
  return crypto.randomBytes(32).toString("base64url");
}

/**
 * Generates a code challenge from a verifier (SHA256, base64url).
 * @param {string} codeVerifier
 * @returns {string}
 */
export function codeChallenge(codeVerifier) {
  const hash = crypto.createHash("sha256").update(codeVerifier).digest();
  return hash
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}