const express = require('express');
const router = express.Router();
const db = require('../db');
// Input validation middleware
const validateGroceryItem = (req, res, next) => {
  const { name, quantity, unit, price, date } = req.body;
  
  if (!name || !quantity || !unit || !price || !date) {
    return res.status(400).json({ 
      error: 'Missing required fields: name, quantity, unit, price, date' 
    });
  }

  if (isNaN(quantity) || isNaN(price)) {
    return res.status(400).json({ 
      error: 'Quantity and price must be numbers' 
    });
  }

  next();
};

// Add grocery item
router.post('/', validateGroceryItem, (req, res) => {
  try {
    const { name, quantity, unit, price, date } = req.body;
    const query = `INSERT INTO groceries (name, quantity, unit, price, date) VALUES (?, ?, ?, ?, ?)`;
    
    db.run(query, [name, quantity, unit, price, date], function (err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Failed to add grocery item',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }
      
      res.status(201).json({ 
        id: this.lastID,
        message: 'Grocery item added successfully'
      });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all groceries
router.get('/', (req, res) => {
  try {
    db.all(`SELECT * FROM groceries ORDER BY date DESC`, [], (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Failed to fetch groceries',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }
      
      res.json(rows);
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;