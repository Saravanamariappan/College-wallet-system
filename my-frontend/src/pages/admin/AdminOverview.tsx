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
    { title: "Total Students", value: stats.students, icon: <Users /> },
    { title: "Total Vendors", value: stats.vendors, icon: <Store /> },
    { title: "Tokens Minted", value: stats.minted, icon: <Coins /> },
    { title: "Transactions", value: stats.transactions, icon: <ArrowLeftRight /> }
  ];

  return (
    /* PAGE SCROLL COMPLETELY OFF */
    <div className="space-y-6 overflow-hidden h-full">

      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* TOGGLE WALLET BUTTON */}
      <button onClick={handleToggleWallet} className="btn-primary w-fit">
        {showWallet ? "Hide Admin Balance" : "Show Admin Balance"}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT – PAYMENT HISTORY */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col">
          <h3 className="font-semibold mb-4">
            Vendor → Admin Payment History
          </h3>

          {/* 🔥 ONLY THIS SCROLLS */}
          <div className="space-y-3 overflow-y-auto max-h-[420px] pr-2">
            {payments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center">
                No transactions found
              </p>
            ) : (
              payments.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center bg-secondary/20 p-3 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{p.amount} KGCT</p>

                    <p className="text-xs text-muted-foreground">
                      {p.vendor_name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {new Date(p.created_at).toLocaleString()}
                    </p>
                  </div>

                  <a
                    href={`https://amoy.polygonscan.com/tx/${p.tx_hash}`}
                    target="_blank"
                    className="text-blue-400"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT – ADMIN WALLET */}
        {showWallet && (
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Wallet />
              Admin Wallet
            </h3>

            {walletLoading ? (
              <p>Loading wallet...</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">Wallet Address</p>
                <p className="font-mono break-all">
                  {walletBalance?.wallet}
                </p>

                <p className="mt-4 text-sm text-muted-foreground">
                  POL Balance
                </p>
                <p className="text-lg font-semibold">
                  {Number(walletBalance?.polBalance).toFixed(6)} POL
                </p>

                <p className="mt-4 text-sm text-muted-foreground">
                  Token Balance
                </p>
                <p className="text-lg font-semibold">
                  {Number(walletBalance?.tokenBalance).toFixed(4)} KGCT
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
