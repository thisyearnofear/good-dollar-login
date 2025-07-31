import axios from "axios";
import { getToken } from "./tokenStore.js";

const CANVA_API_BASE = "https://api.canva.com/v1";

/**
 * Creates an authenticated axios instance for Canva API with wallet's access token.
 * @param {string} wallet
 */
function canvaClient(wallet) {
  const t = getToken(`canva:${wallet}`);
  if (!t?.access) throw new Error("No Canva token for wallet");
  return axios.create({
    baseURL: CANVA_API_BASE,
    headers: { Authorization: `Bearer ${t.access}` }
  });
}

/**
 * Uploads an SVG asset to Canva.
 * @param {string} wallet
 * @param {string} svg
 * @param {string} fileName
 * @returns {Promise<{assetId: string}>}
 */
export async function uploadAsset(wallet, svg, fileName) {
  const client = canvaClient(wallet);
  const form = new FormData();
  form.append("file", Buffer.from(svg), {
    filename: fileName,
    contentType: "image/svg+xml"
  });
  // assetType may be required by Canva API.
  form.append("assetType", "image");

  // API stub: In reality, check Canva documentation for /assets endpoint.
  const resp = await client.post("/assets", form, {
    headers: form.getHeaders()
  });
  // Example: { id: "assetId123" }
  return { assetId: resp.data.id };
}

/**
 * Creates a design from an asset.
 * @param {string} assetId
 * @returns {Promise<{designId: string, editUrl: string}>}
 */
export async function createDesignFromAsset(assetId) {
  // API stub: Replace with real Canva API call.
  // POST /designs with asset reference, returns designId and editUrl.
  return {
    designId: "mock-design-" + assetId,
    editUrl: "https://www.canva.com/design/mock-" + assetId + "/edit"
  };
}

/**
 * Exports a design as PNG, polls until ready.
 * @param {string} wallet
 * @param {string} designId
 * @returns {Promise<{url: string}>}
 */
export async function exportDesign(wallet, designId) {
  // API stub: In reality, use Canva /designs/{id}/exports, then poll /exports/{id}
  await new Promise((r) => setTimeout(r, 1200)); // mock delay
  return { url: "https://cdn.canva.com/mock/exports/" + designId + ".png" };
}