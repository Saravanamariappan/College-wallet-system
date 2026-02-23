import React, { useEffect, useState } from "react";
import { Send, ExternalLink, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api`;
const EXPLORER = "https://amoy.polygonscan.com/tx/";

interface History {
  id: number;
  admin_wallet: string;
  amount: number;
  tx_hash: string;
  created_at: string;
}

const VendorPayAdmin: React.FC = () => {
  const { user } = useAuth();

  const [vendorWallet, setVendorWallet] = useState("");
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD DASHBOARD ================= */
  const loadDashboard = async () => {
    try {
      const res = await fetch(`${API_BASE}/vendors/dashboard/${user?.id}`);
      if (!res.ok) throw new Error();

      const data = await res.json();
      setVendorWallet(data.wallet);
      setBalance(Number(data.balance) || 0);
    } catch {
      toast.error("Failed to load vendor balance");
    }
  };

  /* ================= LOAD HISTORY ================= */
  const loadHistory = async (wallet: string) => {
    try {
      const res = await fetch(
        `${API_BASE}/vendors/admin-transactions/${wallet}`
      );
      if (!res.ok) throw new Error();

      const data = await res.json();
      setHistory(data.history || []);
    } catch {
      toast.error("Failed to load history");
    }
  };

  useEffect(() => {
    if (user?.id) loadDashboard();
  }, [user?.id]);

  useEffect(() => {
    if (vendorWallet) loadHistory(vendorWallet);
  }, [vendorWallet]);

  /* ================= PAY ADMIN ================= */
  const handlePay = async () => {
    if (!amount || Number(amount) <= 0)
      return toast.error("Invalid amount");

    if (Number(amount) > balance)
      return toast.error("Insufficient balance");

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/vendors/pay-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorWallet,
          amount: Number(amount),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const link = `${EXPLORER}${data.txHash}`;

      /* ✅ SMALL SUCCESS CARD (like image) */
      toast.custom(() => (
        <div className="bg-background border border-green-500/30 rounded-xl p-4 w-[320px] text-center space-y-2">
          <CheckCircle className="mx-auto text-green-400" size={32} />
          <p className="font-semibold">Payment Successful</p>
          <p className="text-sm text-muted-foreground">
            {data.amount} KGCT transferred
          </p>

          <a
            href={link}
            target="_blank"
            className="block bg-secondary/40 rounded-lg py-2 text-sm hover:bg-secondary/60"
          >
            View on Polygon Amoy
          </a>
        </div>
      ));

      setAmount("");
      await loadDashboard();
      await loadHistory(vendorWallet);

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Vendor → Admin Payment</h1>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* LEFT */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex justify-between bg-secondary/30 p-3 rounded-xl">
            <span>Balance</span>
            <b>{balance} KGCT</b>
          </div>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-field"
            placeholder="Enter amount"
          />

          <button
            onClick={handlePay}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? <LoadingSpinner size="sm" /> : <Send size={16} />}
            Pay Admin
          </button>
        </div>

        {/* RIGHT – COMPACT HISTORY (like image) */}
        <div className="glass-card p-4 space-y-2">
          <h3 className="font-semibold">Payment History</h3>

          {history.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              No history found
            </p>
          )}

          {history.map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between bg-secondary/20 px-3 py-2 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium">{h.amount} KGCT</p>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(h.created_at).toLocaleString()}
                </p>
              </div>

              {/* VERIFY ICON */}
              <a
                href={`${EXPLORER}${h.tx_hash}`}
                target="_blank"
                className="text-blue-400 hover:text-blue-300"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default VendorPayAdmin;
