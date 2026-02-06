import { Wallet, getAddress } from "ethers";
import { db } from "../config/db.js";
import { vendorPayAdminOnChain } from "../services/blockchainService.js";

/* ================= GET VENDOR WALLET + BALANCE ================= */
export const getVendorDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId)
      return res.status(400).json({ message: "User ID missing" });

    const [rows] = await db.execute(
      "SELECT wallet_address, balance FROM vendors WHERE user_id = ?",
      [userId]
    );

    if (!rows.length)
      return res.status(404).json({ message: "Vendor wallet not found" });

    res.json({
      wallet: rows[0].wallet_address,
      balance: Number(rows[0].balance) 
    });

  } catch (err) {
    console.error("Vendor dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= VENDOR TRANSACTIONS ================= */
export const getVendorTransactions = async (req, res) => {
  try {
    const wallet = getAddress(req.params.wallet);

    const [rows] = await db.query(
      `SELECT id, student_wallet, amount, created_at
       FROM transactions
       WHERE vendor_wallet = ?
       ORDER BY id DESC
       LIMIT 10`,
      [wallet]
    );

    res.json({ transactions: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= SEARCH VENDORS ================= */
export const searchVendors = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q?.trim()) return res.json({ vendors: [] });

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
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET ALL VENDORS ================= */
export const getAllVendors = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name, wallet_address
       FROM vendors
       ORDER BY name ASC`
    );

    res.json({ vendors: rows });
  } catch (err) {
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

    if (!rows.length)
      return res.status(404).json({ error: "Vendor not found" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= VENDOR → ADMIN PAY ================= */
export const vendorPayAdmin = async (req, res) => {
  const conn = await db.getConnection();

  try {
    const { vendorWallet, amount } = req.body;

    if (!vendorWallet || !amount)
      throw new Error("Missing fields");

    const vendor = getAddress(vendorWallet);
    const amt = Number(amount);
    if (amt <= 0) throw new Error("Invalid amount");

    const adminWallet = new Wallet(
      process.env.ADMIN_PRIVATE_KEY
    ).address;

    await conn.beginTransaction();

    const [vendors] = await conn.query(
      "SELECT id, balance FROM vendors WHERE wallet_address = ?",
      [vendor]
    );

    if (!vendors.length) throw new Error("Vendor not found");
    if (Number(vendors[0].balance) < amt)
      throw new Error("Insufficient balance");

    const txHash = await vendorPayAdminOnChain(vendor, amt);


    await conn.query(
      "UPDATE vendors SET balance = balance - ? WHERE id = ?",
      [amt, vendors[0].id]
    );

    await conn.query(
      `INSERT INTO vendor_admin_transactions
       (vendor_id, vendor_wallet, admin_wallet, amount, tx_hash)
       VALUES (?, ?, ?, ?, ?)`,
      [vendors[0].id, vendor, adminWallet, amt, txHash]

    );

    await conn.commit();

    res.json({
      success: true,
      amount: amt,
      txHash: txHash
    });

  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally {
    conn.release();
  }
};

/* ================= VENDOR → ADMIN HISTORY ================= */
export const getVendorAdminTransactions = async (req, res) => {
  try {
    const vendorWallet = getAddress(req.params.wallet);

    const [rows] = await db.query(
      `SELECT id, admin_wallet, amount, tx_hash, created_at
       FROM vendor_admin_transactions
       WHERE vendor_wallet = ?
       ORDER BY id DESC`,
      [vendorWallet]
    );

    res.json({ history: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
