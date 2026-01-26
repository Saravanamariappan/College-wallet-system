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

export default AdminMintTokens;
