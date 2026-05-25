const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../db");

async function scrapeIndeed() {
  try {
    const url = "https://in.indeed.com/jobs?q=software+developer";

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    $(".job_seen_beacon").each((i, el) => {
      const title = $(el).find("h2 span").text();
      const company = $(el).find(".companyName").text();
      const location = $(el).find(".companyLocation").text();
      const link = "https://in.indeed.com" + $(el).find("a").attr("href");

      const query = `
        INSERT INTO jobs (title, company, location, source, apply_url)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(query, [title, company, location, "indeed", link]);
    });

    console.log("✅ Indeed Scraped");
  } catch (err) {
    console.log("❌ Scraper Error:", err.message);
  }
}

module.exports = scrapeIndeed;