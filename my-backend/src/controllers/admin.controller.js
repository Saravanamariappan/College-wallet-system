import { db } from "../config/db.js";
import { Wallet, getAddress, isAddress, formatUnits } from "ethers";

import bcrypt from "bcrypt";


import {
  registerStudentOnChain,
  registerVendorOnChain,
  mintToStudent,
  getPolBalance,
  getTokenBalance,
  adminSendToStudentOnChain
} from "../services/blockchainService.js";

/* =========================================================
   CREATE STUDENT WALLET (ADMIN)
========================================================= */
export const createStudentWallet = async (req, res) => {
  try {
    const wallet = Wallet.createRandom();

    await db.query(
      `INSERT INTO students (wallet_address, private_key, balance)
       VALUES (?, ?, 0)`,
      [wallet.address, wallet.privateKey]
    );

    res.json({
      success: true,
      walletAddress: wallet.address,
      privateKey: wallet.privateKey
    });

  } catch (err) {
    console.error("createStudentWallet error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   CREATE VENDOR WALLET (ADMIN)   ✅ FINAL FIX
========================================================= */
export const createVendorWallet = async (req, res) => {
  try {
    const wallet = Wallet.createRandom();

    await db.query(
      `INSERT INTO vendors 
       (name, category, email, wallet_address, private_key, balance)
       VALUES (?, ?, ?, ?, ?, 0)`,
      ["", "TEMP", "", wallet.address, wallet.privateKey]
    );

    res.json({
      success: true,
      walletAddress: wallet.address,
      privateKey: wallet.privateKey
    });

  } catch (err) {
    console.error("createVendorWallet error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   REGISTER STUDENT (ADMIN)
========================================================= */
export const registerStudent = async (req, res) => {
  try {
    const { name, email, password, walletAddress } = req.body;

    const [exists] = await db.query(
      "SELECT id FROM users WHERE email=?",
      [email]
    );

    if (exists.length) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [user] = await db.query(
      `INSERT INTO users (email, password, role)
       VALUES (?, ?, 'STUDENT')`,
      [email, hashed]
    );

    const [result] = await db.query(
      `UPDATE students
       SET user_id=?, name=?, email=?
       WHERE wallet_address=?`,
      [user.insertId, name, email, walletAddress]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "Student wallet not found" });
    }

    await registerStudentOnChain(walletAddress);

    res.json({ success: true, message: "Student registered successfully" });

  } catch (err) {
    console.error("registerStudent error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   REGISTER VENDOR (ADMIN)   ✅ FINAL FIX
========================================================= */
export const registerVendor = async (req, res) => {
  try {
    const { name, email, password, category, walletAddress } = req.body;

    if (!name || !email || !password || !category || !walletAddress) {
      return res.status(400).json({ error: "All fields required" });
    }

    if (!isAddress(walletAddress)) {
      return res.status(400).json({ error: "Invalid wallet address" });
    }

    const [exists] = await db.query(
      "SELECT id FROM users WHERE email=?",
      [email]
    );

    if (exists.length) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    /* ---------- USERS TABLE ---------- */
    const [user] = await db.query(
      `INSERT INTO users (email, password, role)
       VALUES (?, ?, 'VENDOR')`,
      [email, hashed]
    );

    /* ---------- UPDATE VENDOR ROW ---------- */
    const [result] = await db.query(
      `UPDATE vendors
       SET user_id=?, name=?, category=?, email=?
       WHERE wallet_address=?`,
      [user.insertId, name, category, email, walletAddress]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "Vendor wallet not found" });
    }

    await registerVendorOnChain(walletAddress);

    res.json({
      success: true,
      message: "Vendor registered successfully"
    });

  } catch (err) {
    console.error("registerVendor error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   GET ALL STUDENTS
========================================================= */
export const getAllStudents = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, name, email, wallet_address, balance, status
      FROM students
      ORDER BY id DESC
    `);

    res.json({
      success: true,
      students: rows
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
/* =========================================================
   GET ALL VENDORS
========================================================= */
export const getAllVendors = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, name, category, email, wallet_address, balance, status
      FROM vendors
      ORDER BY id DESC
    `);

    res.json({
      success: true,
      vendors: rows
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   MINT TOKENS
========================================================= */
export const mintTokens = async (req, res) => {
  try {
    const { walletAddress, amount } = req.body;

    if (!walletAddress || !amount) {
      return res.status(400).json({ error: "Wallet & amount required" });
    }

    const wallet = getAddress(walletAddress);

    await registerStudentOnChain(wallet);

    const txHash = await mintToStudent(wallet, amount);

    await db.query(
      `UPDATE students SET balance = balance + ? WHERE wallet_address=?`,
      [amount, wallet]
    );

    await db.query(
      `INSERT INTO mint_history (student_wallet, amount, tx_hash)
       VALUES (?, ?, ?)`,
      [wallet, amount, txHash]
    );

    res.json({
      success: true,
      message: "Mint successful",
      txHash
    });

  } catch (err) {
    console.error("mintTokens error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   GET MINT HISTORY
========================================================= */
export const getMintHistory = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, student_wallet, amount, tx_hash, created_at
      FROM mint_history
      ORDER BY id DESC
    `);

    res.json({ success: true, data: rows });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   ADMIN DASHBOARD OVERVIEW
========================================================= */

export const getAdminDashboard = async (req, res) => {
  try {
    /* ================= COUNTS ================= */
    const [[{ students }]] = await db.query(
      "SELECT COUNT(*) AS students FROM students"
    );

    const [[{ vendors }]] = await db.query(
      "SELECT COUNT(*) AS vendors FROM vendors"
    );

    const [[{ minted }]] = await db.query(
      "SELECT IFNULL(SUM(amount),0) AS minted FROM mint_history"
    );

    const [[{ transactions }]] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM mint_history) +
        (SELECT COUNT(*) FROM admin_transactions) +
        (SELECT COUNT(*) FROM vendor_admin_transactions)
        AS transactions
    `);

    const [[{ vendorPayments }]] = await db.query(`
      SELECT IFNULL(SUM(amount), 0) AS vendorPayments
      FROM vendor_admin_transactions
    `);

    /* ================= ADMIN WALLET (NO BLOCKCHAIN CALL) ================= */
    if (!process.env.ADMIN_PRIVATE_KEY) {
      return res.status(500).json({
        error: "ADMIN_PRIVATE_KEY not set"
      });
    }

    const adminWallet = new Wallet(
      process.env.ADMIN_PRIVATE_KEY
    ).address;

    return res.json({
      success: true,
      stats: {
        students,
        vendors,
        minted,
        transactions,
        vendorPayments
      },
      admin: {
        wallet: adminWallet
      }
    });

  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({
      message: "Dashboard error",
      error: err.message
    });
  }
};

/* ================= ADMIN WALLET BALANCE (ON DEMAND) ================= */

export const getAdminWalletBalance = async (req, res) => {
  try {
    const adminWallet = new Wallet(
      process.env.ADMIN_PRIVATE_KEY
    ).address;

    const polBalance = await getPolBalance(adminWallet);

    // 🔴 RAW token balance
    const tokenBalanceRaw = await getTokenBalance(adminWallet);

    // ✅ Convert using decimals = 18
    const tokenBalance = formatUnits(tokenBalanceRaw, 18);

    res.json({
      wallet: adminWallet,
      polBalance,
      tokenBalance
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   GET TOTAL MINTED (FOR MINT PAGE)
========================================================= */
export const getTotalMinted = async (req, res) => {
  try {
    const [[{ totalMinted }]] = await db.query(
      "SELECT IFNULL(SUM(amount),0) AS totalMinted FROM mint_history"
    );

    res.json({
      success: true,
      totalMinted
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* =========================================================
   GET VENDOR → ADMIN PAYMENT HISTORY
========================================================= */
export const getVendorAdminTransactions = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        vat.id,
        v.name AS vendor_name,
        vat.vendor_wallet,
        vat.amount,
        vat.tx_hash,
        vat.created_at
      FROM vendor_admin_transactions vat
      JOIN vendors v ON v.id = vat.vendor_id
      ORDER BY vat.id DESC
    `);

    res.json({
      success: true,
      transactions: rows
    });

  } catch (err) {
    console.error("getVendorAdminTransactions error:", err);
    res.status(500).json({ error: err.message });
  }
};



export const adminSendTokens = async (req, res) => {
  try {
    const { walletAddress, amount } = req.body;

    if (!walletAddress || !amount)
      return res.status(400).json({ error: "Required fields missing" });

    const wallet = getAddress(walletAddress);

    /* ================= CALL SMART CONTRACT ================= */
    const txHash = await adminSendToStudentOnChain(wallet, amount);

    /* ================= UPDATE STUDENT BALANCE ================= */
    await db.query(
      "UPDATE students SET balance = balance + ? WHERE wallet_address=?",
      [amount, wallet]
    );

    /* ================= STORE HISTORY ================= */
    await db.query(
      `INSERT INTO admin_transactions 
       (student_wallet, amount, tx_hash)
       VALUES (?, ?, ?)`,
      [wallet, amount, txHash]
    );

    res.json({
      success: true,
      message: "Admin sent tokens successfully",
      txHash
    });

  } catch (err) {
    console.error("adminSendTokens error:", err);
    res.status(500).json({ error: err.message });
  }
};


/* =========================================================
   ADMIN SEND HISTORY
========================================================= */
export const getAdminSendHistory = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT id, student_wallet, amount, tx_hash, created_at
      FROM admin_transactions
      ORDER BY id DESC
    `);

    res.json({
      success: true,
      history: rows
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   ADMIN SETTINGS (SHOW WALLET + PRIVATE KEY)
========================================================= */
export const getAdminSettings = async (req, res) => {
  try {
    if (!process.env.ADMIN_PRIVATE_KEY) {
      return res.status(500).json({
        error: "ADMIN_PRIVATE_KEY not set in .env"
      });
    }

    const privateKey = process.env.ADMIN_PRIVATE_KEY;

    const walletAddress = new Wallet(privateKey).address;

    res.json({
      success: true,
      walletAddress,
      privateKey   // ⚠️ Full private key returning
    });

  } catch (err) {
    console.error("getAdminSettings error:", err);
    res.status(500).json({ error: err.message });
  }
};


export const updateStudentStatus = async (req, res) => {
  try {
    const { walletAddress, status } = req.body;

    if (!walletAddress || !status) {
      return res.status(400).json({ error: "Missing data" });
    }

    await db.query(
      "UPDATE students SET status=? WHERE wallet_address=?",
      [status, walletAddress]
    );

    res.json({
      success: true,
      message: "Student status updated"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateVendorStatus = async (req, res) => {
  try {
    const { walletAddress, status } = req.body;

    if (!walletAddress || !status) {
      return res.status(400).json({ error: "Missing data" });
    }

    await db.query(
      "UPDATE vendors SET status=? WHERE wallet_address=?",
      [status, walletAddress]
    );

    res.json({
      success: true,
      message: "Vendor status updated"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};