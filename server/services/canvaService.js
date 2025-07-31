import axios from "axios";
import { getToken, setToken } from "./tokenStore.js";
import dotenv from "dotenv";
import { pinBuffer } from "./storageService.js";
import fetch from "node-fetch";
import FormData from "form-data";

dotenv.config();

const CANVA_API_BASE = "https://api.canva.com/v1";

/**
 * Ensures a valid Canva access token for wallet, refreshes if expired.
 * Mutates tokenStore entry if refreshed.
 * @param {string} wallet
 * @returns {Promise<string>} access token
 */
export async function ensureToken(wallet) {
  let t = getToken(`canva:${wallet}`);
  if (!t) throw new Error("No Canva token for wallet");
  if (t.expires_at > Date.now() + 60 * 1000) return t.access; // 60s leeway

  // Refresh token
  const resp = await axios.post(
    "https://www.canva.com/api/oauth/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: t.refresh,
      client_id: process.env.CANVA_CLIENT_ID,
      client_secret: process.env.CANVA_CLIENT_SECRET,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  const { access_token, refresh_token, expires_in } = resp.data;
  setToken(`canva:${wallet}`, {
    access: access_token,
    refresh: refresh_token,
    expires_at: Date.now() + (expires_in * 1000) - 30 * 1000
  });
  return access_token;
}

/**
 * Creates an authenticated axios instance for Canva API with wallet's access token.
 * @param {string} wallet
 */
async function canvaClient(wallet) {
  const token = await ensureToken(wallet);
  return axios.create({
    baseURL: CANVA_API_BASE,
    headers: { Authorization: `Bearer ${token}` }
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
  const client = await canvaClient(wallet);
  const form = new FormData();
  form.append("file", Buffer.from(svg), {
    filename: fileName,
    contentType: "image/svg+xml"
  });
  form.append("assetType", "image");

  // Stub: returns mock assetId
  // const resp = await client.post("/assets", form, { headers: form.getHeaders() });
  // return { assetId: resp.data.id };
  return { assetId: "mock-asset-" + Math.random().toString(36).slice(2) };
}

/**
 * Creates a design from an asset.
 * @param {string} assetId
 * @returns {Promise<{designId: string, editUrl: string}>}
 */
export async function createDesignFromAsset(assetId) {
  // In real Canva API:
  // POST /designs { pages:[{ elements:[{assetId}] }] }
  // For now, mock only:
  return {
    designId: "mock-design-" + assetId,
    editUrl: "https://www.canva.com/design/mock-" + assetId + "/edit"
  };
}

/**
 * Exports a design as PNG, polls for completion, pins to IPFS.
 * @param {string} wallet
 * @param {string} designId
 * @returns {Promise<{cid: string, url: string}>}
 */
export async function exportDesign(wallet, designId) {
  // In reality:
  // POST /designs/{id}/exports {format:"png"}
  // Poll /exports/{jobId} for status=="succeeded" and url.
  // Download, pin to IPFS, return {cid, url}
  // Here: mock an image and pin a dummy buffer.
  const dummyImage = Buffer.from(
    "89504e470d0a1a0a0000000d4948445200000001000000010802000000907753de0000000a4944415408d76360000000020001e221bc330000000049454e44ae426082",
    "hex"
  );
  // Simulate delay
  await new Promise((r) => setTimeout(r, 1200));
  // Pin to web3.storage
  return await pinBuffer(dummyImage, designId + ".png");
}