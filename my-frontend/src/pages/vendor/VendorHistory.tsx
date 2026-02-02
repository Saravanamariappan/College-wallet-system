import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import TransactionTable from '@/components/common/TransactionTable';

const API_BASE = 'http://localhost:5000/api';

const VendorHistory: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.walletAddress) return;

    setLoading(true);

    fetch(`${API_BASE}/transactions/vendor/${user.walletAddress}`)
      .then(res => res.json())
      .then(data => setTransactions(data.transactions || []))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, [user?.walletAddress]);

  const totalReceived = useMemo(() => {
    return transactions.reduce(
      (sum, tx) => sum + Number(tx.amount),
      0
    );
  }, [transactions]);

  const successfulTx = useMemo(() => {
    return transactions.filter(tx => tx.status === 'SUCCESS').length;
  }, [transactions]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment History</h1>
        <p className="text-muted-foreground">
          All received payments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <p>Total Received</p>
          <p className="text-2xl font-bold text-success">
            ₹{totalReceived}
          </p>
        </div>

        <div className="glass-card p-4">
          <p>Successful Transactions</p>
          <p className="text-2xl font-bold">
            {successfulTx}
          </p>
        </div>
      </div>

      <TransactionTable transactions={transactions} showTo={false} />
    </div>
  );
};

export default VendorHistory;
