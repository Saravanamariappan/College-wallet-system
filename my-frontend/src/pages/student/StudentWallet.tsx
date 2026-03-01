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
          <h1 className="text-3xl font-bold">My Wallet</h1>
          <p className="text-sm text-muted-foreground">
            Manage your student transactions
          </p>
        </div>
      </div>

      {/* Wallet Card */}
      <WalletCard
        address={walletAddress}
        balance={balance}
        name={user?.email}
      />

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center rounded-xl hover:scale-105 transition">
          <ArrowUpRight className="mx-auto mb-2 text-destructive" />
          <p className="font-bold text-lg text-destructive">₹2450</p>
          <p className="text-xs text-muted-foreground">Total Spent</p>
        </div>

        <div className="glass-card p-4 text-center rounded-xl hover:scale-105 transition">
          <ArrowDownLeft className="mx-auto mb-2 text-success" />
          <p className="font-bold text-lg text-success">₹500</p>
          <p className="text-xs text-muted-foreground">Total Received</p>
        </div>

        <div className="glass-card p-4 text-center rounded-xl hover:scale-105 transition">
          <TrendingUp className="mx-auto mb-2 text-primary" />
          <p className="font-bold text-lg text-primary">+12%</p>
          <p className="text-xs text-muted-foreground">Savings Growth</p>
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