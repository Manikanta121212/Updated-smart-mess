import React from "react";

const LoginPage = ({ onLogin }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(); // Accepts any credentials
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" required /><br /><br />
        <input type="password" placeholder="Password" required /><br /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
