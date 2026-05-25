import express from "express";

import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { search, location, company } = req.query;
  let query = "SELECT * FROM jobs WHERE 1=1";
  const params = [];

  if (search) {
    query += " AND title LIKE ?";
    params.push(`%${search}%`);
  }

  if (location) {
    query += " AND location LIKE ?";
    params.push(`%${location}%`);
  }

  if (company) {
    query += " AND company LIKE ?";
    params.push(`%${company}%`);
  }

  try {
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM jobs WHERE id = ?", [req.params.id]);
    res.json(rows[0] || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
