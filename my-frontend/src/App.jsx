// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from "react-router-dom";
import "./App.css";
import AdminWallet from "./components/AdminWallet.jsx";
import AddStudent from "./components/AddStudent";
import Dashboard from "./components/Dashboard.jsx"; // Student Dashboard
import Transactions from "./components/Transactions.jsx";
import SendTokens from "./components/SendTokens.jsx";

/* ===============================
   🧭 LOGIN PAGE COMPONENT
================================*/
function LoginPage() {
  const [activeTab, setActiveTab] = useState("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (activeTab === "admin") {
      if (username === "admin" && password === "1234") {
        navigate("/admin");
      } else {
        alert("❌ Invalid admin credentials");
      }
    } else if (activeTab === "student") {
      // Mock student login credentials
      if (username === "C2025ST001" && password === "student123") {
        navigate("/student-dashboard");
      } else {
        alert("❌ Invalid student credentials");
      }
    } else if (activeTab === "vendor") {
      alert("Vendor login feature not yet connected 🚧");
    }
  };

  return (
    <div className="home-container">
      {/* Left Side */}
      <div className="welcome-section">
        <h1>Welcome Back!</h1>
        <p>Login to continue your journey 🚀</p>
      </div>

      {/* Right Side */}
      <div className="login-section">
        <div className="login-box">
          <h2>Login</h2>

          {/* Tab Buttons */}
          <div className="tab-buttons">
            <button
              className={activeTab === "student" ? "active" : ""}
              onClick={() => setActiveTab("student")}
            >
              Student
            </button>
            <button
              className={activeTab === "vendor" ? "active" : ""}
              onClick={() => setActiveTab("vendor")}
            >
              Vendor
            </button>
            <button
              className={activeTab === "admin" ? "active" : ""}
              onClick={() => setActiveTab("admin")}
            >
              Admin
            </button>
          </div>

          {/* Conditional Login Forms */}
          <form className="login-form" onSubmit={handleLogin}>
            {activeTab === "student" && (
              <>
                <input
                  type="text"
                  placeholder="Student ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login as Student</button>
              </>
            )}

            {activeTab === "vendor" && (
              <>
                <input
                  type="text"
                  placeholder="Vendor Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login as Vendor</button>
              </>
            )}

            {activeTab === "admin" && (
              <>
                <input
                  type="text"
                  placeholder="Admin Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login as Admin</button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

/* ===============================
   💼 MAIN APP COMPONENT
================================*/
function App() {
  return (
    <Router>
      <Routes>
        {/* Default route → Login page */}
        <Route path="/" element={<LoginPage />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <div className="App">
              <header className="App-header">
                <h1>College Wallet System</h1>
                <p>Manage student digital wallets and campus transactions with ease</p>
                <nav>
                  <Link to="/admin">Admin Wallet</Link> |{" "}
                  <Link to="/add-student">Add Student</Link> |{" "}
                  <Link to="/">Logout</Link>
                </nav>
              </header>
              <AdminWallet />
            </div>
          }
        />

        <Route
          path="/add-student"
          element={
            <div className="App">
              <header className="App-header">
                <h1>College Wallet System</h1>
                <nav>
                  <Link to="/admin">Admin Wallet</Link> |{" "}
                  <Link to="/add-student">Add Student</Link> |{" "}
                  <Link to="/">Logout</Link>
                </nav>
              </header>
              <AddStudent />
            </div>
          }
        />

        {/* Student Dashboard */}
        <Route
          path="/student-dashboard"
          element={
            <div className="App">
              <header className="App-header">
                <h1>Student Wallet</h1>
                <nav>
                  <Link to="/student-dashboard">Dashboard</Link> |{" "}
                  <Link to="/send">Send Tokens</Link> |{" "}
                  <Link to="/transactions">Transactions</Link> |{" "}
                  <Link to="/">Logout</Link>
                </nav>
              </header>
              <Dashboard />
            </div>
          }
        />

        {/* Student Send Tokens */}
        <Route
          path="/send"
          element={
            <div className="App">
              <header className="App-header">
                <h1>Send Tokens</h1>
                <nav>
                  <Link to="/student-dashboard">Dashboard</Link> |{" "}
                  <Link to="/send">Send Tokens</Link> |{" "}
                  <Link to="/transactions">Transactions</Link> |{" "}
                  <Link to="/">Logout</Link>
                </nav>
              </header>
              <SendTokens />
            </div>
          }
        />

        {/* Student Transactions */}
        <Route
          path="/transactions"
          element={
            <div className="App">
              <header className="App-header">
                <h1>Transactions</h1>
                <nav>
                  <Link to="/student-dashboard">Dashboard</Link> |{" "}
                  <Link to="/send">Send Tokens</Link> |{" "}
                  <Link to="/transactions">Transactions</Link> |{" "}
                  <Link to="/">Logout</Link>
                </nav>
              </header>
              <Transactions />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
