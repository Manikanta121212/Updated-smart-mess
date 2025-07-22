import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const BillsPage = () => {
  const navigate = useNavigate()

  const [bills, setBills] = useState([])
  const [newBill, setNewBill] = useState({ description: '', amount: 0 })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [error, setError] = useState(null)
  const [numberOfStudents, setNumberOfStudents] = useState(900)
  const [numberOfWorkers, setNumberOfWorkers] = useState(0)
  const [workerSalary, setWorkerSalary] = useState(0)
  const [machineRepairCost, setMachineRepairCost] = useState(0)

  // Fetch bills from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/bills')
      .then(res => res.json())
      .then(data => setBills(data))
      .catch(err => console.error('Error loading bills:', err))
  }, [])

  const calculatePerStudentAmount = useCallback(() => {
    if (bills.length === 0 || numberOfStudents === 0) return 0
    const totalGroceryAmount = bills.reduce((sum, bill) => sum + bill.amount, 0)
    const totalWorkerSalary = numberOfWorkers * workerSalary
    const totalAmount = totalGroceryAmount + totalWorkerSalary + machineRepairCost
    return (totalAmount / numberOfStudents).toFixed(2)
  }, [bills, numberOfStudents, numberOfWorkers, workerSalary, machineRepairCost])

  const handleAddBill = () => {
    if (!newBill.description.trim()) {
      setError('Please enter a description for the bill.')
      return
    }
    if (newBill.amount <= 0) {
      setError('Please enter a valid amount greater than zero.')
      return
    }

    const billToAdd = {
      id: crypto.randomUUID(),
      description: newBill.description,
      amount: newBill.amount,
      date: new Date().toLocaleDateString()
    }

    fetch('http://localhost:5000/api/bills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(billToAdd)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add bill')
        return res.json()
      })
      .then(() => {
        setBills(prev => [...prev, billToAdd])
        setNewBill({ description: '', amount: 0 })
        setIsDialogOpen(false)
      })
      .catch(err => {
        console.error(err)
        setError('Could not add bill. Try again.')
      })
  }

  const handleDeleteBill = id => {
    fetch(`http://localhost:5000/api/bills/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        setBills(prev => prev.filter(bill => bill.id !== id))
      })
      .catch(err => {
        console.error(err)
        setError('Could not delete bill. Try again.')
      })
  }

  const perStudentAmount = calculatePerStudentAmount()

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-center">
        Hostel Bills
      </h2>

      <div className="mb-6 space-y-4">
        {/* Input Fields */}
        {[
          { label: 'No. of Students:', value: numberOfStudents, setter: setNumberOfStudents, id: 'students' },
          { label: 'No. of Workers:', value: numberOfWorkers, setter: setNumberOfWorkers, id: 'workers' },
          { label: 'Worker Salary (₹):', value: workerSalary, setter: setWorkerSalary, id: 'salary' },
          { label: 'Machine Repair Cost (₹):', value: machineRepairCost, setter: setMachineRepairCost, id: 'repair' }
        ].map(({ label, value, setter, id }) => (
          <div key={id} className="flex flex-col sm:flex-row gap-4 items-center">
            <label htmlFor={id} className="w-full sm:w-auto text-right">
              {label}
            </label>
            <input
              id={id}
              type="number"
              value={value || ''}
              onChange={e => setter(parseFloat(e.target.value) || 0)}
              className="w-full sm:w-64"
            />
          </div>
        ))}
      </div>

      {/* Dialog */}
      <div className="dialog" style={{ display: isDialogOpen ? 'block' : 'none' }}>
        <div className="dialog-content">
          <div className="dialog-header">
            <h2 className="dialog-title">Add New Bill</h2>
            <p className="dialog-description">Enter the details of the new bill.</p>
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">Description</label>
              <input
                id="description"
                value={newBill.description}
                onChange={e => setNewBill({ ...newBill, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="amount" className="text-right">Amount (₹)</label>
              <input
                id="amount"
                type="number"
                value={newBill.amount || ''}
                onChange={e => setNewBill({ ...newBill, amount: parseFloat(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
          </div>
          {error && <div className="text-red-600">{error}</div>}
          <div className="dialog-footer flex justify-end gap-2">
            <button onClick={() => setIsDialogOpen(false)}>Cancel</button>
            <button onClick={handleAddBill}>Add</button>
          </div>
        </div>
      </div>

      <button className="mb-4 md:mb-6" onClick={() => setIsDialogOpen(true)}>
        Add Bill
      </button>

      {/* Bill Table */}
      <table className="grocery-table w-full border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Description</th>
            <th className="border p-2">Amount (₹)</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bills.map(bill => (
            <tr key={bill.id}>
              <td className="border p-2">{bill.description}</td>
              <td className="border p-2">{bill.amount}</td>
              <td className="border p-2">{bill.date}</td>
              <td className="border p-2">
                <button onClick={() => handleDeleteBill(bill.id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="mt-6 md:mt-8 p-4 bg-gray-100 rounded-md shadow-md">
        <h3 className="text-lg md:text-xl font-semibold mb-2">Bill Distribution</h3>
        <p>Total Grocery Amount: ₹{bills.reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)}</p>
        <p>Total Workers Salary: ₹{(numberOfWorkers * workerSalary).toFixed(2)}</p>
        <p>Total Machine Repair Costs: ₹{machineRepairCost.toFixed(2)}</p>
        <p>
          Total Amount: ₹{(
            bills.reduce((sum, bill) => sum + bill.amount, 0) +
            numberOfWorkers * workerSalary +
            machineRepairCost
          ).toFixed(2)}
        </p>
        <p>Amount Each Student Owes: ₹{perStudentAmount}</p>
        <p>Amount Each Student Owes (Daily): ₹{(parseFloat(perStudentAmount) / 30).toFixed(2)}</p>
      </div>

      <div className="mt-6">
        <button onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
      </div>
    </div>
  )
}

export default BillsPage
