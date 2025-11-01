import React, { useState } from "react";
import { ethers } from "ethers";

function AdminWallet() {
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error("User rejected connection request");
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask!");
    }
  };

  return (
    <div>
      <h2>Admin Wallet</h2>
      <p>Create a wallet for managing student accounts or transactions.</p>
      {!isConnected ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <button disabled style={{ backgroundColor: "#4caf50" }}>
          Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </button>
      )}

      <div className="stats-container">
        <div className="stat-box" style={{ backgroundColor: "#e1bee7" }}>
          <h2>1256</h2>
          <p>Total Students</p>
        </div>
        <div className="stat-box" style={{ backgroundColor: "#dcedc8" }}>
          <h2>892</h2>
          <p>Active Wallets</p>
        </div>
        <div className="stat-box" style={{ backgroundColor: "#fff9c4" }}>
          <h2>45,178</h2>
          <p>Total Balance</p>
        </div>
        <div className="stat-box" style={{ backgroundColor: "#ffccbc" }}>
          <h2>23</h2>
          <p>Pending</p>
        </div>
      </div>
    </div>
  );
}

export default AdminWallet;
