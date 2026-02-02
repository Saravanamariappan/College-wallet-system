import { db } from "../config/db.js";
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

    if (!rows.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    const isValid = user.password.startsWith("$2")
      ? await bcrypt.compare(password, user.password)
      : user.password === password;

    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let walletAddress = null;

    if (role === "STUDENT") {
      const [s] = await db.query(
        "SELECT wallet_address FROM students WHERE user_id=?",
        [user.id]
      );
      walletAddress = s[0]?.wallet_address;
    }

    if (role === "VENDOR") {
      const [v] = await db.query(
        "SELECT wallet_address FROM vendors WHERE user_id=?",
        [user.id]
      );
      walletAddress = v[0]?.wallet_address;
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
        name: user.name,
        email: user.email,
        role: user.role,
        wallet_address: walletAddress
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
