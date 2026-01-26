import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import TransactionTable from '@/components/common/TransactionTable';

type Transaction = {
  id: number;
  studentWallet: string;
  vendorWallet: string;
  amount: number;
  txHash: string;
  createdAt: string;
};

const API_BASE = 'http://localhost:5000/api';

const StudentHistory: React.FC = () => {
  const { user } = useAuth();

  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!user?.walletAddress) return;

    setLoading(true);

    fetch(`${API_BASE}/transactions/student/${user.walletAddress}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setTransactions(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setTransactions([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.walletAddress]);

  /* ================= FILTER ================= */
  const filteredTransactions = useMemo(() => {
    if (!user?.walletAddress) return [];

    return transactions.filter((tx) => {
      if (filter === 'sent')
        return tx.studentWallet === user.walletAddress;

      if (filter === 'received')
        return tx.vendorWallet === user.walletAddress;

      return true;
    });
  }, [filter, transactions, user?.walletAddress]);

  /* ================= STATS ================= */
  const totalSent = useMemo(() => {
    return transactions
      .filter(tx => tx.studentWallet === user?.walletAddress)
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
  }, [transactions, user?.walletAddress]);

  const totalReceived = useMemo(() => {
    return transactions
      .filter(tx => tx.vendorWallet === user?.walletAddress)
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
  }, [transactions, user?.walletAddress]);

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-muted-foreground">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-1">
          Transaction History
        </h1>
        <p className="text-muted-foreground">
          View all your transactions
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl w-fit">
        {(['all', 'sent', 'received'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Total Sent
          </p>
          <p className="text-2xl font-bold text-destructive">
            -{totalSent}
          </p>
        </div>

        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Total Received
          </p>
          <p className="text-2xl font-bold text-success">
            +{totalReceived}
          </p>
        </div>
      </div>

      {/* Table */}
      <TransactionTable transactions={filteredTransactions} />
    </div>
  );
};

export default StudentHistory;
