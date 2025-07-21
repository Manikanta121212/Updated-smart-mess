import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'

const BillGenerator = () => {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [absences, setAbsences] = useState({})
  const [usageData, setUsageData] = useState({})
  const [entryData, setEntryData] = useState([])
  const [bills, setBills] = useState([])

  const daysInMonth = 31

  useEffect(() => {
    // Fetch all required data from the backend
    Promise.all([
      fetch('/api/students').then(res => res.json()),
      fetch('/api/absentees').then(res => res.json()),
      fetch('/api/grocery-usage').then(res => res.json()),
      fetch('/api/grocery-entries').then(res => res.json()),
    ])
      .then(([students, absences, usage, entries]) => {
        setStudents(students)
        setAbsences(absences)
        setUsageData(usage)
        setEntryData(entries)
      })
      .catch(err => console.error('Error loading data:', err))
  }, [])

  const getAbsentDays = roll => {
    const ranges = absences[roll] || []
    const daysAbsent = new Set()

    ranges.forEach(({ fromDate, toDate }) => {
      const start = new Date(fromDate)
      const end = new Date(toDate)
      while (start <= end) {
        const day = start.getDate()
        if (day >= 1 && day <= daysInMonth) {
          daysAbsent.add(day)
        }
        start.setDate(start.getDate() + 1)
      }
    })

    return daysAbsent
  }

  const generateBills = () => {
    const perDayCost = Array(daysInMonth).fill(0)

    // Calculate cost for each day
    Object.entries(usageData).forEach(([item, { days = [] }]) => {
      const entry = entryData.find(e => e.name === item)
      const pricePerUnit = entry?.price || 0
      days.forEach((qty, dayIndex) => {
        perDayCost[dayIndex] += qty * pricePerUnit
      })
    })

    const studentBillMap = students.map(student => {
      const absentSet = getAbsentDays(student.rollNumber)
      let total = 0
      let presentDays = 0

      for (let i = 0; i < daysInMonth; i++) {
        const day = i + 1
        if (!absentSet.has(day)) {
          presentDays++
        }
      }

      for (let i = 0; i < daysInMonth; i++) {
        const day = i + 1
        if (!absentSet.has(day)) {
          const presentCount = students.filter(s => !getAbsentDays(s.rollNumber).has(day)).length || 1
          total += perDayCost[i] / presentCount
        }
      }

      return {
        ...student,
        presentDays,
        total: total.toFixed(2),
      }
    })

    setBills(studentBillMap)
  }

  return (
    <div className="student-billing">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h2>Student Billing (Based on Days Present)</h2>
      <button className="btn" onClick={generateBills}>Generate Bills</button>

      {bills.length > 0 && (
        <table className="report-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Roll No</th>
              <th>Name</th>
              <th>Present Days</th>
              <th>Total Bill (₹)</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((student, idx) => (
              <tr key={student.rollNumber}>
                <td>{idx + 1}</td>
                <td>{student.rollNumber}</td>
                <td>{student.name}</td>
                <td>{student.presentDays}</td>
                <td>₹{student.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default BillGenerator
