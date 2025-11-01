// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import SendTokens from "./components/SendTokens";
import Transactions from "./components/Transactions";
import AdminWallet from "./components/AdminWallet";
import AddStudent from "./components/AddStudent";
import StudentDashboard from "./components/StudentDashboard";
import "./index.css";

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
      // ✅ Student login → you can set any username/password
      if (username && password) {
        navigate("/student-dashboard");
      } else {
        alert("Please enter your Student ID and Password");
      }
    } else {
      alert("Vendor login not yet connected 🚧");
    }
  };

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Welcome Back!</h1>
        <p>Login to continue your journey 🚀</p>
      </div>

      <div className="login-section">
        <div className="login-box">
          <h2>Login</h2>

          <div className="tab-buttons">
            <button className={activeTab === "student" ? "active" : ""} onClick={() => setActiveTab("student")}>Student</button>
            <button className={activeTab === "vendor" ? "active" : ""} onClick={() => setActiveTab("vendor")}>Vendor</button>
            <button className={activeTab === "admin" ? "active" : ""} onClick={() => setActiveTab("admin")}>Admin</button>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <input type="text" placeholder={`${activeTab} Username`} value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login as {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<LoginPage />} />

        {/* Student dashboard */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/send" element={<SendTokens />} />
        <Route path="/transactions" element={<Transactions />} />

        {/* Admin routes */}
        <Route path="/admin" element={
          <div className="App">
            <header className="App-header">
              <h1>College Wallet System</h1>
              <p>Manage student digital wallets and campus transactions with ease</p>
              <nav>
                <Link to="/admin">Admin Wallet</Link> | <Link to="/add-student">Add Student</Link> | <Link to="/">Logout</Link>
              </nav>
            </header>
            <AdminWallet />
          </div>
        }/>
        <Route path="/add-student" element={
          <div className="App">
            <header className="App-header">
              <h1>College Wallet System</h1>
              <nav>
                <Link to="/admin">Admin Wallet</Link> | <Link to="/add-student">Add Student</Link> | <Link to="/">Logout</Link>
              </nav>
            </header>
            <AddStudent />
          </div>
        }/>
      </Routes>
    </Router>
  );
}

export default App;
