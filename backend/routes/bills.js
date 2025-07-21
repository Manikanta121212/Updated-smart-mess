const express = require('express');
const router = express.Router();
const db = require('../db');

// Generate bills based on attendance
router.get('/', (req, res) => {
  const query = `
    SELECT s.rollNo, s.name,
           (SELECT COUNT(DISTINCT date) FROM usage u
            WHERE date NOT IN (
              SELECT date
              FROM absentees a, (
                SELECT date(date, '+' || x || ' days') as date
                FROM absentees, generate_series(0, julianday(toDate) - julianday(fromDate)) as x
              ) d
              WHERE d.date BETWEEN a.fromDate AND a.toDate AND a.rollNo = s.rollNo
            )) AS presentDays
    FROM students s
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
