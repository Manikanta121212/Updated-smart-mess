import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Papa from 'papaparse'
import './index.css'

const API_URL = 'http://localhost:3001/api/students'

const StudentManagement = () => {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [rollNumber, setRollNumber] = useState('')
  const [name, setName] = useState('')
  const [editId, setEditId] = useState(null)
  const [file, setFile] = useState(null)

  const fetchStudents = async () => {
    const res = await fetch(API_URL)
    const data = await res.json()
    setStudents(data)
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleAddOrUpdate = async () => {
    if (!rollNumber || !name) {
      alert('Please enter both roll number and name')
      return
    }

    const student = { rollNumber, name }

    if (editId) {
      await fetch(`${API_URL}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
      })
      setEditId(null)
    } else {
      const exists = students.some(s => s.rollNumber === rollNumber)
      if (exists) {
        alert('Roll number already exists')
        return
      }
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
      })
    }

    setRollNumber('')
    setName('')
    fetchStudents()
  }

  const handleEdit = student => {
    setRollNumber(student.rollNumber)
    setName(student.name)
    setEditId(student.id)
  }

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      fetchStudents()
    }
  }

  const handleFileChange = e => {
    setFile(e.target.files[0])
  }

  const handleFileImport = () => {
    if (!file) {
      alert('Please choose a CSV file')
      return
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async results => {
        const valid = results.data.filter(r => r.rollNumber && r.name)
        if (valid.length === 0) return alert('No valid rows in CSV')

        const res = await fetch(`${API_URL}/import`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ students: valid }),
        })

        const { addedCount } = await res.json()
        alert(`${addedCount} students imported.`)
        fetchStudents()
        setFile(null)
      },
      error: err => alert('Error reading file: ' + err.message),
    })
  }

  return (
    <div className="student-management">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h2>Student Management</h2>

      <div className="form-group">
        <label>Roll Number</label>
        <input value={rollNumber} onChange={e => setRollNumber(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} />
      </div>
      <button onClick={handleAddOrUpdate} className="btn">
        {editId ? 'Update' : 'Add'} Student
      </button>

      <hr />

      <div className="form-group">
        <label>Import CSV</label>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileImport} className="btn" style={{ marginTop: 10 }}>
          Import Students
        </button>
      </div>

      <table className="report-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Roll Number</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, idx) => (
            <tr key={student.id}>
              <td>{idx + 1}</td>
              <td>{student.rollNumber}</td>
              <td>{student.name}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(student)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(student.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StudentManagement
