import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import TransactionTable from '@/components/common/TransactionTable';
import { Search, IndianRupee, CheckCircle } from 'lucide-react';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api`;

const VendorHistory: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user?.walletAddress) return;

    setLoading(true);

    fetch(`${API_BASE}/transactions/vendor/${user.walletAddress}`)
      .then(res => res.json())
      .then(data => setTransactions(data.transactions || []))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, [user?.walletAddress]);

  const totalReceived = useMemo(() => {
    return transactions.reduce(
      (sum, tx) => sum + Number(tx.amount),
      0
    );
  }, [transactions]);

  const successfulTx = useMemo(() => {
    return transactions.filter(tx => tx.status === 'SUCCESS').length;
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const walletStr = tx.studentWallet || tx.student_wallet || "";
      return walletStr.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [transactions, searchTerm]);

  if (loading) return <p className="animate-pulse text-muted-foreground p-8 text-center">Loading history...</p>;

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-4 h-[calc(100vh-6rem)] min-h-[600px] relative">
      <div>
        <h1 className="text-3xl font-bold">Payment History</h1>
        <p className="text-muted-foreground">
          All received payments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Received Card - Primary Gradient */}
        <div className="bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 p-8 rounded-3xl shadow-lg hover:shadow-primary/10 hover:scale-[1.03] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
            <IndianRupee className="w-24 h-24 text-primary" />
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-3 rounded-2xl shadow-inner">
                <IndianRupee className="w-8 h-8 text-primary" />
              </div>
              <p className="text-lg font-semibold text-muted-foreground tracking-wide uppercase">Total Revenue</p>
            </div>

            <div>
              <p className="text-5xl lg:text-6xl font-black text-primary drop-shadow-sm">
                ₹{totalReceived}
              </p>
              <p className="text-sm text-primary/80 mt-2 font-medium">Lifetime earnings</p>
            </div>
          </div>
        </div>

        {/* Successful Transactions Card - Indigo Gradient */}
        <div className="bg-gradient-to-br from-indigo-500/20 via-indigo-500/5 to-transparent border border-indigo-500/20 p-8 rounded-3xl shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.03] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
            <CheckCircle className="w-24 h-24 text-indigo-500" />
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500/20 p-3 rounded-2xl shadow-inner">
                <CheckCircle className="w-8 h-8 text-indigo-500" />
              </div>
              <p className="text-lg font-semibold text-muted-foreground tracking-wide uppercase">Transactions</p>
            </div>

            <div>
              <p className="text-5xl lg:text-6xl font-black text-indigo-500 drop-shadow-sm">
                {successfulTx}
              </p>
              <p className="text-sm text-indigo-500/80 mt-2 font-medium">Successfully completed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card flex flex-col flex-1 min-h-[400px] overflow-hidden rounded-2xl shadow-sm">
        <div className="p-4 border-b border-border/30 bg-secondary/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <h3 className="font-semibold text-lg">Transaction History</h3>
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search wallet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          <TransactionTable transactions={filteredTransactions} showTo={false} />
        </div>
      </div>

    </div>
  );
};

export default VendorHistory;
