// groceriesRoutes.js
const express = require('express')
const router = express.Router()
const db = require('../db')

// Get all groceries
router.get('/', (req, res) => {
  db.all('SELECT * FROM groceries ORDER BY date DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({error: err.message})
    }
    res.json(rows)
  })
})

// Add new grocery
router.post('/', (req, res) => {
  const {name, quantity, unit, price, date} = req.body

  db.run(
    'INSERT INTO groceries (name, quantity, unit, price, date) VALUES (?, ?, ?, ?, ?)',
    [name, quantity, unit, price, date],
    function (err) {
      if (err) {
        return res.status(400).json({error: err.message})
      }
      res.json({
        id: this.lastID,
        name,
        quantity,
        unit,
        price,
        date,
      })
    },
  )
})

module.exports = router
