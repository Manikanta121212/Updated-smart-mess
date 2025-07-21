// POST /api/absentees
router.post('/', async (req, res) => {
  const { rollNumber, fromDate, toDate } = req.body;
  try {
    await db.run(
      'INSERT INTO absentees (rollNumber, fromDate, toDate) VALUES (?, ?, ?)',
      [rollNumber, fromDate, toDate]
    );
    res.status(201).send('Absence added');
  } catch (err) {
    res.status(500).send('Error adding absence');
  }
});

// GET /api/absentees/:rollNumber
router.get('/:rollNumber', async (req, res) => {
  const { rollNumber } = req.params;
  try {
    const rows = await db.all(
      'SELECT fromDate, toDate FROM absentees WHERE rollNumber = ?',
      [rollNumber]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).send('Error fetching absentees');
  }
});

// DELETE /api/absentees/:rollNumber/:fromDate/:toDate
router.delete('/:rollNumber/:fromDate/:toDate', async (req, res) => {
  const { rollNumber, fromDate, toDate } = req.params;
  try {
    await db.run(
      'DELETE FROM absentees WHERE rollNumber = ? AND fromDate = ? AND toDate = ?',
      [rollNumber, fromDate, toDate]
    );
    res.send('Absence deleted');
  } catch (err) {
    res.status(500).send('Error deleting absence');
  }
});
