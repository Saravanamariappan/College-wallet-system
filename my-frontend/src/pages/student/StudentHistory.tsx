import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import TransactionTable from '@/components/common/TransactionTable';
import { Transaction } from '@/types';

const API_BASE = 'http://localhost:5000/api';

const StudentHistory: React.FC = () => {
  const { user } = useAuth();

  const [filter, setFilter] = useState<'all' | 'sent'>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.walletAddress) return;

    setLoading(true);

    fetch(`${API_BASE}/transactions/student/${user.walletAddress}`)
      .then(res => res.json())
      .then(data => {
        console.log("Student tx response 👉", data);
        setTransactions(data.transactions || []);
      })
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, [user?.walletAddress]);

  const filteredTransactions = useMemo(() => {
    if (filter === 'sent') {
      return transactions.filter(
        tx => tx.studentWallet === user?.walletAddress
      );
    }
    return transactions;
  }, [filter, transactions, user?.walletAddress]);

  const totalSpent = useMemo(() => {
    return transactions.reduce(
      (sum, tx) => sum + Number(tx.amount),
      0
    );
  }, [transactions]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transaction History</h1>
        <p className="text-muted-foreground">All your payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <p>Total Spent</p>
          <p className="text-2xl font-bold text-destructive">
            ₹{totalSpent}
          </p>
        </div>
      </div>

      <TransactionTable transactions={filteredTransactions} />
    </div>
  );
};

export default StudentHistory;
