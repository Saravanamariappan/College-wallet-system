import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ReceiveTokens = () => {
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();
  const expectedBalance = 5250.75;
  const transactionFee = 5.00;

  const handleReceive = () => {
    const parsedAmount = parseFloat(amount);
    if (studentId && parsedAmount > 0) {
      alert(`Tokens received! ₹${parsedAmount.toFixed(2)} from Student ${studentId} (Fee: ₹${transactionFee.toFixed(2)})`);
      navigate('/vendor-dashboard');
    } else {
      alert('Please enter a valid Student ID and Amount!');
    }
  };

  return (
    <div className="page-container">
      <Link to="/vendor-dashboard" className="back-link">← Back to Dashboard</Link>
      <h1 className="page-title">Receive Tokens</h1>
      <p className="page-description">Generate request for students</p>
      <div className="form-card">
        <label htmlFor="studentId" className="form-label">Student ID</label>
        <div className="input-with-button">
          <input
            id="studentId"
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter Student ID (e.g., C205T001)"
            className="text-input"
          />
          <button className="icon-button" type="button">🔍</button>
        </div>
      </div>
      <div className="form-card">
        <label htmlFor="amount" className="form-label">Amount (₹)</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          className="text-input large-input"
        />
        <div className="info-row">
          <span>Expected Total</span>
          <span>₹{expectedBalance.toFixed(2)}</span>
        </div>
        <div className="info-row fee-row">
          <span>Transaction Fee</span>
          <span>₹{transactionFee.toFixed(2)}</span>
        </div>
      </div>
      <button
        onClick={handleReceive}
        disabled={!studentId || parseFloat(amount) <= 0}
        className="action-button primary-button full-width-button"
      >
        ✓ Generate QR & Receive
      </button>
      <div className="tip-box info-tip">
        <span className="tip-icon">⚠️</span>
        <div>
          <strong>Tip:</strong> Share the generated QR with students for instant payments. Verify Student ID to avoid errors.
        </div>
      </div>
    </div>
  );
};

export default ReceiveTokens;