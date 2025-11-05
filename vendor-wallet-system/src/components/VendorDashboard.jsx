import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaWallet, FaPaperPlane, FaLink, FaUtensils, FaMoneyBillWave, FaCoffee, FaBook, FaInfoCircle } from 'react-icons/fa';
import { ethers } from 'ethers'; // For Web3 connection

// Sample data (same as before)
const earningsData = [
  { day: 'Mon', amount: 450 },
  { day: 'Tue', amount: 320 },
  { day: 'Wed', amount: 280 },
  { day: 'Thu', amount: 410 },
  { day: 'Fri', amount: 150 },
  { day: 'Sat', amount: 0 },
  { day: 'Sun', amount: 0 },
];

const transactions = [
  { id: 1, title: 'Payment from Student C205T001', date: '04 Nov 2025', status: 'completed', amount: 150.00, icon: <FaUtensils /> },
  { id: 2, title: 'Refund Issued', date: '01 Nov 2025', status: 'completed', amount: -200.00, icon: <FaMoneyBillWave /> },
  { id: 3, title: 'Payment from Student C204T002', date: '31 Oct 2025', status: 'completed', amount: 200.00, icon: <FaCoffee /> },
  { id: 4, title: 'Bulk Sale', date: '30 Oct 2025', status: 'completed', amount: 1500.00, icon: <FaBook /> },
  { id: 5, title: 'Service Fee', date: '28 Oct 2025', status: 'completed', amount: -50.00, icon: <FaWallet /> },
];

const VendorDashboard = () => {
  const [account, setAccount] = useState(null); // State for connected account
  const [isConnecting, setIsConnecting] = useState(false); // Loading state

  const handleConnectWallet = async () => {
    if (isConnecting) return;

    try {
      setIsConnecting(true);
      console.log('Starting connect...'); // Debug log

      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        alert('MetaMask install பண்ணுங்க! Download: https://metamask.io');
        console.log('No MetaMask detected');
        return;
      }
      console.log('MetaMask detected');

      // Get current accounts
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        console.log('Already connected to accounts:', accounts);
        const address = accounts[0];
        setAccount(address);
        alert(`Already connected! Address: ${address.slice(0, 6)}...${address.slice(-4)}`);
        return; // No need for popup
      }

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

      // Request account access (this triggers popup)
      console.log('Requesting accounts...');
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
    <div className="dashboard">
      {/* App Header */}
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
      {/* Vendor Dashboard Title */}
      <h1 className="dashboard-main-title">Vendor Dashboard</h1>
      {/* Balance Cards - Vendor Focus */}
      <div className="cards-wrapper">
        <div className="balance-card primary-gradient">
          <h3>Total Received</h3>
          <h2>₹5,250.75</h2>
          <p>This Month: ₹2,850.00</p>
          <p>This Week: ₹1,610.00</p>
        </div>
        <div className="balance-card spending-card">
          <h3>Weekly Earnings</h3>
          <h2>₹1,999.50</h2>
          <p>22% up from last week</p>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={earningsData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="day" hide={true} />
              <YAxis hide={true} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--primary-teal)" opacity={0.3} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="var(--primary-teal)"
                strokeWidth={3}
                fill="url(#colorEarnings)"
              />
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary-teal)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--primary-teal)" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Action Buttons - Vendor Actions */}
      <div className="action-buttons-wrapper">
        <Link to="/receive" className="action-button primary-button">
          <FaPaperPlane /> Receive Tokens
        </Link>
        <button 
          className="action-button secondary-button" 
          onClick={handleConnectWallet}
          disabled={isConnecting || account}
        >
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
        <Link to="/vendor-transactions" className="view-all-link">View All</Link>
      </div>
      {/* Tip Box */}
      <div className="tip-box">
        <span className="tip-icon"><FaInfoCircle /></span>
        <div>
          <p><strong>Tip:</strong> Popup இல்லனா MetaMask-ல manual approve check பண்ணுங்க or reload பண்ணுங்க. Console (F12) logs பாருங்க!</p>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;