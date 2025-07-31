/**
 * AI suggestion placeholder routes.
 */
import express from "express";

const router = express.Router();

/**
 * POST /api/ai/suggest
 * Returns dummy suggestions.
 */
router.post("/suggest", (req, res) => {
  res.json({ suggestions: ["placeholder"] });
});

export default router;