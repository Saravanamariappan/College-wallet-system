// src/components/Transactions.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Extended sample transactions for full list (added more for demonstration, using current date Oct 15, 2025)
const allTransactions = [
  { id: 1, title: 'Campus Cafeteria', date: '15 Oct 2025', status: 'completed', amount: -150.00, icon: '🍴' },
  { id: 2, title: 'Monthly Allowance', date: '12 Oct 2025', status: 'completed', amount: 2000.00, icon: '💰' },
  { id: 3, title: 'Coffee Shop', date: '11 Oct 2025', status: 'completed', amount: -200.00, icon: '☕' },
  { id: 4, title: 'Bookstore', date: '10 Oct 2025', status: 'completed', amount: 1500.00, icon: '📚' },
  { id: 5, title: 'Library Fee Refund', date: '08 Oct 2025', status: 'completed', amount: 50.00, icon: '📖' },
  { id: 6, title: 'Gym Membership', date: '05 Oct 2025', status: 'completed', amount: -300.00, icon: '🏋️' },
  { id: 7, title: 'Scholarship Deposit', date: '01 Oct 2025', status: 'completed', amount: 5000.00, icon: '🎓' },
];

const Transactions = () => {
  return (
    <div className="page-container">
      <Link to="/" className="back-link">
        ← Back to Dashboard
      </Link>

      <h1 className="page-title">All Transactions</h1>
      <p className="page-description">View your complete transaction history</p>

      {/* Full Transactions List */}
      <div className="recent-transactions">
        <h3>All Transactions</h3>
        {allTransactions.length > 0 ? (
          <ul className="transactions-list">
            {allTransactions.map((trans) => (
              <li key={trans.id} className="transaction-item">
                <div className="transaction-info">
                  <span className="transaction-icon">{trans.icon}</span>
                  <div>
                    <div className="transaction-title">{trans.title}</div>
                    <div className="transaction-date">
                      {trans.date} <span className="status-completed">{trans.status}</span>
                    </div>
                  </div>
                </div>
                <div className={trans.amount < 0 ? 'amount-negative' : 'amount-positive'}>
                  {trans.amount < 0 ? '-' : '+'}₹{Math.abs(trans.amount).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-transactions">No transactions yet.</p>
        )}
      </div>
    </div>
  );
};

export default Transactions;