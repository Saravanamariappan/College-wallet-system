import { getAddress } from "ethers";
import { db } from "../config/db.js";
import { studentPayVendor } from "../services/blockchainService.js";

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
       WHERE user_id = ?`,
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Student wallet not found" });
    }

    res.json({
      wallet: rows[0].wallet_address,
      balance: Number(rows[0].balance)
    });

  } catch (err) {
    console.error("getStudentWallet error:", err);
    res.status(500).json({ error: err.message });
  }
};


/* =========================================================
   STUDENT → VENDOR PAYMENT (Wallet OR Name)
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

    if (amt <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    await conn.beginTransaction();

    /* STUDENT */
    const [studentRows] = await conn.query(
      "SELECT id, balance, email FROM students WHERE wallet_address=?",
      [student]
    );

    if (!studentRows.length) throw new Error("Student not found");

    if (Number(studentRows[0].balance) < amt)
      throw new Error("Insufficient balance");

    /* VENDOR */
    const [vendorRows] = await conn.query(
      "SELECT id FROM vendors WHERE wallet_address=?",
      [vendor]
    );

    if (!vendorRows.length) throw new Error("Vendor not found");

    const tx = await studentPayVendor(student, vendor, amt);

    await conn.query(
      "UPDATE students SET balance = balance - ? WHERE id=?",
      [amt, studentRows[0].id]
    );

    await conn.query(
      "UPDATE vendors SET balance = balance + ? WHERE id=?",
      [amt, vendorRows[0].id]
    );

    await conn.commit();

    res.json({
      success: true,
      txHash: tx.hash,
      message: "Payment successful"
    });

  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally {
    conn.release();
  }
};


