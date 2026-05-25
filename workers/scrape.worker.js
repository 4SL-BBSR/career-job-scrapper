import scrapeIndeed from "../scraper/indeed.js";

try {
  await scrapeIndeed();
  process.exit(0);
} catch (error) {
  console.error("[worker] Scrape worker failed:", error.message);
  process.exit(1);
}
