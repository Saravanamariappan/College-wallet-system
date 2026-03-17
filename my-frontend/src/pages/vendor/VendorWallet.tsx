import React, { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  TrendingUp,
  DollarSign,
  Users,
  Wallet,
  Search,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import WalletCard from "@/components/common/WalletCard";
import StatCard from "@/components/common/StatCard";
import { toast } from "sonner";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api`;

interface Tx {
  id: number;
  student_wallet: string;
  amount: number;
  created_at: string;
}

const VendorWallet: React.FC = () => {
  const { user } = useAuth();

  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter(tx =>
    tx.student_wallet.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-muted-foreground animate-pulse">
          Loading vendor wallet...
        </p>
      </div>
    );
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
      trend: "",
      trendUp: true,
    },
    {
      title: "Total Customers",
      value: `${new Set(transactions.map((tx) => tx.student_wallet)).size
        }`,
      icon: <Users className="w-6 h-6 text-primary" />,
      trend: "",
      trendUp: true,
    },
    {
      title: "Wallet Balance",
      value: `${balance} KGCT`,
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      trend: "",
      trendUp: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-4 h-full relative">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-3 rounded-xl">
          <Wallet className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">
            Vendor Wallet
          </h1>
          <p className="text-muted-foreground text-sm">
            Monitor your earnings & customer payments
          </p>
        </div>
      </div>

      {/* Unified Dashboard Section */}
      <div className="glass-card flex flex-col p-4 rounded-2xl shadow-sm gap-3">
        {/* Top half: Wallet Info */}
        <div className="w-full">
          <WalletCard
            address={wallet}
            balance={balance}
            name={user?.name ?? "Vendor"}
          />
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-white/20 my-1"></div>

        {/* Bottom half: Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">

          {/* Revenue Card - Primary Gradient */}
          <div className="bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 p-6 rounded-2xl shadow-md hover:shadow-primary/10 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
              <DollarSign className="w-20 h-20 text-primary" />
            </div>
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2.5 rounded-xl">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Today's Revenue</p>
              </div>
              <p className="text-3xl lg:text-4xl font-black text-primary mt-2">
                {todayRevenue} <span className="text-lg font-bold text-primary/70">KGCT</span>
              </p>
            </div>
          </div>

          {/* Customers Card - Fuchsia Gradient */}
          <div className="bg-gradient-to-br from-fuchsia-500/20 via-fuchsia-500/5 to-transparent border border-fuchsia-500/20 p-6 rounded-2xl shadow-md hover:shadow-fuchsia-500/10 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
              <Users className="w-20 h-20 text-fuchsia-500" />
            </div>
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="bg-fuchsia-500/20 p-2.5 rounded-xl">
                  <Users className="w-6 h-6 text-fuchsia-500" />
                </div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Customers</p>
              </div>
              <p className="text-3xl lg:text-4xl font-black text-fuchsia-500 mt-2">
                {new Set(transactions.map((tx) => tx.student_wallet)).size}
              </p>
            </div>
          </div>

          {/* Wallet Balance Card - Indigo Gradient */}
          <div className="bg-gradient-to-br from-indigo-500/20 via-indigo-500/5 to-transparent border border-indigo-500/20 p-6 rounded-2xl shadow-md hover:shadow-indigo-500/10 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
              <TrendingUp className="w-20 h-20 text-indigo-500" />
            </div>
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500/20 p-2.5 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-indigo-500" />
                </div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Wallet Balance</p>
              </div>
              <p className="text-3xl lg:text-4xl font-black text-indigo-500 mt-2">
                {balance} <span className="text-lg font-bold text-indigo-500/70">KGCT</span>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Recent Payments */}
      <div className="glass-card p-6 rounded-2xl shadow-sm flex flex-col min-h-[400px] max-h-[500px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="font-semibold text-lg shrink-0">Recent Payments</h3>
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search wallet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 space-y-4 pr-2" style={{ scrollbarWidth: 'thin' }}>
          {filteredTransactions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No transactions found
            </p>
          )}

          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition shrink-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center shrink-0">
                  <ArrowDownLeft className="w-5 h-5 text-success" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm font-mono truncate">
                    {tx.student_wallet.slice(0, 8)}...
                    {tx.student_wallet.slice(-4)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(tx.created_at).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <p className="font-semibold text-success whitespace-nowrap ml-4 shrink-0">
                +{tx.amount} KGCT
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-base rounded-xl hover:scale-[1.02] transition shrink-0">
        <DollarSign className="w-5 h-5" />
        Withdraw to Bank
      </button>
    </div>
  );
};

export default VendorWallet;