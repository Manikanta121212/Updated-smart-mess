const express = require('express');
const router = express.Router();
const db = require('../db');

// Get usage for all items
router.get('/', (req, res) => {
  const sql = `
    SELECT grocery_name, day, quantity_used 
    FROM usage
    ORDER BY grocery_name, day
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const usageMap = {};
    rows.forEach(row => {
      if (!usageMap[row.grocery_name]) {
        usageMap[row.grocery_name] = Array(31).fill(0);
      }
      usageMap[row.grocery_name][row.day - 1] = row.quantity_used;
    });

    res.json(usageMap);
  });
});

// Update or insert usage
router.post('/', (req, res) => {
  const { name, day, quantity } = req.body;

  const checkSql = `SELECT * FROM usage WHERE grocery_name = ? AND day = ?`;
  db.get(checkSql, [name, day], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (row) {
      const updateSql = `UPDATE usage SET quantity_used = ? WHERE grocery_name = ? AND day = ?`;
      db.run(updateSql, [quantity, name, day], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Updated successfully' });
      });
    } else {
      const insertSql = `INSERT INTO usage (grocery_name, day, quantity_used) VALUES (?, ?, ?)`;
      db.run(insertSql, [name, day, quantity], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Inserted successfully' });
      });
    }
  });
});

module.exports = router;
