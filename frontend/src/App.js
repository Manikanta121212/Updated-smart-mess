import React, { useState } from "react";
import LoginPage from "./components/LoginPage/index";
import Dashboard from './components/Dashboard/index';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn ? (
    <Dashboard />
  ) : (
    <LoginPage onLogin={() => setIsLoggedIn(true)} />
  );
};

export default App;
