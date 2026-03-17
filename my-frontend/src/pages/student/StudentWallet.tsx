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
import { Copy } from "lucide-react";

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
  const copyAddress = () => {
  navigator.clipboard.writeText(walletAddress);
};

  return (
    <div className="space-y-10">

      <div className="space-y-10">

  {/* Header */}
  <div className="flex items-center gap-4">
    
    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl shadow-md">
      <Wallet className="text-white w-6 h-6" />
    </div>

    <div>
      <h1 className="text-3xl font-bold tracking-tight">
        Student Wallet
      </h1>

      <p className="text-sm text-muted-foreground">
        Student transactions are securely managed here.
      </p>
    </div>

  </div>


  <div className="space-y-4">

  {/* BALANCE */}
  <div className="flex items-center gap-3 bg-white/20 rounded-xl px-4 py-3">
    
    {/* avatar */}
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-500 text-white text-sm font-semibold">
      ₹
    </div>

    <div>
      <p className="text-xs text-slate-500">Balance</p>
      <p className="font-semibold text-lg">₹ {balance}</p>
    </div>

  </div>

 <div className="flex items-center justify-between bg-white/20 rounded-xl px-4 py-3">

  <div className="flex items-center gap-3">

    {/* avatar */}
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500 text-white text-xs">
      ID
    </div>

    <div>
      
      <p className="text-xs text-slate-500">Wallet Address</p>
      <p className="font-mono text-sm">
        ••••••••••••••••••
      </p>
    </div>

  </div>

  {/* copy icon */}
  <span
  onClick={copyAddress}
  title="Copy wallet address"
  className="cursor-pointer"
>
  <Copy
    size={16}
    className="text-slate-600 hover:text-purple-600 transition"
  />
</span>
</div>
  </div>

</div>
      {/* Stats Section */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

  {/* Total Spent */}
  <div className="glass-card p-5 rounded-2xl flex items-center gap-4 hover:scale-[1.03] transition shadow-sm">
    
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100">
      <ArrowUpRight className="text-red-500" size={22} />
    </div>

    <div>
      <p className="text-xl font-bold text-red-500">₹2450</p>
      <p className="text-xs text-muted-foreground">Total Spent</p>
    </div>

  </div>

  {/* Total Received */}
  <div className="glass-card p-5 rounded-2xl flex items-center gap-4 hover:scale-[1.03] transition shadow-sm">
    
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100">
      <ArrowDownLeft className="text-green-500" size={22} />
    </div>

    <div>
      <p className="text-xl font-bold text-green-500">₹500</p>
      <p className="text-xs text-muted-foreground">Total Received</p>
    </div>

  </div>

  {/* Savings Growth */}
  <div className="glass-card p-5 rounded-2xl flex items-center gap-4 hover:scale-[1.03] transition shadow-sm">
    
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100">
      <TrendingUp className="text-purple-600" size={22} />
    </div>

    <div>
      <p className="text-xl font-bold text-purple-600">+12%</p>
      <p className="text-xs text-muted-foreground">Savings Growth</p>
    </div>

  </div>

</div>
      {/* Quick Actions */}
      <div className="glass-card p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-4 text-lg">Quick Actions</h3>

        <button
  onClick={() => navigate("/student/pay")}
  className="send-btn w-full justify-center"
>
  <div className="svg-wrapper">
    <Send size={18} />
  </div>
  <span>Send Money</span>
</button>
      </div>
    </div>
  );
};

export default StudentWallet;