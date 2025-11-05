import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers'; // Added for Web3 connection (run: npm install ethers)

// Extended sample transactions for full list (added more for demonstration, using current date Nov 04, 2025)
const allTransactions = [
  { id: 1, title: 'Campus Cafeteria', date: '04 Nov 2025', status: 'completed', amount: -150.00, icon: '🍴' },
  { id: 2, title: 'Monthly Allowance', date: '01 Nov 2025', status: 'completed', amount: 2000.00, icon: '💰' },
  { id: 3, title: 'Coffee Shop', date: '31 Oct 2025', status: 'completed', amount: -200.00, icon: '☕' },
  { id: 4, title: 'Bookstore', date: '30 Oct 2025', status: 'completed', amount: 1500.00, icon: '📚' },
  { id: 5, title: 'Library Fee Refund', date: '28 Oct 2025', status: 'completed', amount: 50.00, icon: '📖' },
  { id: 6, title: 'Gym Membership', date: '25 Oct 2025', status: 'completed', amount: -300.00, icon: '🏋️' },
  { id: 7, title: 'Scholarship Deposit', date: '20 Oct 2025', status: 'completed', amount: 5000.00, icon: '🎓' },
];

const Transactions = () => {
  const [account, setAccount] = useState(null); // Added: State for connected account
  const [isConnecting, setIsConnecting] = useState(false); // Added: Loading state

  const handleConnectWallet = async () => {
    if (isConnecting) return;

    try {
      setIsConnecting(true);
      console.log('Student transactions connect starting... Force popup...'); // Debug log

      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        alert("MetaMask install பண்ணுங்க! Download: https://metamask.io");
        console.log('No MetaMask detected');
        return;
      }
      console.log('MetaMask detected');

      // Switch to Sepolia Testnet (chainId: 0xaa36a7)
      const sepoliaChainId = '0xaa36a7';
      console.log('Switching to Sepolia for Student transactions...');
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: sepoliaChainId }],
        });
        console.log('Student transactions switched to Sepolia successfully');
      } catch (switchError) {
        console.log('Student transactions switch error:', switchError.code, switchError.message);
        if (switchError.code === 4902) { // Chain not added
          console.log('Adding Sepolia chain for Student transactions...');
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
          console.log('Student transactions Sepolia chain added');
        } else {
          alert(`Student transactions Network switch failed: ${switchError.message}. Manual Sepolia switch பண்ணுங்க MetaMask-ல.`);
          return;
        }
      }

      // Always request accounts to force popup (even if previously connected)
      console.log('Student transactions forcing account request (popup)...');
      const accountsReq = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Student transactions accounts requested:', accountsReq);

      if (accountsReq.length === 0) {
        alert('Student transactions Permission denied! MetaMask-ல approve பண்ணுங்க.');
        return;
      }

      // Get signer and address
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      alert(`Student Transactions Connected to Sepolia Testnet! Address: ${address.slice(0, 6)}...${address.slice(-4)}`);

      // Listen for changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setAccount(null);
          console.log('Student transactions Disconnected');
        } else {
          setAccount(accounts[0]);
          console.log('Student transactions Account changed to:', accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', (chainId) => {
        if (chainId !== sepoliaChainId) {
          alert('Student transactions: Sepolia Testnet-க்கு switch பண்ணுங்க!');
          console.log('Student transactions Chain changed to:', chainId);
        }
      });

    } catch (error) {
      console.error('Student transactions Connection failed:', error);
      alert('Student transactions Connect failed! Error: ' + error.message + '\nConsole check பண்ணுங்க (F12).');
      setAccount(null);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="page-container">
      <Link to="/" className="back-link">
        ← Back to Dashboard
      </Link>

      <h1 className="page-title">All Transactions</h1>
      <p className="page-description">View your complete transaction history</p>

      {/* Added: Connect Wallet Button */}
      <div className="action-buttons-wrapper" style={{ marginBottom: '1rem' }}>
        <button className="action-button secondary-button" onClick={handleConnectWallet} disabled={isConnecting}>
          <FaLink /> {isConnecting ? 'Connecting...' : account ? 'Student Transactions Connected' : 'Connect Wallet for Transactions (Sepolia Testnet)'}
        </button>
      </div>

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