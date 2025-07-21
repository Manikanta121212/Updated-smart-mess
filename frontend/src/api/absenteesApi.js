const express = require('express');
const router = express.Router();
const db = require('../db');

// Mark absentee dates
router.post('/absentees', (req, res) => {
  const { rollNumber, fromDate, toDate } = req.body;
  const query = `
    INSERT INTO absentees (rollNumber, fromDate, toDate)
    VALUES (?, ?, ?)
  `;
  db.run(query, [rollNumber, fromDate, toDate], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Absentee added' });
  });
});

// Get all absentees
router.get('/absentees', (req, res) => {
  db.all('SELECT * FROM absentees', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
