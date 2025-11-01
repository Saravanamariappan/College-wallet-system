import React from "react";
import "./../App.css";

function StudentLogin() {
  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Student Login</h2>
        <input type="text" placeholder="Student ID" />
        <input type="password" placeholder="Password" />
        <button>Login</button>
      </div>
    </div>
  );
}

export default StudentLogin;
