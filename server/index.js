/**
 * Entry point for Express backend server.
 * Loads environment, sets up middleware, routers, and starts server.
 */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import oauthRouter from "./routes/oauth.js";
import canvaRouter from "./routes/canva.js";
import aiRouter from "./routes/ai.js";
import nftRouter from "./routes/nft.js";

dotenv.config();

const app = express();

// Restrict CORS to frontend origin
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.use("/oauth", oauthRouter);
app.use("/api/canva", canvaRouter);
app.use("/api/ai", aiRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[server] Listening on port ${PORT}`);
});