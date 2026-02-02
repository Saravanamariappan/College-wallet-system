AdminAddStudent.tsx
import React, { useState, useEffect } from "react";
import { Copy, Check, Eye, EyeOff, Users } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";
import axios from "axios";

const API_ADMIN = "http://localhost:5000/api/admin";

const API_STUDENT = "http://localhost:5000/api/students";

const AdminAddStudent = () => {
  const [activeTab, setActiveTab] = useState("create");

  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  const [createdWallet, setCreatedWallet] = useState(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const [copied, setCopied] = useState({ address: false, key: false });

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerAddress, setRegisterAddress] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  const [students, setStudents] = useState([]);

  /* -----------------------------------------
        LOAD STUDENTS FROM DATABASE
  ------------------------------------------ */
  const loadStudents = async () => {
    try {
      setLoadingList(true);
      const res = await axios.get(`${API_ADMIN}/students`);
      setStudents(res.data.students || []);
    } catch (err) {
      toast.error("Failed to load students");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  /* -----------------------------------------
        CREATE WALLET
  ------------------------------------------ */
  const handleCreateWallet = async () => {
  try {
    setLoading(true);

    const res = await axios.post(
      `${API_ADMIN}/students/create-wallet`
    );

    const { walletAddress, privateKey } = res.data;

    setCreatedWallet({ address: walletAddress, privateKey });

    toast.success("Wallet created!");

  } catch (err) {
    toast.error("Error creating wallet");
  } finally {
    setLoading(false);
  }
};


  /* -----------------------------------------
        REGISTER STUDENT
  ------------------------------------------ */
const handleRegister = async () => {
  if (!registerName || !registerEmail || !registerPassword || !registerAddress) {
    toast.error("Fill all fields");
    return;
  }

  try {
    setRegisterLoading(true);

    await axios.post(
      `${API_ADMIN}/students/register`,
      {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        walletAddress: registerAddress,
      }
    );

    toast.success("Student registered!");

    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterAddress("");

    loadStudents();

  } catch (error) {
    toast.error(error.response?.data?.error || "Registration failed");
  } finally {
    setRegisterLoading(false);
  }
};


  /* -----------------------------------------
        COPY TEXT FUNCTION
  ------------------------------------------ */
  const copyToClipboard = async (text, type) => {
    if (!text) {
      toast.error("Nothing to copy!");
      return;
    }

    await navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [type]: true }));

    setTimeout(() => {
      setCopied((prev) => ({ ...prev, [type]: false }));
    }, 1500);

    toast.success("Copied!");
  };

  const resetWalletUI = () => {
    setCreatedWallet(null);
    setShowPrivateKey(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Add Student</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT PANEL */}
        <div className="glass-card p-6">
          {/* TABS */}
          <div className="flex gap-2 mb-6">
            <button
              className={`flex-1 py-3 rounded-xl ${activeTab === "create" ? "bg-primary text-white" : "bg-secondary"}`}
              onClick={() => setActiveTab("create")}
            >
              Create New
            </button>

            <button
              className={`flex-1 py-3 rounded-xl ${activeTab === "register" ? "bg-primary text-white" : "bg-secondary"}`}
              onClick={() => setActiveTab("register")}
            >
              Register Existing
            </button>
          </div>

          {/* CREATE NEW WALLET */}
          {activeTab === "create" ? (
            !createdWallet ? (
              <button className="btn-primary w-full py-4" disabled={loading} onClick={handleCreateWallet}>
                {loading ? <LoadingSpinner size="sm" /> : "Create Wallet"}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-100 rounded-xl text-center">✓ Wallet Created</div>

                {/* Wallet Address */}
                <div className="p-4 bg-secondary rounded-xl">
                  <div className="flex justify-between">
                    <p>Wallet Address</p>
                    <button onClick={() => copyToClipboard(createdWallet.address, "address")}>
                      {copied.address ? <Check /> : <Copy />}
                    </button>
                  </div>
                  <p className="font-mono break-all">{createdWallet.address}</p>
                </div>

                {/* Private Key */}
                <div className="p-4 bg-yellow-100 rounded-xl">
                  <div className="flex justify-between">
                    <p>Private Key</p>
                    <button onClick={() => setShowPrivateKey(!showPrivateKey)}>
                      {showPrivateKey ? <EyeOff /> : <Eye />}
                    </button>
                    <button onClick={() => copyToClipboard(createdWallet.privateKey, "key")}>
                      {copied.key ? <Check /> : <Copy />}
                    </button>
                  </div>

                  <p className="font-mono break-all">
                    {showPrivateKey ? createdWallet.privateKey : "•••••••••••••"}
                  </p>
                </div>

                <button className="btn-secondary w-full" onClick={resetWalletUI}>
                  Create Another Wallet
                </button>
              </div>
            )
          ) : (
            /* REGISTER EXISTING WALLET */
            <div className="space-y-4">
              <input className="input-field" placeholder="Full Name" value={registerName} onChange={(e) => setRegisterName(e.target.value)} />
              <input className="input-field" placeholder="Email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
              <input className="input-field" type="password" placeholder="Password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
              <input className="input-field" placeholder="Wallet Address" value={registerAddress} onChange={(e) => setRegisterAddress(e.target.value)} />

              <button className="btn-primary w-full" disabled={registerLoading} onClick={handleRegister}>
                {registerLoading ? <LoadingSpinner size="sm" /> : "Register Student"}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT PANEL - STUDENTS LIST */}
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Users />
            Registered Students ({students.length})
          </h3>

          {loadingList ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {students.map((s, i) => (
                <div key={i} className="p-3 bg-secondary rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-xl">
                    {s.name?.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">{s.name}</p>
                    <p className="font-mono text-xs break-all">{s.wallet_address}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">{s.balance || 0}</p>
                    <p className="text-xs text-muted-foreground">Balance</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAddStudent;  and AdminAddVendor.tsx 
import React, { useEffect, useState } from "react";
import { Copy, Check, Eye, EyeOff, Building2 } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";
import axios from "axios";

const API_ADMIN = "http://localhost:5000/api/admin";

interface Vendor {
  id: number;
  name: string;
  wallet_address: string;
}

const AdminAddVendor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"create" | "register">("create");

  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  const [createdWallet, setCreatedWallet] = useState<{
    walletAddress: string;
    privateKey: string;
  } | null>(null);

  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copied, setCopied] = useState({ address: false, key: false });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const [vendors, setVendors] = useState<Vendor[]>([]);

  const categories = [
    "Cafeteria",
    "Book Store",
    "Stationery",
    "Electronics",
    "Sports",
    "Other",
  ];

  /* ================================
     LOAD VENDORS
  ================================ */
  const loadVendors = async () => {
    try {
      setLoadingList(true);
      const res = await axios.get(`${API_ADMIN}/vendors`);
      setVendors(res.data.vendors || []);
    } catch {
      toast.error("Failed to load vendors");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  /* ================================
     CREATE WALLET
  ================================ */
  const handleCreateWallet = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_ADMIN}/vendors/create-wallet`);

      setCreatedWallet({
        walletAddress: res.data.walletAddress,
        privateKey: res.data.privateKey,
      });

      toast.success("Vendor wallet created");
    } catch {
      toast.error("Wallet creation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     REGISTER VENDOR
  ================================ */
  const handleRegister = async () => {
  if (!name || !email || !password || !category || !walletAddress) {
    toast.error("Fill all fields");
    return;
  }

  if (!createdWallet?.privateKey) {
    toast.error("Create wallet first");
    return;
  }

  try {
    setLoading(true);

    await axios.post(`${API_ADMIN}/vendors/register`, {
      name,
      email,
      password,
      category,
      walletAddress,
      privateKey: createdWallet.privateKey
    });

    toast.success("Vendor registered successfully");

    setName("");
    setEmail("");
    setPassword("");
    setCategory("");
    setWalletAddress("");
    setCreatedWallet(null);

    loadVendors();
  } catch (err: any) {
    toast.error(err.response?.data?.error || "Registration failed");
  } finally {
    setLoading(false);
  }
};


  /* ================================
     COPY
  ================================ */
  const copyToClipboard = async (text: string, type: "address" | "key") => {
    await navigator.clipboard.writeText(text);
    setCopied((p) => ({ ...p, [type]: true }));

    setTimeout(() => {
      setCopied((p) => ({ ...p, [type]: false }));
    }, 1500);

    toast.success("Copied");
  };

  const resetWalletUI = () => {
    setCreatedWallet(null);
    setShowPrivateKey(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Add Vendor</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT PANEL */}
        <div className="glass-card p-6">
          {/* TABS */}
          <div className="flex gap-2 mb-6">
            <button
              className={`flex-1 py-3 rounded-xl ${
                activeTab === "create"
                  ? "bg-primary text-white"
                  : "bg-secondary"
              }`}
              onClick={() => setActiveTab("create")}
            >
              Create Wallet
            </button>

            <button
              className={`flex-1 py-3 rounded-xl ${
                activeTab === "register"
                  ? "bg-primary text-white"
                  : "bg-secondary"
              }`}
              onClick={() => setActiveTab("register")}
            >
              Register Vendor
            </button>
          </div>

          {/* CREATE WALLET */}
          {activeTab === "create" ? (
            !createdWallet ? (
              <button
                className="btn-primary w-full py-4"
                onClick={handleCreateWallet}
                disabled={loading}
              >
                {loading ? <LoadingSpinner size="sm" /> : "Create Wallet"}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-100 rounded-xl text-center">
                  ✓ Wallet Created
                </div>

                <div className="p-4 bg-secondary rounded-xl">
                  <div className="flex justify-between">
                    <p>Wallet Address</p>
                    <button
                      onClick={() =>
                        copyToClipboard(createdWallet.walletAddress, "address")
                      }
                    >
                      {copied.address ? <Check /> : <Copy />}
                    </button>
                  </div>
                  <p className="font-mono break-all">
                    {createdWallet.walletAddress}
                  </p>
                </div>

                <div className="p-4 bg-yellow-100 rounded-xl">
                  <div className="flex justify-between">
                    <p>Private Key</p>
                    <div className="flex gap-2">
                      <button onClick={() => setShowPrivateKey(!showPrivateKey)}>
                        {showPrivateKey ? <EyeOff /> : <Eye />}
                      </button>
                      <button
                        onClick={() =>
                          copyToClipboard(createdWallet.privateKey, "key")
                        }
                      >
                        {copied.key ? <Check /> : <Copy />}
                      </button>
                    </div>
                  </div>
                  <p className="font-mono break-all">
                    {showPrivateKey
                      ? createdWallet.privateKey
                      : "••••••••••••••••"}
                  </p>
                </div>

                <button
                  className="btn-secondary w-full"
                  onClick={resetWalletUI}
                >
                  Create Another Wallet
                </button>
              </div>
            )
          ) : (
            /* REGISTER VENDOR */
            <div className="space-y-4">
              <input
                className="input-field"
                placeholder="Vendor Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <select
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <input
                className="input-field"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                className="input-field"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                className="input-field"
                placeholder="Wallet Address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />

              <button
                className="btn-primary w-full"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? <LoadingSpinner size="sm" /> : "Register Vendor"}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Building2 /> Registered Vendors ({vendors.length})
          </h3>

          {loadingList ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {vendors.map((v) => (
                <div key={v.id} className="p-3 bg-secondary rounded-xl">
                  <p className="font-medium">{v.name}</p>
                  <p className="font-mono text-xs break-all">
                    {v.wallet_address}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAddVendor;  and AdminDashboard.tsx
import React, { useState } from "react";
import {
  LayoutDashboard,
  UserPlus,
  Store,
  Coins,
  History,
  Settings,
} from "lucide-react";

import BottomNav from "@/components/layout/BottomNav";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import MobileHeader from "@/components/layout/MobileHeader";

import AdminOverview from "./AdminOverview";
import AdminAddStudent from "./AdminAddStudent";
import AdminAddVendor from "./AdminAddVendor";
import AdminMintTokens from "./AdminMintTokens";
import AdminTransactions from "./AdminTransactions";
import AdminSettings from "./AdminSettings";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "students", label: "Students", icon: <UserPlus className="w-5 h-5" /> },
    { id: "vendors", label: "Vendors", icon: <Store className="w-5 h-5" /> },
    { id: "mint", label: "Mint", icon: <Coins className="w-5 h-5" /> },
    { id: "transactions", label: "History", icon: <History className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  // Mobile version – same labels you used before
  const mobileTabs = [
    { id: "overview", label: "Home", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "students", label: "Students", icon: <UserPlus className="w-5 h-5" /> },
    { id: "vendors", label: "Vendors", icon: <Store className="w-5 h-5" /> },
    { id: "mint", label: "Mint", icon: <Coins className="w-5 h-5" /> },
    { id: "settings", label: "More", icon: <Settings className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview />;
      case "students":
        return <AdminAddStudent />;
      case "vendors":
        return <AdminAddVendor />;
      case "mint":
        return <AdminMintTokens />;
      case "transactions":
        return <AdminTransactions />;
      case "settings":
        return <AdminSettings onNavigate={setActiveTab} />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <MobileHeader />

      {/* Desktop Sidebar */}
      <DesktopSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />

      {/* Main Content */}
      <main className="pt-16 pb-24 lg:pt-0 lg:pb-0 lg:ml-64">
        <div className="p-4 lg:p-8 max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={mobileTabs}
      />
    </div>
  );
};

export default AdminDashboard;  and AdminMintTokens.tsx
import React, { useEffect, useState } from "react";
import { Coins, ExternalLink, CheckCircle } from "lucide-react";
import axios from "axios";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";

const AdminMintTokens: React.FC = () => {
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [mintResult, setMintResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const quickAmounts = [100, 500, 1000, 5000];

  const fetchHistory = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/admin/mint/history"
    );

    setHistory(res.data.data || []);
  } catch (err) {
    console.error("Fetch history error:", err);
  }
};


  useEffect(() => {
    fetchHistory();
  }, []);

  const handleMint = async () => {
    if (!wallet || !amount) {
      toast.error("Wallet & amount required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/admin/mint-token",
        { walletAddress: wallet, amount }
      );

      setMintResult(res.data);
      toast.success("Mint successful!");
      fetchHistory();

      setWallet("");
      setAmount("");

    } catch (err: any) {
      toast.error(err.response?.data?.error || "Mint failed");
    } finally {
      setLoading(false);
    }
  };

  const totalMinted = history.reduce((a, b) => a + Number(b.amount), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mint Tokens</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* MINT FORM */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-semibold flex gap-2 items-center">
            <Coins className="w-5 h-5 text-warning" />
            Mint Tokens
          </h3>

          {!mintResult ? (
            <>
              <input
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="Paste student wallet address"
                className="input-field w-full"
              />

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="input-field w-full text-lg"
              />

              <div className="flex flex-wrap gap-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAmount(amt.toString())}
                    className="px-4 py-2 bg-warning/20 rounded-xl text-warning"
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              <button
                onClick={handleMint}
                disabled={loading}
                className="btn-primary w-full py-3"
              >
                {loading ? <LoadingSpinner size="sm" /> : "Mint Tokens"}
              </button>
            </>
          ) : (
            <div className="space-y-4 text-center">
              <CheckCircle className="w-16 h-16 mx-auto text-success" />
              <p className="text-xl font-bold">Mint Success</p>
              <p>{mintResult.amount} tokens minted</p>

              <button
                onClick={() =>
                  window.open(
                    `https://amoy.polygonscan.com/tx/${mintResult.txHash}`,
                    "_blank"
                  )
                }
                className="btn-secondary w-full flex justify-center gap-2"
              >
                <ExternalLink size={16} /> View on PolygonScan
              </button>

              <button
                onClick={() => setMintResult(null)}
                className="btn-primary w-full"
              >
                Mint More
              </button>
            </div>
          )}
        </div>

        {/* STATS */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-semibold">Token Statistics</h3>

          <div className="flex justify-between bg-secondary/30 p-3 rounded-xl">
            <span>Total Minted</span>
            <b>₹{totalMinted}</b>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Mint History</h4>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {history.map((h) => (
                <div
                  key={h.id}
                  className="p-2 border rounded-lg text-xs"
                >
                  <div>Wallet: {h.student_wallet}</div>
                  <div>Amount: {h.amount}</div>
                  <div
                    onClick={() =>
                      window.open(
                        `https://amoy.polygonscan.com/tx/${h.tx_hash}`,
                        "_blank"
                      )
                    }
                    className="text-primary cursor-pointer"
                  >
                    Tx: {h.tx_hash.slice(0, 20)}...
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMintTokens;  and AdminOverview.tsx 
import React from 'react';
import { Users, Store, Coins, ArrowLeftRight, TrendingUp, Activity } from 'lucide-react';
import StatCard from '@/components/common/StatCard';
import { mockStudents, mockVendors, mockTransactions } from '@/data/mockData';

const AdminOverview: React.FC = () => {
  const totalTokensMinted = mockTransactions
    .filter(tx => tx.type === 'mint')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const stats = [
    {
      title: 'Total Students',
      value: mockStudents.length,
      icon: <Users className="w-6 h-6 text-primary" />,
      trend: '+3 this week',
      trendUp: true,
    },
    {
      title: 'Total Vendors',
      value: mockVendors.length,
      icon: <Store className="w-6 h-6 text-primary" />,
      trend: '+1 this week',
      trendUp: true,
    },
    {
      title: 'Tokens Minted',
      value: `₹${totalTokensMinted.toLocaleString()}`,
      icon: <Coins className="w-6 h-6 text-primary" />,
      trend: '+15%',
      trendUp: true,
    },
    {
      title: 'Transactions',
      value: mockTransactions.length,
      icon: <ArrowLeftRight className="w-6 h-6 text-primary" />,
      trend: '+24 today',
      trendUp: true,
    },
  ];

  const recentActivity = [
    { type: 'mint', description: 'Minted 500 tokens to Rahul Kumar', time: '2 mins ago', icon: <Coins className="w-4 h-4" />, color: 'text-success' },
    { type: 'register', description: 'New student registered: Priya Sharma', time: '15 mins ago', icon: <Users className="w-4 h-4" />, color: 'text-primary' },
    { type: 'payment', description: 'Payment: 150 tokens from STU001 to VND001', time: '1 hour ago', icon: <ArrowLeftRight className="w-4 h-4" />, color: 'text-accent' },
    { type: 'vendor', description: 'New vendor registered: Book Store', time: '3 hours ago', icon: <Store className="w-4 h-4" />, color: 'text-warning' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="glass-card p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activity
            </h3>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-xl">
                <div className={`w-8 h-8 rounded-lg bg-secondary flex items-center justify-center ${activity.color}`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass-card p-4 lg:p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            This Week's Performance
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Transaction Volume</span>
                <span className="text-sm font-medium">₹45,230</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Active Users</span>
                <span className="text-sm font-medium">89%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: '89%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Vendor Engagement</span>
                <span className="text-sm font-medium">62%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: '62%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Token Circulation</span>
                <span className="text-sm font-medium">78%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-warning rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="glass-card p-4 lg:p-6 bg-success/5 border-success/20">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
          <div>
            <p className="font-medium text-success">All Systems Operational</p>
            <p className="text-sm text-muted-foreground">Polygon Amoy Testnet connected • Last block: 2 seconds ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;  and AdminTransactions.tsx 
import React from 'react';
import TransactionTable from '@/components/common/TransactionTable';
import { mockTransactions } from '@/data/mockData';

const AdminTransactions: React.FC = () => {
  const totalVolume = mockTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const successfulTx = mockTransactions.filter(tx => tx.status === 'success').length;
  const pendingTx = mockTransactions.filter(tx => tx.status === 'pending').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-1">All Transactions</h1>
        <p className="text-muted-foreground">System-wide transaction history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold gradient-text">₹{totalVolume.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Volume</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-success">{successfulTx}</p>
          <p className="text-sm text-muted-foreground">Successful</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-warning">{pendingTx}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
      </div>

      <TransactionTable transactions={mockTransactions} />
    </div>
  );
};

export default AdminTransactions;  and StudentDashboard.tsx 
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Wallet, Send, History, Settings, LogOut } from "lucide-react";
import { useAuth } from '@/context/AuthContext';

const StudentDashboard: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col p-5">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Student Panel
        </h2>

        {/* NAV LINKS */}
        <nav className="space-y-3 flex-1">
          <SidebarLink to="/student" icon={<Wallet size={18} />} label="My Wallet" />
          <SidebarLink to="/student/pay" icon={<Send size={18} />} label="Pay Vendor" />
          <SidebarLink to="/student/history" icon={<History size={18} />} label="Transactions" />
          <SidebarLink to="/student/settings" icon={<Settings size={18} />} label="Settings" />
        </nav>

        {/* LOGOUT BUTTON (BOTTOM) */}
        <button
          onClick={logout}
          className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

        <p className="text-xs text-center text-gray-400 mt-4">
          © KGISL Wallet System
        </p>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentDashboard;

/* ---------------- Sidebar Button ---------------- */

type SidebarProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
};

const SidebarLink: React.FC<SidebarProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition
        ${isActive
          ? "bg-primary text-primary-foreground"
          : "text-gray-300 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};  and StudentHistory.tsx 
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import TransactionTable from '@/components/common/TransactionTable';

type Transaction = {
  id: number;
  studentWallet: string;
  vendorWallet: string;
  amount: number;
  txHash: string;
  createdAt: string;
};

const API_BASE = 'http://localhost:5000/api';

const StudentHistory: React.FC = () => {
  const { user } = useAuth();

  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!user?.walletAddress) return;

    setLoading(true);

    fetch(`${API_BASE}/transactions/student/${user.walletAddress}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setTransactions(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setTransactions([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.walletAddress]);

  /* ================= FILTER ================= */
  const filteredTransactions = useMemo(() => {
    if (!user?.walletAddress) return [];

    return transactions.filter((tx) => {
      if (filter === 'sent')
        return tx.studentWallet === user.walletAddress;

      if (filter === 'received')
        return tx.vendorWallet === user.walletAddress;

      return true;
    });
  }, [filter, transactions, user?.walletAddress]);

  /* ================= STATS ================= */
  const totalSent = useMemo(() => {
    return transactions
      .filter(tx => tx.studentWallet === user?.walletAddress)
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
  }, [transactions, user?.walletAddress]);

  const totalReceived = useMemo(() => {
    return transactions
      .filter(tx => tx.vendorWallet === user?.walletAddress)
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
  }, [transactions, user?.walletAddress]);

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-muted-foreground">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-1">
          Transaction History
        </h1>
        <p className="text-muted-foreground">
          View all your transactions
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl w-fit">
        {(['all', 'sent', 'received'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Total Sent
          </p>
          <p className="text-2xl font-bold text-destructive">
            -{totalSent}
          </p>
        </div>

        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Total Received
          </p>
          <p className="text-2xl font-bold text-success">
            +{totalReceived}
          </p>
        </div>
      </div>

      {/* Table */}
      <TransactionTable transactions={filteredTransactions} />
    </div>
  );
};

export default StudentHistory;  and StudentPay.tsx
import React, { useState, useEffect } from "react";
import { Send, ExternalLink, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";
const API_BASE = "https://abcd-1234.ngrok-free.app/api";


interface Vendor {
  id: number;
  name: string;
  wallet_address: string;
}

const StudentPay: React.FC = () => {
  const { user } = useAuth();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState<number>(0);
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingBalance, setFetchingBalance] = useState(true);

  const [txResult, setTxResult] = useState<any>(null);

  const quickAmounts = [50, 100, 200, 500];

  const getWallet = async () => {
    try {
      const res = await fetch(`${API_BASE}/students/wallet/${user?.id}`);
      const data = await res.json();
      setWallet(data.wallet);
      setBalance(Number(data.balance));
    } catch {
      toast.error("Failed to fetch wallet");
    } finally {
      setFetchingBalance(false);
    }
  };

  const getVendors = async () => {
    try {
      const res = await fetch(`${API_BASE}/vendors/all`);
      const data = await res.json();
      setVendors(data.vendors || []);
    } catch {
      toast.error("Failed to load vendors");
    }
  };

  useEffect(() => {
    if (user?.id) {
      getWallet();
      getVendors();
    }
  }, [user?.id]);

  const handlePay = async () => {
    if (!selectedVendor) return toast.error("Select Vendor");
    if (!amount || Number(amount) <= 0) return toast.error("Invalid amount");
    if (Number(amount) > balance) return toast.error("Insufficient balance");

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/students/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentWallet: wallet,
          vendorWallet: selectedVendor.wallet_address,
          amount: Number(amount),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTxResult(data);
      toast.success("Payment Successful!");
      getWallet();

    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-none">

      <h1 className="text-2xl font-bold">Pay Vendor</h1>

      {/* BALANCE */}
      <div className="glass-card p-6">
        <p className="text-sm text-muted-foreground">Available Balance</p>
        {fetchingBalance ? (
          <div className="h-8 w-28 bg-secondary/30 animate-pulse rounded-md" />
        ) : (
          <p className="text-3xl font-bold">{balance} KGCT</p>
        )}
      </div>

      {/* PAYMENT BOX */}
      <div className="glass-card p-10 space-y-8 w-full lg:min-h-[70vh]">

        {!txResult ? (
          <>
            {/* VENDOR */}
            <div>
              <label className="text-sm font-medium">Select Vendor</label>
              <select
                className="input-field mt-2"
                value={selectedVendor?.id || ""}
                onChange={(e) => {
                  const v = vendors.find(x => x.id === Number(e.target.value));
                  setSelectedVendor(v || null);
                }}
              >
                <option value="">-- Select Vendor --</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedVendor && (
              <div className="p-3 bg-secondary/30 rounded-xl">
                <p className="text-xs text-muted-foreground">Vendor Wallet</p>
                <p className="font-mono text-sm break-all">
                  {selectedVendor.wallet_address}
                </p>
              </div>
            )}

            {/* AMOUNT */}
            <div>
              <label className="text-sm font-medium">Amount</label>
              <input
                type="number"
                className="input-field mt-2"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* QUICK */}
            <div className="flex gap-3 flex-wrap">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  onClick={() => setAmount(String(q))}
                  className="btn-secondary"
                >
                  {q} KGCT
                </button>
              ))}
            </div>

            {/* PAY */}
            <button
              onClick={handlePay}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-lg"
            >
              {loading ? <LoadingSpinner size="sm" /> : (
                <>
                  <Send className="w-5 h-5" /> Pay Now
                </>
              )}
            </button>
          </>
        ) : (
          /* SUCCESS BOX (ADMIN MINT மாதிரி) */
          <div className="space-y-5 text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-success" />

            <p className="text-xl font-bold">Payment Successful</p>
            <p>{txResult.amount} KGCT transferred</p>

            <button
              onClick={() =>
                window.open(txResult.explorer, "_blank")
              }
              className="btn-secondary w-full flex justify-center gap-2"
            >
              <ExternalLink size={16} />
              View on Polygon Amoy
            </button>

            <button
              onClick={() => setTxResult(null)}
              className="btn-primary w-full"
            >
              Make Another Payment
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentPay;  and StudentSettings.tsx
import React, { useState } from 'react';
import {
  User,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  Shield,
  Bell,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const StudentSettings: React.FC = () => {
  const { user, logout } = useAuth();

  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const safeName = user?.name || user?.email?.split('@')[0] || 'Student';

  const copyToClipboard = async (
    text?: string,
    type?: 'key' | 'address'
  ) => {
    if (!text) {
      toast.error('Nothing to copy');
      return;
    }

    await navigator.clipboard.writeText(text);

    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }

    if (type === 'address') {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }

    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-1">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account
        </p>
      </div>

      {/* Profile */}
      <div className="glass-card p-4 lg:p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground">
            {safeName.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="text-xl font-semibold">
              {safeName}
            </h3>
            <p className="text-muted-foreground">
              {user?.email}
            </p>
            <span className="inline-block mt-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-secondary/50 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">
              Student ID
            </p>
            <p className="font-mono">{user?.id}</p>
          </div>
        </div>
      </div>

      {/* Wallet */}
      <div className="glass-card p-4 lg:p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          Wallet Details
        </h3>

        <div className="space-y-4">
          {/* Wallet Address */}
          <div className="p-4 bg-secondary/50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                Wallet Address
              </p>
              <button
                onClick={() =>
                  copyToClipboard(
                    user?.walletAddress,
                    'address'
                  )
                }
                className="copy-btn"
              >
                {copiedAddress ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="font-mono text-sm break-all">
              {user?.walletAddress || '—'}
            </p>
          </div>

          {/* Private Key */}
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-destructive font-medium flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Private Key (Keep Secret!)
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setShowPrivateKey(!showPrivateKey)
                  }
                  className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition"
                >
                  {showPrivateKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() =>
                    copyToClipboard(
                      user?.privateKey,
                      'key'
                    )
                  }
                  className="copy-btn"
                >
                  {copiedKey ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <p className="font-mono text-sm break-all">
              {showPrivateKey
                ? user?.privateKey
                : '••••••••••••••••••••••••••••••••••••••••••••••••••'}
            </p>

            <p className="text-xs text-destructive mt-2">
              ⚠️ Never share your private key with anyone!
            </p>
          </div>
        </div>
      </div>

      {/* Preferences (UI only) */}
      <div className="glass-card p-4 lg:p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Preferences
        </h3>

        <div className="space-y-3">
          {['Push Notifications', 'Transaction Alerts'].map(
            (label) => (
              <div
                key={label}
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl"
              >
                <span>{label}</span>
                <div className="w-12 h-6 bg-primary rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full glass-card p-4 flex items-center justify-center gap-2 text-destructive hover:bg-destructive/10 transition"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
};

export default StudentSettings;  and StudentWallet.tsx 
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

export default StudentWallet;  and VendorDashboard.tsx 
import React, { useState } from 'react';
import { Wallet, ArrowDownLeft, History, Settings } from 'lucide-react';
import BottomNav from '@/components/layout/BottomNav';
import DesktopSidebar from '@/components/layout/DesktopSidebar';
import MobileHeader from '@/components/layout/MobileHeader';
import VendorWallet from './VendorWallet';
import VendorReceive from './VendorReceive';
import VendorHistory from './VendorHistory';
import VendorSettings from './VendorSettings';

const VendorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('wallet');

  const tabs = [
    { id: 'wallet', label: 'Wallet', icon: <Wallet className="w-5 h-5" /> },
    { id: 'receive', label: 'Receive', icon: <ArrowDownLeft className="w-5 h-5" /> },
    { id: 'history', label: 'History', icon: <History className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'wallet':
        return <VendorWallet />;
      case 'receive':
        return <VendorReceive />;
      case 'history':
        return <VendorHistory />;
      case 'settings':
        return <VendorSettings />;
      default:
        return <VendorWallet />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <DesktopSidebar activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
      
      <main className="pt-16 pb-24 lg:pt-0 lg:pb-0 lg:ml-64">
        <div className="p-4 lg:p-8 max-w-5xl mx-auto">
          {renderContent()}
        </div>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
    </div>
  );
};

export default VendorDashboard;  and VendorHistory.tsx 
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import TransactionTable from '@/components/common/TransactionTable';

const VendorHistory: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.walletAddress) return;

    fetch(
      `http://localhost:5000/api/transactions/vendor/${user.walletAddress}`
    )
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const totalReceived = transactions.reduce(
    (sum, tx) => sum + Number(tx.amount),
    0
  );

  const successfulTx = transactions.filter(
    tx => tx.status === 'SUCCESS'
  ).length;

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-1">
          Payment History
        </h1>
        <p className="text-muted-foreground">
          All received payments
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Total Received
          </p>
          <p className="text-2xl font-bold text-success">
            ₹{totalReceived}
          </p>
        </div>

        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Successful Transactions
          </p>
          <p className="text-2xl font-bold">{successfulTx}</p>
        </div>
      </div>

      <TransactionTable
        transactions={transactions}
        showTo={false}
      />
    </div>
  );
};

export default VendorHistory;  itha analaise pannu mithi anuppura ok 