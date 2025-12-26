import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentLogin() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/auth/student/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("student", JSON.stringify(data.student));
      navigate("/student-dashboard");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="login-box">
      <h2>Student Login</h2>
      <input placeholder="Student ID" onChange={e => setStudentId(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default StudentLogin;
