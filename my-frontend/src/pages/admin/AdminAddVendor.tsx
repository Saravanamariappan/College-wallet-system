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
  const [search, setSearch] = useState(""); // ✅ SEARCH STATE ADDED

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

  // ✅ FILTERED VENDORS
  const filteredVendors = vendors.filter(
    (v) =>
      v.name?.toLowerCase().includes(search.toLowerCase()) ||
      v.wallet_address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Add Vendor</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT PANEL */}
        <div className="glass-card p-6">
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
            <Building2 /> Registered Vendors ({filteredVendors.length})
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
              {filteredVendors.map((v) => (
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

export default AdminAddVendor;