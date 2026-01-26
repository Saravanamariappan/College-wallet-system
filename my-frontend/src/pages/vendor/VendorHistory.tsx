import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import TransactionTable from '@/components/common/TransactionTable';

const VendorHistory: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.walletAddress) return;

    fetch(
      `http://localhost:5000/api/transactions/vendor/${user.walletAddress}`
    )
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const totalReceived = transactions.reduce(
    (sum, tx) => sum + Number(tx.amount),
    0
  );

  const successfulTx = transactions.filter(
    tx => tx.status === 'SUCCESS'
  ).length;

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-1">
          Payment History
        </h1>
        <p className="text-muted-foreground">
          All received payments
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Total Received
          </p>
          <p className="text-2xl font-bold text-success">
            ₹{totalReceived}
          </p>
        </div>

        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Successful Transactions
          </p>
          <p className="text-2xl font-bold">{successfulTx}</p>
        </div>
      </div>

      <TransactionTable
        transactions={transactions}
        showTo={false}
      />
    </div>
  );
};

export default VendorHistory;
