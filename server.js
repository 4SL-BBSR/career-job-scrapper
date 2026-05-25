import cors from "cors";
import express from "express";
import cron from "node-cron";

import "./config/loadEnv.js";
import { testDbConnection } from "./db.js";
import jobRoutes from "./routes/jobs.js";
import scrapeIndeed from "./scraper/indeed.js";

const app = express();
const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 5000);
const scrapeEnabled = process.env.SCRAPE_ENABLED !== "false";
const scrapeSchedule = process.env.SCRAPE_CRON || "*/30 * * * *";

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await testDbConnection();
    res.json({ ok: true, db: "connected" });
  } catch (error) {
    res.status(500).json({ ok: false, db: "disconnected", error: error.message });
  }
});

app.use("/api/jobs", jobRoutes);

if (scrapeEnabled) {
  cron.schedule(scrapeSchedule, async () => {
    console.log("[scraper] Running scheduled Indeed scrape...");
    await scrapeIndeed();
  });
}

app.listen(port, host, async () => {
  console.log(`[server] Listening on ${host}:${port}`);

  try {
    await testDbConnection();
    console.log("[db] Connection verified");
  } catch (error) {
    const details = [error.code, error.errno, error.message].filter(Boolean).join(" | ");
    console.error("[db] Connection check failed:", details);
  }
});
