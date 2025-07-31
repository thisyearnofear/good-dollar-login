/**
 * OAuth redirect handler.
 * Placeholder: logs incoming query, returns status "ok".
 */
import express from "express";

const router = express.Router();

/**
 * GET /oauth/redirect
 * Logs query and returns JSON {status:"ok"}
 */
router.get("/redirect", (req, res) => {
  // For now, just log the query params and reply
  console.log("[oauth] Redirect query:", req.query);
  res.json({ status: "ok" });
});

export default router;