// routes/auth.js
const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Dummy credentials for example
  const validUser = 'admin';
  const validPass = '1234';

  if (username === validUser && password === validPass) {
    res.status(200).json({ message: 'Login successful', token: 'dummy-jwt-token' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
