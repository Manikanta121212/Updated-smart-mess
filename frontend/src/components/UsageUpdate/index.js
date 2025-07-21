import React, { useState, useEffect } from 'react';

const UsageUpdate = () => {
  const [usageData, setUsageData] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    date: ''
  });

  const fetchUsageData = async () => {
    try {
      const response = await fetch('http://localhost:5000/usage/all');
      const data = await response.json();
      setUsageData(data);
    } catch (error) {
      console.error('Error fetching usage data:', error);
    }
  };

  useEffect(() => {
    fetchUsageData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, quantity, unit, date } = formData;

    if (!name || !quantity || !date) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/usage/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({ name: '', quantity: '', unit: 'kg', date: '' });
        fetchUsageData();
      } else {
        const err = await response.json();
        alert(err.error || 'Error saving usage');
      }
    } catch (error) {
      console.error('Error submitting usage:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/usage/delete/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchUsageData();
      } else {
        alert('Failed to delete entry');
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <div className="usage-container">
      <h2>Usage Update</h2>

      <form onSubmit={handleSubmit} className="usage-form">
        <input
          type="text"
          name="name"
          placeholder="Item name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
        />
        <select
          name="unit"
          value={formData.unit}
          onChange={handleChange}
        >
          <option value="kg">kg</option>
          <option value="litre">litre</option>
          <option value="pack">pack</option>
        </select>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
        <button type="submit">Save Usage</button>
      </form>

      <table className="usage-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Item</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {usageData.map((item) => (
            <tr key={item.id}>
              <td>{item.date}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.unit}</td>
              <td>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsageUpdate;
