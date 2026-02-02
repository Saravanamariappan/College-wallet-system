import { getAddress } from "ethers";
import { db } from "../config/db.js";
import {
  getTokenBalance,
  studentPayVendor
} from "../services/blockchainService.js";

/* ================= GET VENDOR WALLET + BALANCE ================= */
export const getVendorDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID missing" });
    }

    const [rows] = await db.execute(
      'SELECT wallet_address, balance FROM vendors WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Vendor wallet not found" });
    }

    res.json({
      wallet: rows[0].wallet_address,
      balance: rows[0].balance
    });

  } catch (err) {
    console.error("Vendor dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



/* ================= VENDOR → ADMIN SEND ================= */


export const getVendorTransactions = async (req, res) => {
  try {
    const wallet = getAddress(req.params.wallet);

    const [rows] = await db.query(
      `SELECT id, student_wallet, amount, created_at
       FROM transactions
       WHERE vendor_wallet=?
       ORDER BY id DESC
       LIMIT 10`,
      [wallet]
    );

    res.json({ transactions: rows });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



/* =========================================================
   SEARCH VENDORS BY NAME (AUTOSUGGEST)
========================================================= */
export const searchVendors = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.json({ vendors: [] });
    }

    const [rows] = await db.query(
      `SELECT name, wallet_address 
       FROM vendors 
       WHERE name LIKE ?
       ORDER BY name ASC
       LIMIT 10`,
      [`%${q}%`]
    );

    res.json({ vendors: rows });

  } catch (err) {
    console.error("searchVendors error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllVendors = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name, wallet_address 
       FROM vendors 
       ORDER BY name ASC`
    );

    res.json({ vendors: rows });

  } catch (err) {
    console.error("getAllVendors error:", err);
    res.status(500).json({ error: err.message });
  }
};


/* ================= GET VENDOR SETTINGS ================= */
export const getVendorSettings = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(
      `SELECT id, name, category, email, wallet_address, private_key, balance
       FROM vendors
       WHERE user_id = ?`,
      [userId]
    );

    if (!rows.length) return res.status(404).json({ error: "Vendor not found" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= VENDOR → ADMIN SEND ================= */
export const vendorSendAdmin = async (req, res) => {
  const conn = await db.getConnection();

  try {
    const { vendorAddress, amount } = req.body;

    const vendor = getAddress(vendorAddress);
    const adminWallet = getAddress(process.env.ADMIN_WALLET);
    const amt = Number(amount);

    await conn.beginTransaction();

    const [[vendorRow]] = await conn.query(
      "SELECT id, balance FROM vendors WHERE wallet_address=?",
      [vendor]
    );

    if (!vendorRow) throw new Error("Vendor not found");
    if (Number(vendorRow.balance) < amt) throw new Error("Insufficient balance");

    const tx = await studentPayVendor(vendor, adminWallet, amt);

    await conn.query(
      "UPDATE vendors SET balance = balance - ? WHERE id=?",
      [amt, vendorRow.id]
    );

    await conn.commit();

    res.json({
      success: true,
      txHash: tx.hash,
      message: "Sent to admin successfully"
    });

  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};