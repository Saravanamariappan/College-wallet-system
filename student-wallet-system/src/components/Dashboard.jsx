import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaWallet, FaPaperPlane, FaLink, FaUtensils, FaMoneyBillWave, FaCoffee, FaBook, FaInfoCircle } from 'react-icons/fa';
import { ethers } from 'ethers'; // For Web3 connection

// Sample data for weekly spending chart (from screenshot: Mon 220, Tue 165, Wed 110, Wed 55, Fri-Sun 0)
const spendingData = [
  { day: 'Mon', amount: 220 },
  { day: 'Tue', amount: 165 },
  { day: 'Wed', amount: 110 },
  { day: 'Thu', amount: 55 },
  { day: 'Fri', amount: 0 },
  { day: 'Sat', amount: 0 },
  { day: 'Sun', amount: 0 },
];

// Sample transactions (updated with current date Nov 04, 2025 for latest entry)
const transactions = [
  { id: 1, title: 'Campus Cafeteria', date: '04 Nov 2025', status: 'completed', amount: -150.00, icon: <FaUtensils /> },
  { id: 2, title: 'Monthly Allowance', date: '01 Nov 2025', status: 'completed', amount: 2000.00, icon: <FaMoneyBillWave /> },
  { id: 3, title: 'Coffee Shop', date: '31 Oct 2025', status: 'completed', amount: -200.00, icon: <FaCoffee /> },
  { id: 4, title: 'Bookstore', date: '30 Oct 2025', status: 'completed', amount: 1500.00, icon: <FaBook /> },
  { id: 5, title: 'Subscription Service', date: '28 Oct 2025', status: 'completed', amount: -500.00, icon: <FaWallet /> },
  { id: 6, title: 'Weekend outing', date: '25 Oct 2025', status: 'completed', amount: -750.00, icon: <FaPaperPlane /> },
];

const Dashboard = () => {
  const [account, setAccount] = useState(null); // State for connected account
  const [isConnecting, setIsConnecting] = useState(false); // Loading state

  const handleConnectWallet = async () => {
    if (isConnecting) return;

    try {
      setIsConnecting(true);
      console.log('Connect starting... Force popup...'); // Debug log

      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        alert("MetaMask install பண்ணுங்க! Download: https://metamask.io");
        console.log('No MetaMask detected');
        return;
      }
      console.log('MetaMask detected');

      // Switch to Sepolia Testnet (chainId: 0xaa36a7)
      const sepoliaChainId = '0xaa36a7';
      console.log('Switching to Sepolia...');
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: sepoliaChainId }],
        });
        console.log('Switched to Sepolia successfully');
      } catch (switchError) {
        console.log('Switch error:', switchError.code, switchError.message);
        if (switchError.code === 4902) { // Chain not added
          console.log('Adding Sepolia chain...');
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: sepoliaChainId,
                chainName: 'Sepolia Testnet',
                rpcUrls: ['https://rpc.sepolia.org'], // Free RPC
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
          console.log('Sepolia chain added');
        } else {
          alert(`Network switch failed: ${switchError.message}. Manual Sepolia switch பண்ணுங்க MetaMask-ல.`);
          return;
        }
      }

      // Always request accounts to force popup (even if previously connected)
      console.log('Forcing account request (popup)...');
      const accountsReq = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Accounts requested:', accountsReq);

      if (accountsReq.length === 0) {
        alert('Permission denied! MetaMask-ல approve பண்ணுங்க.');
        return;
      }

      // Get signer and address
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      alert(`Connected to Sepolia Testnet! Address: ${address.slice(0, 6)}...${address.slice(-4)}`);

      // Listen for changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setAccount(null);
          console.log('Disconnected');
        } else {
          setAccount(accounts[0]);
          console.log('Account changed to:', accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', (chainId) => {
        if (chainId !== sepoliaChainId) {
          alert('Sepolia Testnet-க்கு switch பண்ணுங்க!');
          console.log('Chain changed to:', chainId);
        }
      });

    } catch (error) {
      console.error('Connection failed:', error);
      alert('Connect failed! Error: ' + error.message + '\nConsole check பண்ணுங்க (F12).');
      setAccount(null);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* App Header with Icon */}
      <div className="app-header">
        <div className="app-icon">
          <FaWallet />
        </div>
        <h2 className="app-title">College Wallet</h2>
        {/* Show connected account */}
        {account ? (
          <div className="connected-account">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </div>
        ) : null}
      </div>

      {/* Student Dashboard Title */}
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
              <Area
                type="monotone"
                dataKey="amount"
                stroke="var(--primary-teal)"
                strokeWidth={3}
                fill="url(#colorSpending)"
              />
               <defs>
                <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary-teal)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--primary-teal)" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons-wrapper">
        <Link to="/send" className="action-button primary-button">
          <FaPaperPlane /> Send Tokens
        </Link>
        <button className="action-button secondary-button" onClick={handleConnectWallet} disabled={isConnecting}>
          <FaLink /> {isConnecting ? 'Connecting...' : account ? 'Connected' : 'Connect Wallet (Sepolia Testnet)'}
        </button>
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
                  <div className="transaction-details"> {/* Added a div for details */}
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