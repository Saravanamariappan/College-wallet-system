import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Send,
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

      // ✅ MYSQL balance → direct token (NO wei conversion)
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
    return <p className="text-center">Loading wallet...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Wallet</h1>

      <WalletCard
        address={walletAddress}
        balance={balance}
        name={user?.email}
      />

      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-3 text-center">
          <ArrowUpRight className="mx-auto mb-1 text-destructive" />
          <p className="font-bold text-destructive">₹2450</p>
          <p className="text-xs text-muted-foreground">Spent</p>
        </div>

        <div className="glass-card p-3 text-center">
          <ArrowDownLeft className="mx-auto mb-1 text-success" />
          <p className="font-bold text-success">₹500</p>
          <p className="text-xs text-muted-foreground">Received</p>
        </div>

        <div className="glass-card p-3 text-center">
          <TrendingUp className="mx-auto mb-1 text-primary" />
          <p className="font-bold text-primary">+12%</p>
          <p className="text-xs text-muted-foreground">Savings</p>
        </div>
      </div>

      {/* ONLY SEND BUTTON */}
      <div className="glass-card p-4">
        <h3 className="font-semibold mb-3">Quick Actions</h3>

        <button
          onClick={() => navigate("/student/pay")}
          className="btn-primary py-3 w-full flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </div>
    </div>
  );
};

export default StudentWallet;
