import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SendTokens = () => {
  const [vendorId, setVendorId] = useState('');
  const [amount, setAmount] = useState(''); // Changed to string for better input handling
  const navigate = useNavigate();

  const availableBalance = 2450.75; // From dashboard screenshot
  const transactionFee = 10.00;

  const handleSend = () => {
    const parsedAmount = parseFloat(amount);
    if (vendorId && parsedAmount > 0 && parsedAmount + transactionFee <= availableBalance) {
      alert(`Tokens sent! ₹${parsedAmount.toFixed(2)} to Vendor ${vendorId} (Fee: ₹${transactionFee.toFixed(2)})`);
      navigate('/');
    } else if (parsedAmount + transactionFee > availableBalance) {
      alert('Insufficient balance!');
    } else {
      alert('Please enter a valid Vendor ID and Amount!');
    }
  };

  return (
    <div className="page-container">
      <Link to="/" className="back-link">
        ← Back to Dashboard
      </Link>

      <h1 className="page-title">Send Tokens</h1>
      <p className="page-description">Transfer tokens to vendors</p>

      {/* Vendor ID Input */}
      <div className="form-card">
        <label htmlFor="vendorId" className="form-label">Vendor ID</label>
        <div className="input-with-button">
          <input
            id="vendorId"
            type="text"
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            placeholder="Enter Vendor ID (e.g., VEN12345)"
            className="text-input"
          />
          <button className="icon-button">
            📸
          </button>
        </div>
      </div>

      {/* Amount Input */}
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
          <span>Available Balance</span>
          <span>₹{availableBalance.toFixed(2)}</span>
        </div>
        <div className="info-row fee-row">
          <span>Transaction Fee</span>
          <span>₹{transactionFee.toFixed(2)}</span>
        </div>
      </div>

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={!vendorId || parseFloat(amount) <= 0 || parseFloat(amount) + transactionFee > availableBalance}
        className="primary-button full-width-button"
      >
        ➤ Send Tokens
      </button>

      {/* Tip Box */}
      <div className="tip-box info-tip">
        <span className="tip-icon">⚠️</span>
        <div>
          <strong>Tip:</strong> Make sure to verify the vendor ID before sending tokens. Transactions cannot be reversed.
        </div>
      </div>
    </div>
  );
};

export default SendTokens;