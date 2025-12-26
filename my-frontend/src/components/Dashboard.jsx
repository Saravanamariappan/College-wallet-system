import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaWallet, FaPaperPlane, FaInfoCircle } from "react-icons/fa";

const StudentDashboard = () => {
  const [walletId] = useState("CW-STU-9X82KD");
  const [balance, setBalance] = useState(1250);

  useEffect(() => {
    // 🔒 FUTURE API
    // GET /api/student/dashboard
    // setBalance(response.balance)
  }, []);

  return (
    <div className="dashboard-container">
      <div className="app-header">
        <FaWallet size={28} />
        <h2>Student Dashboard</h2>
      </div>

      <div className="balance-card primary-gradient">
        <h3>Wallet ID</h3>
        <p>{walletId}</p>
        <h3>Balance</h3>
        <h2>{balance} COLT</h2>
      </div>

      {/* Student actions */}
      <div className="action-buttons-wrapper">
        <Link to="/send" className="primary-button">
          <FaPaperPlane /> Spend Tokens
        </Link>
      </div>

      <div className="tip-box">
        <FaInfoCircle />
        <span>
          This is an <b>internal college wallet</b>.  
          No MetaMask • No crypto coins • Only COLT tokens
        </span>
      </div>
    </div>
  );
};

export default StudentDashboard;
