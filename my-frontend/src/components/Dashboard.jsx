// src/components/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  FaWallet, 
  FaPaperPlane, 
  FaLink, 
  FaUtensils, 
  FaMoneyBillWave, 
  FaCoffee, 
  FaBook, 
  FaInfoCircle 
} from 'react-icons/fa';

// Sample weekly spending data
const spendingData = [
  { day: 'Mon', amount: 220 },
  { day: 'Tue', amount: 165 },
  { day: 'Wed', amount: 110 },
  { day: 'Thu', amount: 55 },
  { day: 'Fri', amount: 0 },
  { day: 'Sat', amount: 0 },
  { day: 'Sun', amount: 0 },
];

// Sample transactions
const transactions = [
  { id: 1, title: 'Campus Cafeteria', date: '15 Oct 2025', status: 'completed', amount: -150.00, icon: <FaUtensils /> },
  { id: 2, title: 'Monthly Allowance', date: '12 Oct 2025', status: 'completed', amount: 2000.00, icon: <FaMoneyBillWave /> },
  { id: 3, title: 'Coffee Shop', date: '11 Oct 2025', status: 'completed', amount: -200.00, icon: <FaCoffee /> },
  { id: 4, title: 'Bookstore', date: '10 Oct 2025', status: 'completed', amount: 1500.00, icon: <FaBook /> },
  { id: 5, title: 'Subscription Service', date: '08 Oct 2025', status: 'completed', amount: -500.00, icon: <FaWallet /> },
  { id: 6, title: 'Weekend outing', date: '07 Oct 2025', status: 'completed', amount: -750.00, icon: <FaPaperPlane /> },
];

const Dashboard = () => {
  const handleConnectWallet = () => {
    alert('Connecting to Wallet... (Implement Web3 connection here)');
  };

  return (
    <div className="dashboard-container">
      {/* App Header */}
      <div className="app-header">
        <div className="app-icon"><FaWallet /></div>
        <h2 className="app-title">College Wallet</h2>
      </div>

      <h1 className="dashboard-main-title">Student Dashboard</h1>

      {/* Balance Cards */}
      <div className="cards-wrapper">
        <div className="balance-card primary-gradient">
          <h3>Total Balance</h3>
          <h2>₹2,450.75</h2>
          <p>This Month: ₹850.00</p>
          <p>This Week: ₹320.50</p>
        </div>
        <div className="balance-card spending-card">
          <h3>Weekly Spending</h3>
          <h2>₹999.50</h2>
          <p>12% from last week</p>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={spendingData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="day" hide={true} />
              <YAxis hide={true} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--light-teal)" opacity={0.3} />
              <Tooltip />
              <defs>
                <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary-teal)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--primary-teal)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="amount"
                stroke="var(--primary-teal)"
                strokeWidth={3}
                fill="url(#colorSpending)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons-wrapper">
        <Link to="/send" className="action-button primary-button"><FaPaperPlane /> Send Tokens</Link>
        <button className="action-button secondary-button" onClick={handleConnectWallet}><FaLink /> Connect Wallet</button>
      </div>

      {/* Recent Transactions */}
      <div className="recent-transactions">
        <h3>Recent Transactions</h3>
        {transactions.length > 0 ? (
          <ul className="transactions-list">
            {transactions.map((trans) => (
              <li key={trans.id} className="transaction-item">
                <div className="transaction-info">
                  <span className="transaction-icon">{trans.icon}</span>
                  <div className="transaction-details">
                    <div className="transaction-title">{trans.title}</div>
                    <div className="transaction-date">{trans.date} <span className="status-completed">{trans.status}</span></div>
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
        <Link to="/transactions" className="view-all-link">View All</Link>
      </div>

      {/* Tip Box */}
      <div className="tip-box">
        <span className="tip-icon"><FaInfoCircle /></span>
        <div>
          <p><strong>Tip:</strong> Keep track of your spending to manage your budget effectively. Use the "Send Tokens" feature for quick payments!</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
