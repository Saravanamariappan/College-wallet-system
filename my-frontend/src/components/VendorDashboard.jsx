import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FaWallet,
  FaUtensils,
  FaMoneyBillWave,
  FaCoffee,
  FaBook,
  FaInfoCircle,
} from "react-icons/fa";

/* Dummy earnings graph data */
const earningsData = [
  { day: "Mon", amount: 450 },
  { day: "Tue", amount: 320 },
  { day: "Wed", amount: 280 },
  { day: "Thu", amount: 410 },
  { day: "Fri", amount: 150 },
  { day: "Sat", amount: 0 },
  { day: "Sun", amount: 0 },
];

/* Dummy transactions (Student → Vendor tokens) */
const transactions = [
  {
    id: 1,
    title: "Payment from Student C205T001",
    date: "04 Nov 2025",
    status: "completed",
    amount: 150,
    icon: <FaUtensils />,
  },
  {
    id: 2,
    title: "Payment from Student C204T002",
    date: "31 Oct 2025",
    status: "completed",
    amount: 200,
    icon: <FaCoffee />,
  },
  {
    id: 3,
    title: "Bulk Sale",
    date: "30 Oct 2025",
    status: "completed",
    amount: 1500,
    icon: <FaBook />,
  },
  {
    id: 4,
    title: "Service Charge",
    date: "28 Oct 2025",
    status: "completed",
    amount: -50,
    icon: <FaMoneyBillWave />,
  },
];

const VendorDashboard = () => {
  const [vendorId] = useState("CW-VEN-CAF-002");
  const [balance, setBalance] = useState(5250.75);

  useEffect(() => {
    // 🔒 FUTURE API
    // GET /api/vendor/dashboard
    // setBalance(response.balance)
  }, []);

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="app-header">
        <FaWallet />
        <h2 className="app-title">College Wallet</h2>
        <div className="connected-account">
          Vendor ID: {vendorId}
        </div>
      </div>

      <h1 className="dashboard-main-title">Vendor Dashboard</h1>

      {/* Balance cards */}
      <div className="cards-wrapper">
        <div className="balance-card primary-gradient">
          <h3>Total Token Received</h3>
          <h2>{balance.toFixed(2)} COLT</h2>
          <p>This Month: 2850 COLT</p>
          <p>This Week: 1610 COLT</p>
        </div>

        <div className="balance-card spending-card">
          <h3>Weekly Earnings</h3>
          <h2>1999.50 COLT</h2>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={earningsData}>
              <XAxis dataKey="day" hide />
              <YAxis hide />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#14b8a6"
                fill="#99f6e4"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vendor cannot send tokens */}
      <div className="tip-box">
        <FaInfoCircle />
        <p>
          Vendor wallet is <b>receive-only</b>.  
          Students spend COLT tokens here.
        </p>
      </div>

      {/* Transactions */}
      <div className="recent-transactions">
        <h3>Recent Transactions</h3>
        <ul className="transactions-list">
          {transactions.map((tx) => (
            <li key={tx.id} className="transaction-item">
              <div className="transaction-info">
                <span className="transaction-icon">{tx.icon}</span>
                <div>
                  <div>{tx.title}</div>
                  <small>{tx.date}</small>
                </div>
              </div>
              <div
                className={
                  tx.amount < 0 ? "amount-negative" : "amount-positive"
                }
              >
                {tx.amount < 0 ? "-" : "+"}
                {Math.abs(tx.amount)} COLT
              </div>
            </li>
          ))}
        </ul>

        <Link to="/vendor-transactions" className="view-all-link">
          View All
        </Link>
      </div>
    </div>
  );
};

export default VendorDashboard;
