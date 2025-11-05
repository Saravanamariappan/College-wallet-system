import React from 'react';
import { Link } from 'react-router-dom';

// Extended transactions for vendor (Nov 2025)
const allTransactions = [
  { id: 1, title: 'Payment from Student C205T001', date: '04 Nov 2025', status: 'completed', amount: 150.00, icon: '🍴' },
  { id: 2, title: 'Refund Issued to Student', date: '01 Nov 2025', status: 'completed', amount: -200.00, icon: '💰' },
  { id: 3, title: 'Payment from Student C204T002', date: '31 Oct 2025', status: 'completed', amount: 200.00, icon: '☕' },
  { id: 4, title: 'Bulk Sale Payment', date: '30 Oct 2025', status: 'completed', amount: 1500.00, icon: '📚' },
  { id: 5, title: 'Library Fee Refund', date: '28 Oct 2025', status: 'completed', amount: 50.00, icon: '📖' },
  { id: 6, title: 'Gym Payment Received', date: '25 Oct 2025', status: 'completed', amount: 300.00, icon: '🏋️' },
  { id: 7, title: 'Scholarship Transfer', date: '20 Oct 2025', status: 'completed', amount: 5000.00, icon: '🎓' },
];

const VendorTransactions = () => {
  return (
    <div className="page-container">
      <Link to="/vendor-dashboard" className="back-link">
        ← Back to Dashboard
      </Link>
      <h1 className="page-title">All Transactions</h1>
      <p className="page-description">View your complete vendor transaction history</p>
      <div className="recent-transactions">
        <h3>All Transactions</h3>
        {allTransactions.length > 0 ? (
          <ul className="transactions-list">
            {allTransactions.map((trans) => (
              <li key={trans.id} className="transaction-item">
                <div className="transaction-info">
                  <span className="transaction-icon">{trans.icon}</span>
                  <div className="transaction-details">
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

export default VendorTransactions;