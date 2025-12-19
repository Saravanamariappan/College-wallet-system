import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentLogin() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/student/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId,
            password,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        console.log("Login Success", data);

        // (optional) student data store pannalam
        localStorage.setItem("student", JSON.stringify(data.student));

        navigate("/student-dashboard");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server error");
      console.error(err);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default StudentLogin;
