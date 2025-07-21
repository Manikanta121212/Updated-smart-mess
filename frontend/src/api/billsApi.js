const express = require('express');
const router = express.Router();
const db = require('../db');

// Get daily total cost
router.get('/daily-costs', (req, res) => {
  const query = `
    SELECT date, SUM(price) AS totalCost
    FROM groceries
    GROUP BY date
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Generate student bill
router.get('/bill/:rollNumber', (req, res) => {
  const roll = req.params.rollNumber;

  const totalDaysQuery = `
    SELECT DISTINCT date FROM groceries
    WHERE date NOT IN (
      SELECT date
      FROM absentees
      JOIN (
        SELECT date FROM groceries
      ) g ON g.date BETWEEN absentees.fromDate AND absentees.toDate
      WHERE absentees.rollNumber = ?
    )
  `;

  db.all(totalDaysQuery, [roll], (err, presentDates) => {
    if (err) return res.status(500).json({ error: err.message });

    const datesList = presentDates.map(d => `'${d.date}'`).join(',');
    if (!datesList) return res.json({ bill: 0 });

    const costQuery = `
      SELECT SUM(price) AS totalBill
      FROM groceries
      WHERE date IN (${datesList})
    `;

    db.get(costQuery, [], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ bill: result.totalBill || 0 });
    });
  });
});

module.exports = router;
