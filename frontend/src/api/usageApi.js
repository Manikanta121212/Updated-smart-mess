const express = require('express');
const router = express.Router();
const db = require('../db');

// Add usage entry
router.post('/usage', (req, res) => {
  const { itemName, usedQuantity, date } = req.body;
  const query = `
    INSERT INTO usage (itemName, usedQuantity, date)
    VALUES (?, ?, ?)
  `;
  db.run(query, [itemName, usedQuantity, date], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Usage recorded' });
  });
});

// Get usage report
router.get('/usage', (req, res) => {
  db.all('SELECT * FROM usage', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
