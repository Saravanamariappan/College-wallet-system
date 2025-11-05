// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import VendorDashboard from './components/VendorDashboard';
import ReceiveTokens from './components/ReceiveTokens';
import Transactions from './components/Transactions';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VendorDashboard />} />
        <Route path="/receive" element={<ReceiveTokens />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;