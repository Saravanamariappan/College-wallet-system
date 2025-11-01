import React from "react";
import "./../App.css";

function VendorLogin() {
  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Vendor Login</h2>
        <input type="text" placeholder="Vendor ID" />
        <input type="password" placeholder="Password" />
        <button>Login</button>
      </div>
    </div>
  );
}

export default VendorLogin;
