const express = require('express');
const router = express.Router();
const db = require('../db');

// Add usage
router.post('/', (req, res) => {
  const { itemName, usedQuantity, unit, date } = req.body;
  const query = `INSERT INTO usage (itemName, usedQuantity, unit, date) VALUES (?, ?, ?, ?)`;
  db.run(query, [itemName, usedQuantity, unit, date], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Get all usage
router.get('/', (req, res) => {
  db.all(`SELECT * FROM usage`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
