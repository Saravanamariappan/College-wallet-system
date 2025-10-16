// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SendTokens from './components/SendTokens';
import Transactions from './components/Transactions';
import './index.css'; // Make sure your main CSS is imported here or in main.jsx

function App() {
  return (
    <Router>
      {/* This is the new wrapper div */}
      <div className="main-app-container"> 
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/send" element={<SendTokens />} />
          <Route path="/transactions" element={<Transactions />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;