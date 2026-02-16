import React, { useEffect, useState } from "react";
import { Coins, Send, CheckCircle } from "lucide-react";
import axios from "axios";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";

type Mode = "mint" | "send";

interface Student {
  id: number;
  name: string;
  wallet_address: string;
}

const AdminTokenManager: React.FC = () => {

  /* ================= MODE ================= */
  const [mode, setMode] = useState<Mode>("mint");

  /* ================= FORM ================= */
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  /* ================= STUDENTS ================= */
  const [students, setStudents] = useState<Student[]>([]);

  /* ================= DATA ================= */
  const [mintHistory, setMintHistory] = useState<any[]>([]);
  const [sendHistory, setSendHistory] = useState<any[]>([]);
  const [totalMinted, setTotalMinted] = useState<number>(0);

  const quickAmounts = [100, 500, 1000, 5000];

  /* ================= FETCH STUDENTS ================= */
  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/students"
      );
      setStudents(res.data.students || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FETCH TOTAL MINTED ================= */
  const fetchTotalMinted = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/mint/total"
      );
      setTotalMinted(Number(res.data.totalMinted));
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FETCH MINT HISTORY ================= */
  const fetchMintHistory = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/mint/history"
      );
      setMintHistory(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FETCH SEND HISTORY ================= */
  const fetchSendHistory = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/send/history"
      );
      setSendHistory(res.data.history || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= INIT ================= */
  useEffect(() => {
    fetchStudents();
    fetchTotalMinted();
    fetchMintHistory();
    fetchSendHistory();
  }, []);

  /* ================= HANDLE MINT ================= */
  const handleMint = async () => {

    if (!wallet || !amount) {
      toast.error("Select student & amount");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/admin/mint-token",
        {
          walletAddress: wallet,
          amount: Number(amount)
        }
      );

      setResult(res.data);

      toast.success("Mint successful");

      fetchMintHistory();
      fetchTotalMinted();

      setWallet("");
      setAmount("");

    } catch (err: any) {

      toast.error(err.response?.data?.error || "Mint failed");

    } finally {

      setLoading(false);

    }
  };

  /* ================= HANDLE SEND ================= */
  const handleSend = async () => {

    if (!wallet || !amount) {
      toast.error("Select student & amount");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/admin/send-token",
        {
          walletAddress: wallet,
          amount: Number(amount)
        }
      );

      setResult(res.data);

      toast.success("Send successful");

      fetchSendHistory();

      setWallet("");
      setAmount("");

    } catch (err: any) {

      toast.error(err.response?.data?.error || "Send failed");

    } finally {

      setLoading(false);

    }
  };

  /* ================= HANDLE ACTION ================= */
  const handleAction = () => {
    if (mode === "mint") handleMint();
    else handleSend();
  };

  /* ================= HISTORY ================= */
  const history = mode === "mint" ? mintHistory : sendHistory;

  return (

    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Token Manager
      </h1>

      {/* ================= MODE SWITCH ================= */}

      <div className="flex gap-3">

        <button
          onClick={() => {
            setMode("mint");
            setResult(null);
          }}
          className={`px-6 py-2 rounded-xl flex items-center gap-2
          ${mode === "mint"
              ? "bg-primary text-white"
              : "bg-secondary/30"
            }`}
        >
          <Coins className="w-4 h-4" />
          Mint
        </button>

        <button
          onClick={() => {
            setMode("send");
            setResult(null);
          }}
          className={`px-6 py-2 rounded-xl flex items-center gap-2
          ${mode === "send"
              ? "bg-primary text-white"
              : "bg-secondary/30"
            }`}
        >
          <Send className="w-4 h-4" />
          Send
        </button>

      </div>

      {/* ================= MAIN ================= */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* ================= FORM ================= */}

        <div className="glass-card p-6 space-y-4">

          <h3 className="font-semibold flex gap-2 items-center">

            {mode === "mint"
              ? <Coins className="w-5 h-5 text-warning" />
              : <Send className="w-5 h-5 text-warning" />
            }

            {mode === "mint"
              ? "Mint Tokens"
              : "Send Tokens"
            }

          </h3>

          {!result ? (

            <>

              {/* STUDENT SELECT */}

              <select
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                className="input-field w-full"
              >
                <option value="">
                  Select Student
                </option>

                {students.map((s) => (

                  <option
                    key={s.id}
                    value={s.wallet_address}
                  >
                    {s.name} ({s.wallet_address.slice(0, 6)}...)
                  </option>

                ))}

              </select>

              {/* AMOUNT */}

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="input-field w-full"
              />

              {/* QUICK */}

              <div className="flex gap-2 flex-wrap">

                {quickAmounts.map((amt) => (

                  <button
                    key={amt}
                    onClick={() => setAmount(amt.toString())}
                    className="px-4 py-2 bg-warning/20 rounded-xl"
                  >
                    ₹{amt}
                  </button>

                ))}

              </div>

              {/* BUTTON */}

              <button
                onClick={handleAction}
                disabled={loading}
                className="btn-primary w-full py-3"
              >

                {loading
                  ? <LoadingSpinner size="sm" />
                  : mode === "mint"
                    ? "Mint Tokens"
                    : "Send Tokens"
                }

              </button>

            </>

          ) : (

            <div className="text-center space-y-3">

              <CheckCircle className="w-16 h-16 mx-auto text-success" />

              <p className="text-xl font-bold">
                Success
              </p>

              <button
                onClick={() => setResult(null)}
                className="btn-primary w-full"
              >
                Do Another
              </button>

            </div>

          )}

        </div>

        {/* ================= HISTORY ================= */}

        <div className="glass-card p-6 space-y-4">

          {mode === "mint" && (

            <div className="flex justify-between bg-secondary/30 p-3 rounded-xl">
              <span>Total Minted</span>
              <b>₹{totalMinted}</b>
            </div>

          )}

          <h4 className="font-semibold">
            {mode === "mint"
              ? "Mint History"
              : "Send History"
            }
          </h4>

          <div className="max-h-60 overflow-y-auto space-y-2">

            {history.map((h) => (

              <div
                key={h.id}
                className="p-3 bg-secondary/20 rounded-lg"
              >

                <div className="text-xs font-mono break-all">
                  {h.student_wallet || h.receiver_wallet}
                </div>

                <div className="font-semibold text-success">
                  ₹{h.amount}
                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );

};

export default AdminTokenManager;
