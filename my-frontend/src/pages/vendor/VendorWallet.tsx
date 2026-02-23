import React, { useEffect, useState } from 'react';
import { ArrowDownLeft, TrendingUp, DollarSign, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import WalletCard from '@/components/common/WalletCard';
import StatCard from '@/components/common/StatCard';
import { toast } from 'sonner';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api`;

interface Tx {
  id: number;
  student_wallet: string;
  amount: number;
  created_at: string;
}

const VendorWallet: React.FC = () => {
  const { user } = useAuth();
  console.log("VENDOR USER:", user);

  const [wallet, setWallet] = useState('');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadDashboard();
    }
  }, [user?.id]);

  const loadDashboard = async () => {
    try {
      const res = await fetch(`${API_BASE}/vendors/dashboard/${user?.id}`);
      const data = await res.json();

      setWallet(data.wallet);
      setBalance(data.balance);

      const txRes = await fetch(
        `${API_BASE}/vendors/transactions/${data.wallet}`
      );

      const txData = await txRes.json();

      setTransactions(txData.transactions || []);

    } catch (err) {
      toast.error("Failed to load vendor dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center">Loading vendor wallet...</p>;
  }

  const todayRevenue = transactions
    .filter(
      (tx) =>
        new Date(tx.created_at).toDateString() ===
        new Date().toDateString()
    )
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const stats = [
    {
      title: "Today's Revenue",
      value: `${todayRevenue} KGCT`,
      icon: <DollarSign className="w-6 h-6 text-primary" />,
      trend: '+',
      trendUp: true,
    },
    {
      title: 'Total Customers',
      value: `${new Set(transactions.map(tx => tx.student_wallet)).size}`,
      icon: <Users className="w-6 h-6 text-primary" />,
      trend: '+',
      trendUp: true,
    },
    {
      title: 'Wallet Balance',
      value: `${balance} KGCT`,
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      trend: '+',
      trendUp: true,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-1">
          Vendor Dashboard
        </h1>
        <p className="text-muted-foreground">
          Track your earnings
        </p>
      </div>

      <WalletCard
        address={wallet}
        balance={balance}
        name={user?.name ?? 'Vendor'}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="glass-card p-4">
        <h3 className="font-semibold mb-4">Recent Payments</h3>

        {transactions.slice(0, 5).map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                <ArrowDownLeft className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-sm font-mono">
                  {tx.student_wallet.slice(0, 8)}...
                  {tx.student_wallet.slice(-4)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(tx.created_at).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            <p className="font-semibold text-success">
              +{tx.amount} KGCT
            </p>
          </div>
        ))}
      </div>

      <button className="btn-primary w-full py-4 flex items-center justify-center gap-2">
        <DollarSign className="w-5 h-5" />
        Withdraw to Bank
      </button>
    </div>
  );
};

export default VendorWallet;
