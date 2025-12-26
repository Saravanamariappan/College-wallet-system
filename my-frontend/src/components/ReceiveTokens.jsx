import React, { useState } from "react";
import { Link } from "react-router-dom";

const ReceiveTokens = () => {
  const [amount, setAmount] = useState("");

  const receive = () => {
    console.log("Receive:", amount);

    // 🔒 FUTURE API
    // POST /api/vendor/receive
    alert("Tokens received (demo)");
  };

  return (
    <div className="page-container">
      <Link to="/vendor-dashboard">← Back</Link>
      <h1>Receive Tokens</h1>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={receive} className="primary-button">
        Receive
      </button>
    </div>
  );
};

export default ReceiveTokens;
