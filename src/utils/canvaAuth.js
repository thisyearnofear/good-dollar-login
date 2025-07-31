import { generateCodeVerifier } from "./pkce";

/**
 * Initiates Canva OAuth flow in browser.
 * @param {string} wallet
 * @param {function} setCanvaLinked
 * @param {function} addToast
 * @returns {Promise}
 */
export function initiateCanvaOAuth(wallet, setCanvaLinked, addToast) {
  return new Promise(async (resolve, reject) => {
    try {
      const codeVerifier = generateCodeVerifier();
      const state = window.crypto.randomUUID?.() || Math.random().toString(36).slice(2);
      sessionStorage.setItem(`pkce_code_verifier_${state}`, codeVerifier);
      sessionStorage.setItem(`canva_wallet_${state}`, wallet);

      const resp = await fetch(`/oauth/login?wallet=${wallet}`);
      const { authUrl } = await resp.json();
      const fullAuthUrl = authUrl + "&state=" + state;
      const popup = window.open(fullAuthUrl, "_blank", "width=500,height=700");

      function listener(event) {
        if (event.data?.canvaLinked) {
          setCanvaLinked(true);
          addToast({ message: "Canva linked!", type: "success" });
          popup && popup.close();
          window.removeEventListener("message", listener);
          resolve(true);
        }
      }
      window.addEventListener("message", listener);
    } catch (e) {
      addToast({ message: "Failed to initiate Canva OAuth", type: "error" });
      reject(e);
    }
  });
}