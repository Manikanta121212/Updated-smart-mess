const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// Connect to SQLite database (will create file if not exists)
const dbPath = path.resolve(__dirname, 'mess.db')
const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.error('Error opening database:', err.message)
  } else {
    console.log('Connected to SQLite database')
  }
})

// Create groceries table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS groceries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_name TEXT NOT NULL,
      quantity REAL NOT NULL,
      unit TEXT NOT NULL,
      price_per_unit REAL NOT NULL,
      total_cost REAL NOT NULL,
      date TEXT NOT NULL
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_name TEXT NOT NULL,
      used_quantity REAL NOT NULL,
      unit TEXT NOT NULL,
      date TEXT NOT NULL
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS remaining (
      item_name TEXT PRIMARY KEY,
      remaining_quantity REAL NOT NULL,
      unit TEXT NOT NULL
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      roll_number TEXT PRIMARY KEY,
      name TEXT NOT NULL
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS absentees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      roll_number TEXT NOT NULL,
      from_date TEXT NOT NULL,
      to_date TEXT NOT NULL
    )
  `)
})

module.exports = db
