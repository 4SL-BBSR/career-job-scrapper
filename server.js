const express = require("express");
const cors = require("cors");
const cron = require("node-cron");

const scrapeIndeed = require("./scraper/indeed");
const jobRoutes = require("./routes/jobs");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/jobs", jobRoutes);

// Run scraper every 30 mins
cron.schedule("*/30 * * * *", async () => {
  console.log("⏳ Running Job Scraper...");
  await scrapeIndeed();
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});