import React, { useState, useEffect } from "react";
import { Copy, Check, Eye, EyeOff, Users } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_ADMIN = `${BASE_URL}/api/admin`;
const API_STUDENT = `${BASE_URL}/api/students`;
const AdminAddStudent = () => {
  const [activeTab, setActiveTab] = useState("create");

  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  const [createdWallet, setCreatedWallet] = useState<any>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const [copied, setCopied] = useState({ address: false, key: false });

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerAddress, setRegisterAddress] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState(""); // ✅ SEARCH STATE ADDED

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
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registration failed");
    } finally {
      setRegisterLoading(false);
    }
  };

  /* -----------------------------------------
        COPY TEXT FUNCTION
  ------------------------------------------ */
  const copyToClipboard = async (text: string, type: "address" | "key") => {
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

  // ✅ FILTERED STUDENTS
  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.wallet_address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Add Student</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT PANEL */}
        <div className="glass-card p-6">
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

          {activeTab === "create" ? (
            !createdWallet ? (
              <button className="btn-primary w-full py-4" disabled={loading} onClick={handleCreateWallet}>
                {loading ? <LoadingSpinner size="sm" /> : "Create Wallet"}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-100 rounded-xl text-center">✓ Wallet Created</div>

                <div className="p-4 bg-secondary rounded-xl">
                  <div className="flex justify-between">
                    <p>Wallet Address</p>
                    <button onClick={() => copyToClipboard(createdWallet.address, "address")}>
                      {copied.address ? <Check /> : <Copy />}
                    </button>
                  </div>
                  <p className="font-mono break-all">{createdWallet.address}</p>
                </div>

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
            Registered Students ({filteredStudents.length})
          </h3>

          {/* ✅ SEARCH INPUT ADDED HERE */}
          <input
            type="text"
            placeholder="Search by name or wallet address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field mb-4"
          />

          {loadingList ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {filteredStudents.map((s, i) => (
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

export default AdminAddStudent;