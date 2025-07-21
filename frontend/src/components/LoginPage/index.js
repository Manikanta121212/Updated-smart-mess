import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegistering ? 'register' : 'login';
      const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, {
        email,
        password,
      });

      setMessage(res.data.message || 'Success');
      // You can store user info or redirect after login
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      {message && (
        <div className={message.toLowerCase().includes('success') ? 'success-message' : 'error-message'}>
          {message}
        </div>
      )}
      <form onSubmit={handleAuth}>
        <div className="field-group">
          <label>Email:</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="field-group">
          <label>Password:</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="button-group">
          <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
          <button type="button" onClick={() => setIsRegistering((prev) => !prev)}>
            {isRegistering ? 'Go to Login' : 'Go to Register'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
