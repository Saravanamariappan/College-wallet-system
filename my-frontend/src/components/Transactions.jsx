import { useEffect, useState } from "react";

export default function Transactions({ wallet }) {
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    fetch(`/api/blockchain/transactions/${wallet}`)
      .then(res => res.json())
      .then(data => setTxs(data));
  }, [wallet]);

  return (
    <div>
      <h2>Transaction History</h2>

      {txs.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
              <th>Tx Hash</th>
            </tr>
          </thead>
          <tbody>
            {txs.map((tx, i) => (
              <tr key={i}>
                <td>{tx.from}</td>
                <td>{tx.to}</td>
                <td>{tx.amount}</td>
                <td>
                  {tx.txHash.slice(0, 10)}...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
