import React, { useEffect, useState } from "react";
import {
  Users,
  Store,
  Coins,
  ArrowLeftRight,
  Wallet,
  ExternalLink
} from "lucide-react";

import StatCard from "@/components/common/StatCard";
import api from "@/lib/api";
import { toast } from "sonner";

interface VendorPayment {
  id: number;
  vendor_name: string;
  vendor_wallet: string;
  amount: number;
  tx_hash: string;
  created_at: string;
}

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [payments, setPayments] = useState<VendorPayment[]>([]);
  const [loading, setLoading] = useState(true);

  const [showWallet, setShowWallet] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState<any>(null);

  /* ================= LOAD DASHBOARD ================= */
  useEffect(() => {
    loadDashboard();
    loadVendorPayments();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data.stats);
    } catch {
      toast.error("Dashboard load failed");
    } finally {
      setLoading(false);
    }
  };

  const loadVendorPayments = async () => {
    try {
      const res = await api.get("/admin/vendor-admin-transactions");
      setPayments(res.data.transactions || []);
    } catch {
      toast.error("Failed to load payment history");
    }
  };

  /* ================= ADMIN WALLET ================= */
  const loadAdminWallet = async () => {
    try {
      setWalletLoading(true);
      const res = await api.get("/admin/wallet-balance");
      setWalletBalance(res.data);
    } catch {
      toast.error("Failed to load admin wallet");
    } finally {
      setWalletLoading(false);
    }
  };

  const handleToggleWallet = async () => {
    setShowWallet(!showWallet);
    if (!walletBalance) await loadAdminWallet();
  };

  if (loading) return <p>Loading...</p>;

  const statCards = [
    { title: "Total Students", value: stats.students || 0, icon: <Users /> },
    { title: "Total Vendors", value: stats.vendors || 0, icon: <Store /> },
    { title: "Tokens Minted", value: stats.minted || 0, icon: <Coins /> },
    { title: "Transactions", value: stats.transactions || 0, icon: <ArrowLeftRight /> }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Admin Overview</h1>
        <p className="text-muted-foreground mt-2">
          Monitor system statistics and manage administrative functions
        </p>
      </div>

      {/* Statistics Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">System Statistics</h2>
        <div className="glass-card rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Metric</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Value</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Icon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {statCards.map((stat, index) => (
                <tr key={stat.title} className="hover:bg-secondary/10 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {stat.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                      {stat.icon}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Admin Wallet Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Admin Wallet</h2>
          <button
            onClick={handleToggleWallet}
            className="btn-primary"
          >
            {showWallet ? "Hide Balance" : "Show Balance"}
          </button>
        </div>

        {showWallet && (
          <div className="glass-card p-6 rounded-lg max-w-md">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Wallet size={18} />
              Wallet Details
            </h3>

            {walletLoading ? (
              <p className="text-muted-foreground">Loading wallet information...</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Wallet Address</p>
                  <p className="font-mono text-sm break-all bg-secondary/20 p-2 rounded">
                    {walletBalance?.wallet}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">POL Balance</p>
                    <p className="font-semibold text-lg">
                      {Number(walletBalance?.polBalance).toFixed(4)} POL
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Token Balance</p>
                    <p className="font-semibold text-lg">
                      {Number(walletBalance?.tokenBalance).toFixed(4)} KGCT
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Vendor Payment History */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Vendor Payment History</h2>
        <div className="glass-card p-6 rounded-lg">
          <h3 className="font-semibold mb-4 text-muted-foreground">
            Recent Payments from Vendors to Admin
          </h3>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {payments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No transactions found
              </p>
            ) : (
              payments.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center bg-secondary/20 p-4 rounded-lg hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground">
                        {p.amount} KGCT
                      </p>
                      <a
                        href={`https://amoy.polygonscan.com/tx/${p.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {p.vendor_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(p.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminOverview;
