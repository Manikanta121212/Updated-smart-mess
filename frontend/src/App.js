import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import Dashboard from './components/Dashboard'
import GroceryEntry from './components/GroceryEntry'
import UsageUpdate from './components/UsageUpdate'
import Reports from './components/Reports'
import Bills from './components/Bills'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to='/dashboard' replace />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/grocery-entry' element={<GroceryEntry />} />
        <Route path='/usage-update' element={<UsageUpdate />} />
        <Route path='/reports' element={<Reports />} />
        <Route path='/bills' element={<Bills />} />
      </Routes>
    </Router>
  )
}

export default App
