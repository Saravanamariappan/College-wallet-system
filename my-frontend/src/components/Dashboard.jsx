// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import ABI from "../../../blockchain/artifacts/contracts/Lock.sol/StudentWallet.json";

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
  FaPaperPlane,
  FaLink,
  FaUtensils,
  FaMoneyBillWave,
  FaCoffee,
  FaBook,
  FaInfoCircle,
} from "react-icons/fa";

// 🔗 Contract details
const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

// Sample weekly spending data (UI purpose)
const spendingData = [
  { day: "Mon", amount: 220 },
  { day: "Tue", amount: 165 },
  { day: "Wed", amount: 110 },
  { day: "Thu", amount: 55 },
  { day: "Fri", amount: 0 },
  { day: "Sat", amount: 0 },
  { day: "Sun", amount: 0 },
];

const Dashboard = () => {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [contract, setContract] = useState(null);

  /* ===============================
     🔗 Connect Wallet
  ================================*/
  const handleConnectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("❌ MetaMask not installed");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const studentWalletContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI.abi,
        signer
      );

      setAccount(address);
      setContract(studentWalletContract);

      const bal = await studentWalletContract.getBalance();
      setBalance(ethers.formatEther(bal));

      alert("✅ Wallet Connected");
    } catch (err) {
      console.error(err);
      alert("❌ Wallet connection failed");
    }
  };

  /* ===============================
     🔄 Auto load balance if connected
  ================================*/
  useEffect(() => {
    if (contract) {
      loadBalance();
    }
  }, [contract]);

  const loadBalance = async () => {
    try {
      const bal = await contract.getBalance();
      setBalance(ethers.formatEther(bal));
    } catch (err) {
      console.error("Balance fetch error:", err);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="app-header">
        <div className="app-icon">
          <FaWallet />
        </div>
        <h2 className="app-title">College Wallet</h2>
      </div>

      <h1 className="dashboard-main-title">Student Dashboard</h1>

      {/* Wallet Info */}
      <div className="wallet-info">
        <p>
          <strong>Wallet:</strong>{" "}
          {account
            ? `${account.slice(0, 6)}...${account.slice(-4)}`
            : "Not Connected"}
        </p>
      </div>

      {/* Balance Cards */}
      <div className="cards-wrapper">
        <div className="balance-card primary-gradient">
          <h3>Total Balance (Blockchain)</h3>
          <h2>{balance} ETH</h2>
          <p>Live from Smart Contract</p>
        </div>

        <div className="balance-card spending-card">
          <h3>Weekly Spending</h3>
          <h2>₹999.50</h2>
          <p>UI Demo Data</p>

          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={spendingData}>
              <XAxis dataKey="day" hide />
              <YAxis hide />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#00bfa6"
                strokeWidth={3}
                fillOpacity={0.3}
                fill="#00bfa6"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons-wrapper">
        <Link to="/send" className="action-button primary-button">
          <FaPaperPlane /> Send Tokens
        </Link>

        <button
          className="action-button secondary-button"
          onClick={handleConnectWallet}
        >
          <FaLink /> Connect Wallet
        </button>
      </div>

      {/* Tip */}
      <div className="tip-box">
        <span className="tip-icon">
          <FaInfoCircle />
        </span>
        <div>
          <p>
            <strong>Tip:</strong> This balance is fetched directly from the
            blockchain smart contract.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
