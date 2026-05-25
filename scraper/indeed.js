import axios from "axios";
import * as cheerio from "cheerio";

import db from "../db.js";

async function scrapeIndeed() {
  try {
    const url = process.env.SCRAPE_URL || "https://in.indeed.com/jobs?q=software+developer";
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": process.env.SCRAPE_USER_AGENT || "Mozilla/5.0"
      }
    });
    const $ = cheerio.load(data);
    const jobs = [];

    $(".job_seen_beacon").each((_, el) => {
      const title = $(el).find("h2 span").text().trim();
      const company = $(el).find(".companyName").text().trim();
      const location = $(el).find(".companyLocation").text().trim();
      const href = $(el).find("a").attr("href");

      if (!title || !company || !href) {
        return;
      }

      jobs.push([title, company, location, "indeed", `https://in.indeed.com${href}`]);
    });

    for (const job of jobs) {
      await db.execute(
        `
          INSERT INTO jobs (title, company, location, source, apply_url)
          VALUES (?, ?, ?, ?, ?)
        `,
        job
      );
    }

    console.log(`[scraper] Indeed scrape completed. Inserted ${jobs.length} jobs.`);
  } catch (error) {
    const details = [
      error.code,
      error.response?.status,
      error.response?.statusText,
      error.message
    ]
      .filter(Boolean)
      .join(" | ");

    console.error("[scraper] Indeed scrape failed:", details);
  }
}

export default scrapeIndeed;
