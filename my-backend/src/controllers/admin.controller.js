import { db } from "../config/db.js";
import { Wallet, getAddress, isAddress } from "ethers";
import bcrypt from "bcrypt";

import {
  registerStudentOnChain,
  registerVendorOnChain,
  mintToStudent
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
      SELECT id, name, email, wallet_address, balance
      FROM students
      ORDER BY id DESC
    `);

    res.json({ success: true, students: rows });

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
      SELECT id, user_id, name, category, email, wallet_address, balance
      FROM vendors
      ORDER BY id DESC
    `);

    res.json({ success: true, vendors: rows });

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
