import { getAddress } from "ethers";
import { db } from "../config/db.js";
import { studentPayVendor } from "../services/blockchainService.js";
import bcrypt from "bcrypt"; 
/* =========================================================
   GET STUDENT WALLET + BALANCE
========================================================= */
export const getStudentWallet = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (!userId) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const [rows] = await db.query(
      `SELECT wallet_address, balance 
       FROM students 
       WHERE user_id = ? AND status='ACTIVE'`,
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Student wallet not found" });
    }

    res.json({
      wallet: rows[0].wallet_address,
      balance: Number(rows[0].balance),
    });
  } catch (err) {
    console.error("getStudentWallet error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   STUDENT → VENDOR PAYMENT + STORE TRANSACTION
========================================================= */
export const payVendor = async (req, res) => {
  const conn = await db.getConnection();

  try {
    const { studentWallet, vendorWallet, amount } = req.body;

    if (!studentWallet || !vendorWallet || !amount) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const student = getAddress(studentWallet);
    const vendor = getAddress(vendorWallet);
    const amt = Number(amount);

    if (amt <= 0) return res.status(400).json({ error: "Invalid amount" });

    await conn.beginTransaction();

    /* STUDENT */
    const [studentRows] = await conn.query(
      "SELECT id, balance, email FROM students WHERE wallet_address=? AND status='ACTIVE'",
      [student]
    );

    if (!studentRows.length) throw new Error("Student not found");

    if (Number(studentRows[0].balance) < amt)
      throw new Error("Insufficient balance");

    /* VENDOR */
    const [vendorRows] = await conn.query(
      "SELECT id FROM vendors WHERE wallet_address=? AND status='ACTIVE'",
      [vendor]
    );

    if (!vendorRows.length) throw new Error("Vendor not found");

    /* BLOCKCHAIN TX */
    const txHash = await studentPayVendor(student, vendor, amt);

    const explorer = `https://amoy.polygonscan.com/tx/${txHash}`;


    /* BALANCE UPDATE */
    await conn.query(
      "UPDATE students SET balance = balance - ? WHERE id=?",
      [amt, studentRows[0].id]
    );

    await conn.query(
      "UPDATE vendors SET balance = balance + ? WHERE id=?",
      [amt, vendorRows[0].id]
    );

    /* TRANSACTION HISTORY */
    await conn.query(
      `INSERT INTO transactions 
      (email, student_wallet, vendor_wallet, amount, tx_hash, explorer_link, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        studentRows[0].email,
        student,
        vendor,
        amt,
        txHash,
        explorer,
        "SUCCESS"
      ]
    );

    await conn.commit();

    res.json({
      success: true,
      txHash: txHash,
      explorer,
      amount: amt,
      message: "Payment successful"
    });

  } catch (err) {
    await conn.rollback();
    console.error("Payment error:", err);
    res.status(400).json({ error: err.message });
  } finally {
    conn.release();
  }
};



export const getStudentPrivateKey = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const [rows] = await db.query(
      "SELECT private_key FROM students WHERE user_id = ?",
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ privateKey: rows[0].private_key });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   CHANGE STUDENT PASSWORD
========================================================= */
export const changeStudentPassword = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const { oldPassword, newPassword } = req.body;

    if (!userId || !newPassword) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Fetch current hashed password
    const [rows] = await db.query(
      "SELECT password FROM users WHERE id = ? AND role='STUDENT'",
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Student not found" });
    }

    const currentHashed = rows[0].password;

    // Optional: verify old password if provided
    if (oldPassword) {
      const match = await bcrypt.compare(oldPassword, currentHashed);
      if (!match) return res.status(400).json({ error: "Old password is incorrect" });
    }

    // Hash the new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // Update password in users table
    await db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashed, userId]
    );

    res.json({ success: true, message: "Password updated successfully" });

  } catch (err) {
    console.error("changeStudentPassword error:", err);
    res.status(500).json({ error: err.message });
  }
};
