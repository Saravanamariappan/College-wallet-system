import React from 'react';
import TransactionTable from '@/components/common/TransactionTable';
import { mockTransactions } from '@/data/mockData';

const AdminTransactions: React.FC = () => {
  const totalVolume = mockTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const successfulTx = mockTransactions.filter(tx => tx.status === 'success').length;
  const pendingTx = mockTransactions.filter(tx => tx.status === 'pending').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-1">All Transactions</h1>
        <p className="text-muted-foreground">System-wide transaction history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold gradient-text">₹{totalVolume.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Volume</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-success">{successfulTx}</p>
          <p className="text-sm text-muted-foreground">Successful</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-warning">{pendingTx}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
      </div>

      <TransactionTable transactions={mockTransactions} />
    </div>
  );
};

export default AdminTransactions;
