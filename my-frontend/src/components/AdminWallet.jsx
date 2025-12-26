import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

function AdminWallet() {
  // =====================
  // DASHBOARD DATA
  // =====================
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalVendors, setTotalVendors] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  // =====================
  // SEND TOKEN
  // =====================
  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState("");

  // =====================
  // LOAD DASHBOARD STATS
  // =====================
  const loadStats = () => {
    fetch(`${API_BASE}/admin/stats`)
      .then((res) => res.json())
      .then((data) => {
        setTotalStudents(data.totalStudents || 0);
        setTotalVendors(data.totalVendors || 0);
        setTotalBalance(data.totalBalance || 0);
      })
      .catch((err) => {
        console.error("❌ Stats fetch error:", err);
      });
  };

  useEffect(() => {
    loadStats();
  }, []);

  // =====================
  // SEND TOKEN
  // =====================
  const sendTokenToStudent = () => {
    if (!studentId || !amount) {
      alert("Student ID and Amount required");
      return;
    }

    fetch(`${API_BASE}/admin/send-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId,
        amount: Number(amount),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert("✅ " + data.message);
          setStudentId("");
          setAmount("");
          loadStats(); // 🔥 refresh dashboard after sending token
        } else {
          alert("❌ Something went wrong");
        }
      })
      .catch((err) => {
        console.error("❌ Send token error:", err);
        alert("Server error");
      });
  };

  // =====================
  // UI
  // =====================
  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Admin Dashboard</h1>

      {/* STATS */}
      <div className="stats-container">
        <div className="stat-box">
          <h2>{totalStudents}</h2>
          <p>Total Students</p>
        </div>

        <div className="stat-box">
          <h2>{totalVendors}</h2>
          <p>Total Vendors</p>
        </div>

        <div className="stat-box">
          <h2>₹{totalBalance}</h2>
          <p>Total Balance</p>
        </div>
      </div>

      {/* SEND TOKEN */}
      <div className="transactions-card">
        <h3>Send Token to Student</h3>

        <input
          className="text-input"
          placeholder="Student ID (ex: STU001)"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />

        <input
          className="text-input"
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <br /><br />

        <button className="primary-button" onClick={sendTokenToStudent}>
          Send Token
        </button>
      </div>

      {/* TRANSACTIONS (NEXT STEP) */}
      <div className="transactions-card" style={{ marginTop: "30px" }}>
        <h3>Recent Transactions</h3>
        <p>➡️ Next step-la backend connect pannalam</p>
      </div>
    </div>
  );
}

export default AdminWallet;
