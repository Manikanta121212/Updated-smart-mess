import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'

const AbsenceUpdate = () => {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [absentData, setAbsentData] = useState({})
  const [selectedRoll, setSelectedRoll] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  // Fetch all students
  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => console.error('Error fetching students:', err))
  }, [])

  // Fetch absentees for selected student
  useEffect(() => {
    if (!selectedRoll) return
    fetch(`/api/absentees/${selectedRoll}`)
      .then(res => res.json())
      .then(data => {
        setAbsentData(prev => ({ ...prev, [selectedRoll]: data }))
      })
      .catch(err => console.error('Error fetching absentees:', err))
  }, [selectedRoll])

  const handleAddAbsence = async () => {
    if (!selectedRoll || !fromDate || !toDate) {
      alert('Please fill all fields')
      return
    }

    const from = new Date(fromDate)
    const to = new Date(toDate)
    if (from > to) {
      alert('From Date should be earlier than To Date')
      return
    }

    try {
      const res = await fetch('/api/absentees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rollNumber: selectedRoll,
          fromDate,
          toDate,
        }),
      })
      if (res.ok) {
        const updated = [...(absentData[selectedRoll] || []), { fromDate, toDate }]
        setAbsentData({ ...absentData, [selectedRoll]: updated })
        setFromDate('')
        setToDate('')
      } else {
        alert('Failed to add absence')
      }
    } catch (err) {
      console.error('Error adding absence:', err)
    }
  }

  const handleDelete = async (roll, from, to) => {
    try {
      const res = await fetch(`/api/absentees/${roll}/${from}/${to}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        const updated = absentData[roll].filter(
          range => !(range.fromDate === from && range.toDate === to)
        )
        setAbsentData({ ...absentData, [roll]: updated })
      } else {
        alert('Failed to delete absence')
      }
    } catch (err) {
      console.error('Error deleting absence:', err)
    }
  }

  return (
    <div className="absence-update">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>Update Student Absence Days</h2>

      <div className="form-group">
        <label>Roll Number</label>
        <select value={selectedRoll} onChange={e => setSelectedRoll(e.target.value)}>
          <option value="">-- Select --</option>
          {students.map(s => (
            <option key={s.rollNumber} value={s.rollNumber}>
              {s.rollNumber} - {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>From Date</label>
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
      </div>

      <div className="form-group">
        <label>To Date</label>
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
      </div>

      <button onClick={handleAddAbsence} className="btn">
        Add Absence Range
      </button>

      {selectedRoll && absentData[selectedRoll]?.length > 0 && (
        <div className="absent-list">
          <h3>Absent Dates for {selectedRoll}</h3>
          <ul>
            {absentData[selectedRoll].map((range, index) => (
              <li key={index}>
                {range.fromDate} to {range.toDate}
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(selectedRoll, range.fromDate, range.toDate)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}


export default AbsenceUpdate
