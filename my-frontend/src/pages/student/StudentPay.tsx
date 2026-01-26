import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";

const API_BASE = "http://localhost:5000/api";

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

  const quickAmounts = [50, 100, 200, 500];

  /* ===== WALLET + BALANCE (OLD CONNECTION) ===== */
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

  /* ===== FETCH ALL VENDORS (OLD CONNECTION) ===== */
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

  /* ===== PAY (OLD CONNECTION) ===== */
  const handlePay = async () => {
    if (!selectedVendor) return toast.error("Select Vendor");
    if (!amount || Number(amount) <= 0)
      return toast.error("Invalid amount");

    if (Number(amount) > balance)
      return toast.error("Insufficient balance");

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/students/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentWallet: wallet,
          vendorWallet: selectedVendor.wallet_address,
          amount: Number(amount)
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Payment successful");
      setAmount("");
      setSelectedVendor(null);
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

      {/* BALANCE CARD */}
      <div className="glass-card p-6">
        <p className="text-sm text-muted-foreground">Available Balance</p>
        {fetchingBalance ? (
          <div className="h-8 w-28 bg-secondary/30 animate-pulse rounded-md" />
        ) : (
          <p className="text-3xl font-bold">{balance} KGCT</p>
        )}
      </div>

      {/* PAYMENT FULL BOX */}
      <div className="glass-card p-10 space-y-8 w-full lg:min-h-[70vh]">

        {/* VENDOR DROPDOWN */}
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

        {/* AUTO WALLET */}
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

        {/* QUICK AMOUNTS */}
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

        {/* PAY BUTTON */}
        <button
          onClick={handlePay}
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-lg"
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <Send className="w-5 h-5" /> Pay Now
            </>
          )}
        </button>

      </div>
    </div>
  );
};

export default StudentPay;
