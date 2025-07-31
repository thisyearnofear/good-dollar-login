import express from "express";
import { mintNFT } from "../services/nftService.js";

/**
 * NFT mint API.
 */
const router = express.Router();

/**
 * POST /api/nft/mint {wallet, cid}
 */
router.post("/mint", async (req, res) => {
  try {
    const { wallet, cid } = req.body;
    if (!wallet || !cid) {
      return res.status(400).json({ error: "wallet and cid required" });
    }
    const result = await mintNFT({ to: wallet, cid });
    res.json(result);
  } catch (e) {
    console.error("[/api/nft/mint]", e.message || e);
    res.status(500).json({ error: e.message || "Mint failed" });
  }
});

export default router;