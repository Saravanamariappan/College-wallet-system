import { db } from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password & role required"
      });
    }

    /* ================= FIND USER ================= */
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? AND role = ? LIMIT 1",
      [email, role]
    );

    if (!rows.length) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const user = rows[0];

    /* ================= ALWAYS USE BCRYPT ================= */
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    /* ================= CHECK ACCOUNT STATUS ================= */
    let walletAddress = null;

    if (role === "STUDENT") {
      const [s] = await db.query(
        "SELECT wallet_address FROM students WHERE user_id=? AND status='ACTIVE'",
        [user.id]
      );

      if (!s.length) {
        return res.status(403).json({
          message: "Account deactivated"
        });
      }

      walletAddress = s[0].wallet_address;
    }

    if (role === "VENDOR") {
      const [v] = await db.query(
        "SELECT wallet_address FROM vendors WHERE user_id=? AND status='ACTIVE'",
        [user.id]
      );

      if (!v.length) {
        return res.status(403).json({
          message: "Account deactivated"
        });
      }

      walletAddress = v[0].wallet_address;
    }

    /* ================= GENERATE TOKEN ================= */
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        walletAddress: walletAddress
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Server error"
    });
  }
};
const isValid = await bcrypt.compare(password, user.password);

console.log("Entered Password:", password);
console.log("Stored Hash:", user.password);
console.log("Compare Result:", isValid);