/**
 * Canva integration routes: upload asset, create design, export.
 */
import express from "express";
import { uploadAsset, createDesignFromAsset, exportDesign } from "../services/canvaService.js";

const router = express.Router();

/**
 * POST /api/canva/upload
 * Body: {svg, fileName, wallet}
 * Returns: {designId, editUrl}
 */
router.post("/upload", async (req, res) => {
  try {
    const { svg, fileName, wallet } = req.body;
    if (!svg || !fileName || !wallet) {
      return res.status(400).json({ error: "svg, fileName, wallet required" });
    }
    const { assetId } = await uploadAsset(wallet, svg, fileName);
    const { designId, editUrl } = await createDesignFromAsset(assetId);
    res.json({ designId, editUrl });
  } catch (e) {
    console.error("[/api/canva/upload]", e.message || e);
    res.status(500).json({ error: e.message || "Upload failed" });
  }
});

/**
 * GET /api/canva/export/:designId?wallet=
 * Returns: {url}
 */
router.get("/export/:designId", async (req, res) => {
  try {
    const { wallet } = req.query;
    const { designId } = req.params;
    if (!wallet || !designId) {
      return res.status(400).json({ error: "wallet and designId required" });
    }
    const { url } = await exportDesign(wallet, designId);
    res.json({ url });
  } catch (e) {
    console.error("[/api/canva/export]", e.message || e);
    res.status(500).json({ error: e.message || "Export failed" });
  }
});

export default router;