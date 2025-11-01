import React from 'react';

function AddStudent() {
  return (
    <div className="form-container">
      <h2>Student Registration</h2>
      <div className="photo-upload">
        <p>Student Photo</p>
        <input type="file" />
      </div>
      <div className="form-section">
        <h3>Personal Information</h3>
        <label>Student ID *</label>
        <input type="text" placeholder="e.g., C2023EN001" />
        <label>Full Name *</label>
        <input type="text" placeholder="First Last Name" />
        <label>Email Address *</label>
        <input type="email" placeholder="student@example.com" />
        <label>Phone Number *</label>
        <input type="tel" placeholder="+1 (123) 456-7890" />
        <label>Date of Birth *</label>
        <input type="date" />
      </div>
      <div className="form-section">
        <h3>Academic Information</h3>
        <label>Department *</label>
        <input type="text" placeholder="e.g., Computer Science" />
        <label>Academic Year *</label>
        <select>
          <option>Select Year</option>
          <option>1st Year</option>
          <option>2nd Year</option>
        </select>
        <label>Roll Number *</label>
        <input type="text" placeholder="e.g., A01, Block A, Room 10" />
      </div>
      <div className="form-section">
        <h3>Wallet Information</h3>
        <label>Wallet Address</label>
        <input type="text" placeholder="Generate or enter wallet address" />
        <label>Initial Balance</label>
        <input type="number" placeholder="0" />
      </div>
      <button>Register Student</button>
    </div>
  );
}

export default AddStudent;