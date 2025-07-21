const express = require('express');
const router = express.Router();
const db = require('../db');

// Add new student
router.post('/students', (req, res) => {
  const { rollNumber, name, branch } = req.body;
  const query = `
    INSERT INTO students (rollNumber, name, branch)
    VALUES (?, ?, ?)
  `;
  db.run(query, [rollNumber, name, branch], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Student added' });
  });
});

// Get all students
router.get('/students', (req, res) => {
  db.all('SELECT * FROM students', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
