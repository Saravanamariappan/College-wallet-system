import React from "react";
import "./../App.css";

function AdminLogin() {
  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Admin Login</h2>
        <input type="text" placeholder="Admin ID" />
        <input type="password" placeholder="Password" />
        <button>Login</button>
      </div>
    </div>
  );
}

export default AdminLogin;
