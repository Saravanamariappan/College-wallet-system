import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';


const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api`;

const StudentHistory: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const vendorMap: Record<string, string> = {
  "0x0950f1bf907f5f0F05D00dF11e5C0290016C8B51": "Hot and Cold Cafe",
  "0x456": "Stationery Shop",
  "0x789": "Library",
};

  const [filter, setFilter] = useState<'all' | 'sent'>('all');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.walletAddress) return;

    setLoading(true);

    fetch(`${API_BASE}/transactions/student/${user.walletAddress}`)
      .then(res => res.json())
      .then(data => {
        setTransactions(data.transactions || []);
      })
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, [user?.walletAddress]);

  // ✅ Format data for UI
  const formattedTransactions = useMemo(() => {
  return transactions.map(tx => {

    console.log(tx.vendorWallet); // ✅ correct place

    return {
      type:
        tx.studentWallet === user?.walletAddress ? 'debit' : 'credit',

      vendor: vendorMap[tx.vendorWallet] || tx.vendorWallet,

      amount: tx.amount,

      date: tx.createdAt
        ? new Date(tx.createdAt).toLocaleDateString()
        : "N/A",
    };
  });
}, [transactions, user?.walletAddress]);

  const totalSpent = useMemo(() => {
    return formattedTransactions.reduce(
      (sum, tx) => sum + Number(tx.amount),
      0
    );
  }, [formattedTransactions]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Transaction History</h1>
        <p className="text-muted-foreground">
          Your payment details are here.
        </p>
      </div>

      {/* Total Spent Card */}
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-lg flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-xl font-semibold text-red-600">
          ↓
        </div>

        <div>
          <p className="text-sm text-slate-600">Total Spent</p>
          <p className="text-2xl font-bold text-red-500 mt-1">
            ₹{totalSpent}
          </p>
        </div>
      </div>

      {/* Table */}
     <div
  ref={tableRef}
  className="relative bg-white rounded-2xl shadow-lg p-4 max-h-[400px] overflow-y-auto"
>
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="text-left text-slate-500 border-b">
              <th className="py-3 px-2">Type</th>
              <th className="py-3 px-2">Vendor</th>
              <th className="py-3 px-2">Amount</th>
              <th className="py-3 px-2">Date</th>
            </tr>
          </thead>

          <tbody>
            {formattedTransactions.map((tx, index) => (
              <tr
                key={index}
                className="border-b last:border-none hover:bg-slate-50 transition"
              >
                <td className="py-3 px-2">
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      tx.type === 'debit'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {tx.type}
                  </span>
                </td>

                <td className="py-3 px-2 text-slate-700">
                  {tx.vendor}
                </td>

                <td className="py-3 px-2 font-semibold">
                  ₹{tx.amount}
                </td>

                <td className="py-3 px-2 text-slate-500 text-xs">
                  {tx.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
       <button
  onClick={() =>
    tableRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }
  className="absolute bottom-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-lg text-xs shadow hover:bg-purple-700 z-50"
>
  ↑ Top
</button>
      </div>

    </div>
  );
};

export default StudentHistory;