  import React, { useEffect, useState } from 'react';
  import { Users, Store, Coins, ArrowLeftRight, Wallet } from 'lucide-react';
  import StatCard from '@/components/common/StatCard';
  import api from '@/lib/api';
  import { toast } from 'sonner';

  const AdminOverview: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [admin, setAdmin] = useState<any>(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [balanceLoading, setBalanceLoading] = useState(true);


    useEffect(() => {
      loadDashboard();
    }, []);

    const loadDashboard = async () => {
      try {
        const res = await api.get("/admin/dashboard");

        setStats(res.data.stats);
        setStatsLoading(false);

        // POL balance may be slow → load separately
        setAdmin({ wallet: res.data.admin.wallet });
        
        setTimeout(() => {
          setAdmin(res.data.admin);
          setBalanceLoading(false);
        }, 100); // UI smoothness
      } catch (err) {
        toast.error("Dashboard load failed");
        setStatsLoading(false);
        setBalanceLoading(false);
      }
    };


    if (statsLoading) return <p>Loading overview...</p>;

    if (!stats) return <p>Failed to load dashboard</p>;

    const statCards = [
      {
        title: 'Total Students',
        value: stats.students,
        icon: <Users className="w-6 h-6 text-primary" />,
      },
      {
        title: 'Total Vendors',
        value: stats.vendors,
        icon: <Store className="w-6 h-6 text-primary" />,
      },
      {
        title: 'Tokens Minted',
        value: `₹${stats.minted}`,
        icon: <Coins className="w-6 h-6 text-primary" />,
      },
      {
        title: 'Transactions',
        value: stats.transactions,
        icon: <ArrowLeftRight className="w-6 h-6 text-primary" />,
      },
    ];

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <StatCard key={s.title} {...s} />
          ))}
        </div>

        {/* ADMIN WALLET + POL BALANCE */}
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            Admin Wallet & POL Balance
          </h3>

          <div className="p-4 bg-secondary/30 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">Wallet Address</p>
            <p className="font-mono text-sm break-all">{admin?.wallet}</p>

            <p className="text-sm text-muted-foreground mt-4 mb-1">POL Balance</p>
            <p className="text-lg font-semibold text-success">
              {balanceLoading ? "Fetching balance..." : `${Number(admin?.polBalance).toFixed(6)} POL`}
            </p>

          </div>
        </div>
      </div>
    );
  };

  export default AdminOverview;
