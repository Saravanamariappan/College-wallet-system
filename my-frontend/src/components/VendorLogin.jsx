import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation after login
import "./../App.css";

function VendorLogin() {
  const [vendorId, setVendorId] = useState(""); // State for Vendor ID input
  const [password, setPassword] = useState(""); // State for Password input
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate(); // Hook for navigation

  // Hardcoded demo credentials (you can replace with API call later)
  const demoVendorId = "VEN001";
  const demoPassword = "password123";

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent page reload
    setError(""); // Clear previous errors

    // Simple validation: Check if inputs match demo credentials
    if (vendorId === demoVendorId && password === demoPassword) {
      // Successful login: Navigate to Vendor Dashboard
      // Assume route is "/vendor-dashboard" - update App.jsx routing accordingly
      navigate("/vendor-dashboard");
      // Optional: Store user role in localStorage for auth guard
      localStorage.setItem("userRole", "vendor");
      localStorage.setItem("vendorId", vendorId);
    } else {
      // Error: Invalid credentials
      setError("Invalid Vendor ID or Password. Demo: VEN001 / password123");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Vendor Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Vendor ID"
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>} {/* Display error */}
          <button type="submit">Login</button>
        </form>
        <p className="demo-note">
          Demo Credentials: VEN001 / password123
        </p>
      </div>
    </div>
  );
}

export default VendorLogin;