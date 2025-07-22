const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  const query = `INSERT INTO users (email, password) VALUES (?, ?)`;
  db.run(query, [email, hashed], function (err) {
    if (err) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    res.json({ message: 'User registered successfully' });
  });
});

// Login User
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ?`;
  db.get(query, [email], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ message: 'Login successful', user });
  });
});

module.exports = router;
