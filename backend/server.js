const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');

app.use(cors());
app.use(express.json());

// Import routes
const groceriesApi = require('./routes/groceries');
const studentsApi = require('./routes/students');
const usageApi = require('./routes/usage');
const absenteesApi = require('./routes/absentees');
const billsApi = require('./routes/bills');
const authRoutes = require('./routes/auth');



// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/groceries', groceriesApi);
app.use('/api/students', studentsApi);
app.use('/api/usage', usageApi);
app.use('/api/absentees', absenteesApi);
app.use('/api/bills', billsApi);

// Server start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("API is working!");
});
