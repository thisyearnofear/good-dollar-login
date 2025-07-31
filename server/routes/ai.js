/**
 * AI suggestion routes.
 */
import express from "express";
import { getSuggestions } from "../services/aiService.js";

const router = express.Router();

/**
 * POST /api/ai/suggest
 * Expects { topics: [string, string] }
 * Returns { suggestions: string[] }
 */
router.post("/suggest", async (req, res) => {
  try {
    const { topics } = req.body;
    if (
      !Array.isArray(topics) ||
      topics.length < 2 ||
      topics.some((t) => typeof t !== "string" || !t.trim())
    ) {
      return res.status(400).json({ error: "Request body must have topics: [string, string]" });
    }
    const suggestions = await getSuggestions(topics);
    res.json({ suggestions });
  } catch (e) {
    console.error("[/api/ai/suggest] error:", e);
    res.status(500).json({ error: e.message || "AI suggestion failed" });
  }
});

export default router;