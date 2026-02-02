import React, { useEffect, useState } from 'react';
import TransactionTable from '@/components/common/TransactionTable';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Transaction } from '@/types';

const AdminTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-1">
          All Transactions
        </h1>
        <p className="text-muted-foreground">
          System-wide transaction history
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold gradient-text">
            ₹{totalVolume.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Total Volume</p>
        </div>

        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-success">
            {successfulTx}
          </p>
          <p className="text-sm text-muted-foreground">Successful</p>
        </div>

        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-warning">
            {failedTx}
          </p>
          <p className="text-sm text-muted-foreground">Failed</p>
        </div>
      </div>

      <TransactionTable transactions={transactions} />
    </div>
  );
};

export default AdminTransactions;
