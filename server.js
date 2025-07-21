const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    db.run(`CREATE TABLE IF NOT EXISTS groceries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      unit TEXT NOT NULL,
      quantity REAL NOT NULL,
      price REAL NOT NULL,
      date TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// Routes
app.get('/api/groceries', (req, res) => {
  db.all('SELECT * FROM groceries', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/groceries', (req, res) => {
  const { name, unit, quantity, price } = req.body;
  db.run(
    'INSERT INTO groceries (name, unit, quantity, price) VALUES (?, ?, ?, ?)',
    [name, unit, quantity, price],
    function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({
        id: this.lastID,
        ...req.body
      });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🚀`);
});