import React from "react";
import "./../App.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Left Side - Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome Back!</h1>
        <p>Login to continue your journey 🚀</p>
      </div>

      {/* Right Side - Login Section */}
      <div className="login-section">
        <h2>Login</h2>
        <button onClick={() => navigate("/student-login")}>Student Login</button>
        <button onClick={() => navigate("/vendor-login")}>Vendor Login</button>
        <button onClick={() => navigate("/admin-login")}>Admin Login</button>
      </div>
    </div>
  );
}

export default HomePage;
