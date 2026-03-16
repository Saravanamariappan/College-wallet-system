import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Send,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import WalletCard from "@/components/common/WalletCard";
import { getStudentWallet } from "@/services/studentApi";

const StudentWallet: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && user?.id) {
      fetchWallet();
    }
  }, [authLoading, user?.id]);

  const fetchWallet = async () => {
    try {
      const res = await getStudentWallet(user!.id);

      setWalletAddress(res.data.wallet);
      setBalance(Number(res.data.balance));
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setError("Wallet not created. Contact admin.");
      } else {
        setError("Failed to load wallet");
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-muted-foreground animate-pulse">
          Loading wallet...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-3 rounded-xl">
          <Wallet className="text-primary w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Student Wallet</h1>
          <p className="text-sm text-muted-foreground">
            Student transactions only managed here...
          </p>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="bg-white/20 
                backdrop-blur-md 
                border border-white/30 
                rounded-2xl 
                p-6 
                shadow-lg">

        <WalletCard
          address={walletAddress}
          balance={balance}
          name={user?.email}
        />

      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">

        {/* Total Spent Card - Fuchsia Gradient */}
        <div className="bg-gradient-to-br from-fuchsia-500/20 via-fuchsia-500/5 to-transparent border border-fuchsia-500/20 p-6 rounded-2xl shadow-md hover:shadow-fuchsia-500/10 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
            <ArrowUpRight className="w-20 h-20 text-fuchsia-500" />
          </div>
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="bg-fuchsia-500/20 p-2.5 rounded-xl">
                <ArrowUpRight className="w-6 h-6 text-fuchsia-500" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Spent</p>
            </div>
            <p className="text-3xl lg:text-4xl font-black text-fuchsia-500 mt-2">
              <span className="text-lg font-bold text-fuchsia-500/70">₹</span>2450
            </p>
          </div>
        </div>

        {/* Total Received Card - Primary Gradient */}
        <div className="bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 p-6 rounded-2xl shadow-md hover:shadow-primary/10 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
            <ArrowDownLeft className="w-20 h-20 text-primary" />
          </div>
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2.5 rounded-xl">
                <ArrowDownLeft className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Received</p>
            </div>
            <p className="text-3xl lg:text-4xl font-black text-primary mt-2">
              <span className="text-lg font-bold text-primary/70">₹</span>500
            </p>
          </div>
        </div>

        {/* Savings Growth Card - Indigo Gradient */}
        <div className="bg-gradient-to-br from-indigo-500/20 via-indigo-500/5 to-transparent border border-indigo-500/20 p-6 rounded-2xl shadow-md hover:shadow-indigo-500/10 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
            <TrendingUp className="w-20 h-20 text-indigo-500" />
          </div>
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500/20 p-2.5 rounded-xl">
                <TrendingUp className="w-6 h-6 text-indigo-500" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Savings Growth</p>
            </div>
            <p className="text-3xl lg:text-4xl font-black text-indigo-500 mt-2">
              +12<span className="text-lg font-bold text-indigo-500/70">%</span>
            </p>
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-4 text-lg">Quick Actions</h3>

        <button
          onClick={() => navigate("/student/pay")}
          className="btn-primary py-3 w-full flex items-center justify-center gap-2 text-base rounded-lg hover:scale-[1.02] transition"
        >
          <Send className="w-4 h-4" /> Send Money
        </button>
      </div>
    </div>
  );
};

export default StudentWallet;