import React, { useState, useEffect } from "react";
import { Send, ExternalLink, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api`; // ✅ BACKEND SAME

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
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Pay Vendor
        </h1>
        <p className="text-sm text-slate-500">
          Send tokens securely to campus vendors
        </p>
      </div>

      {/* BALANCE CARD */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg">
        <p className="text-sm opacity-80">Available Balance</p>
        {fetchingBalance ? (
          <div className="h-8 w-28 bg-white/30 animate-pulse rounded-md mt-2" />
        ) : (
          <p className="text-3xl font-bold mt-1">{balance} KGCT</p>
        )}
      </div>

      {/* PAYMENT CARD */}
      <div className="bg-white p-8 rounded-2xl shadow-md space-y-6">

        {!txResult ? (
          <>
            {/* Vendor Select */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Select Vendor
              </label>
              <select
                className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
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
              <div className="p-4 bg-slate-100 rounded-xl">
                <p className="text-xs text-slate-500">Vendor Wallet</p>
                <p className="font-mono text-sm break-all">
                  {selectedVendor.wallet_address}
                </p>
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Amount
              </label>
              <input
                type="number"
                className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Quick Buttons */}
            <div className="flex gap-3 flex-wrap">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  onClick={() => setAmount(String(q))}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
                >
                  {q} KGCT
                </button>
              ))}
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold 
                         bg-purple-600 text-white 
                         hover:bg-purple-700 transition
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Send size={18} />
                  Pay Now
                </>
              )}
            </button>
          </>
        ) : (
          /* SUCCESS UI */
          <div className="text-center space-y-5">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
            <h2 className="text-xl font-semibold">
              Payment Successful 🎉
            </h2>
            <p className="text-slate-600">
              {txResult.amount} KGCT transferred
            </p>

            <button
              onClick={() => window.open(txResult.explorer, "_blank")}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition flex justify-center gap-2"
            >
              <ExternalLink size={16} />
              View on Polygon Amoy
            </button>

            <button
              onClick={() => setTxResult(null)}
              className="w-full py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition"
            >
              Make Another Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPay;