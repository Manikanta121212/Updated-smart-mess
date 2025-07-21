const express = require('express');
const router = express.Router();
const db = require('../db');

// Add student
router.post('/', (req, res) => {
  const { rollNo, name } = req.body;
  const query = `INSERT INTO students (rollNo, name) VALUES (?, ?)`;
  db.run(query, [rollNo, name], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Get all students
router.get('/', (req, res) => {
  db.all(`SELECT * FROM students`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
