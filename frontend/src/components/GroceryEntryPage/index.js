// src/components/GroceryEntry/GroceryEntry.js
import React, {useState, useEffect} from 'react'
import {addGrocery, getGroceries} from '../../api/groceriesApi'

const GroceryEntry = () => {
  const [groceries, setGroceries] = useState([])
  const [form, setForm] = useState({
    name: '',
    quantity: '',
    unit: '',
    price: '',
    date: new Date().toISOString().split('T')[0], // today's date
  })

  useEffect(() => {
    fetchGroceries()
  }, [])

  const fetchGroceries = async () => {
    try {
      const data = await getGroceries()
      setGroceries(data)
    } catch (err) {
      console.error('Error fetching groceries:', err)
    }
  }

  const handleChange = e => {
    const {name, value} = e.target
    setForm(prev => ({...prev, [name]: value}))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await addGrocery(form)
      fetchGroceries() // reload list
      setForm({name: '', quantity: '', unit: '', price: '', date: form.date})
    } catch (err) {
      console.error('Error adding grocery:', err)
    }
  }

  return (
    <div>
      <h2>Grocery Entry</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Item Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
        />
        <input
          name="unit"
          placeholder="Unit (kg/pack)"
          value={form.unit}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />
        <button type="submit">Add</button>
      </form>

      <h3>Grocery List</h3>
      <ul>
        {groceries.map(item => (
          <li key={item.id}>
            {item.name} - {item.quantity} {item.unit} - ₹{item.price} on{' '}
            {item.date}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default GroceryEntry
