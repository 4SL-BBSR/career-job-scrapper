const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL JOBS
router.get("/", (req, res) => {
  const { search, location, company } = req.query;

  let query = "SELECT * FROM jobs WHERE 1=1";
  let params = [];

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

  db.query(query, params, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});


// GET JOB BY ID
router.get("/:id", (req, res) => {
  db.query("SELECT * FROM jobs WHERE id = ?", [req.params.id], (err, result) => {
    res.json(result[0]);
  });
});

module.exports = router;