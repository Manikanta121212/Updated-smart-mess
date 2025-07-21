import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'

const Reports = () => {
  const navigate = useNavigate()
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadReportData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/report') // Replace with your actual backend
      if (!response.ok) {
        throw new Error('Failed to fetch report data')
      }
      const data = await response.json()
      setReportData(data)
    } catch (err) {
      console.error('Error loading report:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReportData()
  }, [])

  return (
    <div className="report-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>Grocery Stock Report</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : reportData.length === 0 ? (
        <p>No report data available.</p>
      ) : (
        <table className="report-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Item Name</th>
              <th>Total Quantity</th>
              <th>Used Quantity</th>
              <th>Remaining Quantity</th>
              <th>Price/Unit</th>
              <th>Total Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.totalQuantity.toFixed(2)} {item.unit}</td>
                <td>{item.usedQuantity.toFixed(2)} {item.unit}</td>
                <td>{item.remainingQuantity.toFixed(2)} {item.unit}</td>
                <td>₹{item.price.toFixed(2)}</td>
                <td>₹{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Reports
