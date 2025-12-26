import { useState } from "react";
import { useNavigate } from "react-router-dom";

function VendorLogin() {
  const [vendorId, setVendorId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    const res = await fetch("http://localhost:5000/api/auth/vendor/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendorId, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("vendor", JSON.stringify(data.vendor));
      navigate("/vendor-dashboard");
    } else alert(data.message);
  };

  return (
    <div className="login-box">
      <h2>Vendor Login</h2>
      <input placeholder="Vendor ID" onChange={e => setVendorId(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  );
}

export default VendorLogin;
