import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Transaction } from '@/types';

interface TransactionTableProps {
  transactions: Transaction[];
  showFrom?: boolean;
  showTo?: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  showFrom = true,
  showTo = true,
}) => {
  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: Transaction['status']) => {
    const classes: Record<string, string> = {
      SUCCESS: 'badge-success',
      FAILED: 'badge-error',
    };
    return classes[status] || 'badge-warning';
  };

  const openPolygonScan = (txHash: string) => {
    window.open(`https://amoy.polygonscan.com/tx/${txHash}`, '_blank');
  };

  if (transactions.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-muted-foreground">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* ================= MOBILE VIEW ================= */}
      <div className="lg:hidden divide-y divide-border/30">
        {transactions.map((tx) => (
          <div key={tx.id} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">
                  {formatDate(tx.createdAt)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(tx.createdAt)}
                </p>
              </div>
              <span className={getStatusBadge(tx.status)}>
                {tx.status}
              </span>
            </div>

            {showFrom && (
              <div>
                <p className="text-xs text-muted-foreground">From</p>
                <p className="font-mono text-sm">
                  {shortenAddress(tx.studentWallet)}
                </p>
              </div>
            )}

            {showTo && (
              <div>
                <p className="text-xs text-muted-foreground">To</p>
                <p className="font-mono text-sm">
                  {shortenAddress(tx.vendorWallet)}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="font-semibold text-primary">
                  {tx.amount} Tokens
                </p>
              </div>
              <button
                onClick={() => openPolygonScan(tx.txHash)}
                className="link-btn flex items-center gap-2"
              >
                <span className="text-xs">Verify</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30 bg-secondary/30">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Date
              </th>
              {showFrom && (
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  From
                </th>
              )}
              {showTo && (
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  To
                </th>
              )}
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Amount
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Verify
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="table-row">
                <td className="p-4">
                  <p className="text-sm">
                    {formatDate(tx.createdAt)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(tx.createdAt)}
                  </p>
                </td>

                {showFrom && (
                  <td className="p-4 font-mono text-sm">
                    {shortenAddress(tx.studentWallet)}
                  </td>
                )}

                {showTo && (
                  <td className="p-4 font-mono text-sm">
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
                    title="View on PolygonScan"
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
