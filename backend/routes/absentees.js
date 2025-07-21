const express = require('express');
const router = express.Router();
const db = require('../db');

// Add absentee entry
router.post('/', (req, res) => {
  const { rollNo, fromDate, toDate } = req.body;
  const query = `INSERT INTO absentees (rollNo, fromDate, toDate) VALUES (?, ?, ?)`;
  db.run(query, [rollNo, fromDate, toDate], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Get all absentees
router.get('/', (req, res) => {
  db.all(`SELECT * FROM absentees`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
