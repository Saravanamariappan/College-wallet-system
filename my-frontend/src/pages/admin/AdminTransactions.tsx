import React, { useEffect, useState } from 'react';
import TransactionTable from '@/components/common/TransactionTable';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Transaction } from '@/types';

const AdminTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await api.get('/admin/transactions');
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading transactions...</p>;

  const totalVolume = transactions.reduce(
    (sum, tx) => sum + Number(tx.amount),
    0
  );

  const successfulTx = transactions.filter(
    (tx) => tx.status === 'SUCCESS'
  ).length;

  const failedTx = transactions.filter(
    (tx) => tx.status === 'FAILED'
  ).length;

  const filteredTransactions = transactions.filter((tx) =>
    tx.studentWallet.toLowerCase().includes(search.toLowerCase()) ||
    tx.vendorWallet.toLowerCase().includes(search.toLowerCase()) ||
    tx.txHash.toLowerCase().includes(search.toLowerCase()) ||
    tx.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-1">
        
        </h1>
        <p className="text-muted-foreground">
          System-wide transaction history
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center rounded-lg">
          <p className="text-2xl font-bold gradient-text">
            ₹{totalVolume.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Total Volume</p>
        </div>

        <div className="glass-card p-4 text-center rounded-lg">
          <p className="text-2xl font-bold text-success">
            {successfulTx}
          </p>
          <p className="text-sm text-muted-foreground">Successful</p>
        </div>

        <div className="glass-card p-4 text-center rounded-lg">
          <p className="text-2xl font-bold text-warning">
            {failedTx}
          </p>
          <p className="text-sm text-muted-foreground">Failed</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search by wallet address, transaction hash, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Transactions Container with Scroll */}
      <div className="max-h-96 overflow-y-auto">
        <TransactionTable transactions={filteredTransactions} />
      </div>
    </div>
  );
};

export default AdminTransactions;
