import { useEffect, useState } from "react";

export default function StudentWallet({ wallet }) {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetch(`/api/blockchain/balance/${wallet}`)
      .then(res => res.json())
      .then(data => setBalance(data.balance));
  }, [wallet]);

  return (
    <div>
      <h2>Student Wallet</h2>
      <p>Wallet Address: {wallet}</p>
      <p>Balance: {balance}</p>
    </div>
  );
}
