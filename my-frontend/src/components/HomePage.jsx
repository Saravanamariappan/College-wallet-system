import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>College Wallet System</h1>
        <p>Secure Digital Wallet for Campus</p>
      </div>

      <div className="login-section">
        <button onClick={() => navigate("/student-login")}>Student Login</button>
        <button onClick={() => navigate("/vendor-login")}>Vendor Login</button>
        <button onClick={() => navigate("/admin-login")}>Admin Login</button>
      </div>
    </div>
  );
}

export default HomePage;
