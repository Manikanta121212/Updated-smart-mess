import React, { useState, useEffect } from 'react';
import { addGrocery, getGroceries } from '../../api/groceriesApi';
import './index.css';

const GroceryEntry = () => {
  const [groceries, setGroceries] = useState([]);
  const [form, setForm] = useState({
    name: '',
    quantity: '',
    unit: '',
    price: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroceries();
  }, []);

  const fetchGroceries = async () => {
    try {
      setLoading(true);
      const data = await getGroceries();
      setGroceries(data);
    } catch (err) {
      setError('Failed to load groceries');
      console.error('Error fetching groceries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      await addGrocery(form);
      await fetchGroceries();
      setForm({
        name: '',
        quantity: '',
        unit: '',
        price: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      setError('Failed to add grocery item');
      console.error('Error adding grocery:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grocery-container">
      <h2>Grocery Entry</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="grocery-form">
        <div className="form-group">
          <label>Item Name:</label>
          <input
            name="name"
            placeholder="e.g., Rice, Oil"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Quantity:</label>
            <input
              name="quantity"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 5"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Unit:</label>
            <input
              name="unit"
              placeholder="e.g., kg, pack"
              value={form.unit}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Price (₹):</label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g., 250"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Date:</label>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Add Grocery'}
        </button>
      </form>

      <div className="grocery-list">
        <h3>Grocery List</h3>
        {loading ? (
          <p>Loading...</p>
        ) : groceries.length === 0 ? (
          <p>No groceries added yet</p>
        ) : (
          <ul>
            {groceries.map(item => (
              <li key={item.id}>
                <span className="item-name">{item.name}</span>
                <span className="item-details">
                  {item.quantity} {item.unit} - ₹{item.price} on {item.date}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GroceryEntry;