import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import TransactionTable from '@/components/common/TransactionTable';
import { Transaction } from '@/types';
import { ArrowUpRight } from 'lucide-react';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api`;

const StudentHistory: React.FC = () => {
  const { user } = useAuth();

  const [filter, setFilter] = useState<'all' | 'sent'>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.walletAddress) return;

    setLoading(true);

    fetch(`${API_BASE}/transactions/student/${user.walletAddress}`)
      .then(res => res.json())
      .then(data => {
        console.log("Student tx response 👉", data);
        setTransactions(data.transactions || []);
      })
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, [user?.walletAddress]);

  const filteredTransactions = useMemo(() => {
    if (filter === 'sent') {
      return transactions.filter(
        tx => tx.studentWallet === user?.walletAddress
      );
    }
    return transactions;
  }, [filter, transactions, user?.walletAddress]);

  const totalSpent = useMemo(() => {
    return transactions.reduce(
      (sum, tx) => sum + Number(tx.amount),
      0
    );
  }, [transactions]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transaction History</h1>
        <p className="text-muted-foreground"> Your payment details</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
        {/* Total Spent Card - Fuchsia Gradient */}
        <div className="bg-gradient-to-br from-fuchsia-500/20 via-fuchsia-500/5 to-transparent border border-fuchsia-500/20 p-6 rounded-3xl shadow-lg hover:shadow-fuchsia-500/10 hover:scale-[1.03] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
            <ArrowUpRight className="w-24 h-24 text-fuchsia-500" />
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-fuchsia-500/20 p-3 rounded-2xl shadow-inner">
                <ArrowUpRight className="w-8 h-8 text-fuchsia-500" />
              </div>
              <p className="text-lg font-semibold text-muted-foreground tracking-wide uppercase">Total Spent</p>
            </div>

            <div>
              <p className="text-5xl lg:text-6xl font-black text-fuchsia-500 drop-shadow-sm">
                ₹{totalSpent}
              </p>
              <p className="text-sm text-fuchsia-500/80 mt-2 font-medium">Recorded across all payments</p>
            </div>
          </div>
        </div>
      </div>

      <TransactionTable transactions={filteredTransactions} />
    </div>
  );
};

export default StudentHistory;
