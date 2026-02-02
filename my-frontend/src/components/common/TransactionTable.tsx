import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Transaction } from '@/types';

/* ================= TYPES ================= */
interface TransactionTableProps {
  transactions: Transaction[];
  showFrom?: boolean;
  showTo?: boolean;
}

/* ================= COMPONENT ================= */
const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  showFrom = true,
  showTo = true,
}) => {
  const shortenAddress = (addr?: string) => {
    if (!addr) return '—';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const getStatusBadge = (status: Transaction['status']) => {
    const classes: Record<string, string> = {
      SUCCESS: 'badge-success',
      FAILED: 'badge-error',
      PENDING: 'badge-warning',
    };
    return classes[status];
  };

  const openPolygonScan = (txHash: string) => {
    window.open(`https://amoy.polygonscan.com/tx/${txHash}`, '_blank');
  };

  if (transactions.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30 bg-secondary/30">
              <th className="p-4 text-left">Date</th>
              {showFrom && <th className="p-4 text-left">From</th>}
              {showTo && <th className="p-4 text-left">To</th>}
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Verify</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="table-row">
                <td className="p-4">
                  <p>{formatDate(tx.createdAt)}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(tx.createdAt)}
                  </p>
                </td>

                {showFrom && (
                  <td className="p-4 font-mono">
                    {shortenAddress(tx.studentWallet)}
                  </td>
                )}

                {showTo && (
                  <td className="p-4 font-mono">
                    {shortenAddress(tx.vendorWallet)}
                  </td>
                )}

                <td className="p-4 font-semibold text-primary">
                  {tx.amount} Tokens
                </td>

                <td className="p-4">
                  <span className={getStatusBadge(tx.status)}>
                    {tx.status}
                  </span>
                </td>

                <td className="p-4">
                  <button
                    onClick={() => openPolygonScan(tx.txHash)}
                    className="link-btn"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
