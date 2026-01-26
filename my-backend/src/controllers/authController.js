import {db }from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password & role required" });
    }

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? AND role = ? LIMIT 1",
      [email, role]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or role" });
    }

    const user = rows[0];

    let isValid = false;

    // ✅ bcrypt hash users
    if (user.password.startsWith("$2")) {
      isValid = await bcrypt.compare(password, user.password);
    }
    // ⚠️ old plain password users
    else {
      isValid = user.password === password;
    }

    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
