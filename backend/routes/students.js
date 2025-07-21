// routes/students.js
const express = require('express');
const db = require('../db');
const router = express.Router();

// Create students table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roll_number TEXT UNIQUE,
    name TEXT,
    branch TEXT,
    year INTEGER
  )
`);

// Get all students
router.get('/', (req, res) => {
  db.all('SELECT * FROM students', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get a student by roll number
router.get('/:roll_number', (req, res) => {
  const { roll_number } = req.params;
  db.get('SELECT * FROM students WHERE roll_number = ?', [roll_number], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Student not found' });
    res.json(row);
  });
});

// Add a new student
router.post('/', (req, res) => {
  const { roll_number, name, branch, year } = req.body;
  if (!roll_number || !name) {
    return res.status(400).json({ error: 'Roll number and name are required' });
  }

  const stmt = `INSERT INTO students (roll_number, name, branch, year) VALUES (?, ?, ?, ?)`;
  db.run(stmt, [roll_number, name, branch, year], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, roll_number, name, branch, year });
  });
});

// Update a student
router.put('/:roll_number', (req, res) => {
  const { roll_number } = req.params;
  const { name, branch, year } = req.body;

  db.run(
    `UPDATE students SET name = ?, branch = ?, year = ? WHERE roll_number = ?`,
    [name, branch, year, roll_number],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Student not found' });
      res.json({ message: 'Student updated successfully' });
    }
  );
});

// Delete a student
router.delete('/:roll_number', (req, res) => {
  const { roll_number } = req.params;
  db.run(`DELETE FROM students WHERE roll_number = ?`, [roll_number], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  });
});

module.exports = router;
