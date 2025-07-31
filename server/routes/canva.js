/**
 * Canva integration placeholder routes.
 */
import express from "express";

const router = express.Router();

/**
 * POST /api/canva/upload
 * Placeholder: Returns 501 Not Implemented.
 */
router.post("/upload", (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

/**
 * GET /api/canva/export/:id
 * Placeholder: Returns 501 Not Implemented.
 */
router.get("/export/:id", (req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

export default router;