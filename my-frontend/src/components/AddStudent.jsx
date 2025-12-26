import React, { useState } from "react";

function AddStudent() {
  const [form, setForm] = useState({
    studentId: "",
    name: "",
    email: "",
    phone: "",
    dob: "",
    department: "",
    year: "",
    rollNo: "",
    initialBalance: 0,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Student Data:", form);

    // 🔒 FUTURE API
    // POST /api/admin/students
  };

  return (
    <div className="form-container">
      <h2>Student Registration</h2>

      <div className="form-section">
        <h3>Personal Information</h3>

        <input name="studentId" placeholder="Student ID" onChange={handleChange} />
        <input name="name" placeholder="Full Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input type="date" name="dob" onChange={handleChange} />
      </div>

      <div className="form-section">
        <h3>Academic Information</h3>

        <input name="department" placeholder="Department" onChange={handleChange} />
        <select name="year" onChange={handleChange}>
          <option>Select Year</option>
          <option>1st Year</option>
          <option>2nd Year</option>
          <option>3rd Year</option>
        </select>
        <input name="rollNo" placeholder="Roll No" onChange={handleChange} />
      </div>

      <div className="form-section">
        <h3>Wallet</h3>
        <input
          type="number"
          name="initialBalance"
          placeholder="Initial Token Balance"
          onChange={handleChange}
        />
      </div>

      <button onClick={handleSubmit}>Register Student</button>
    </div>
  );
}

export default AddStudent;
