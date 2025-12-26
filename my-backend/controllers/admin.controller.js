const express = require("express");
const { ethers } = require("ethers");
const { contract, adminWallet } = require("../config/blockchain");

module.exports = (db) => {
  const router = express.Router();

  // ======================================
  // ADD STUDENT
  // POST /api/admin/add-student
  // ======================================
  router.post("/add-student", async (req, res) => {
    const { student_id, name, email, password, initialTokens } = req.body;

    if (!student_id || !name || !password) {
      return res.status(400).json({
        message: "student_id, name, password required",
      });
    }

    try {
      // 1️⃣ CREATE WALLET
      const studentWallet = ethers.Wallet.createRandom();

      const walletAddress = studentWallet.address;
      const privateKey = studentWallet.privateKey;

      // 2️⃣ SAVE TO DB (FIXED)
      const sql = `
        INSERT INTO students
        (student_id, name, email, password, wallet_address, private_key)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      await new Promise((resolve, reject) => {
        db.query(
          sql,
          [
            student_id,
            name,
            email || null,
            password,
            walletAddress,
            privateKey,
          ],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });

      // 3️⃣ GET NONCE (NOW WORKS ✅)
      let nonce = await adminWallet.getNonce();

      // 4️⃣ REGISTER STUDENT
      const tx1 = await contract.registerStudent(walletAddress, { nonce });
      await tx1.wait();
      nonce++;

      // 5️⃣ MINT TOKENS
      if (initialTokens && Number(initialTokens) > 0) {
        const tx2 = await contract.mint(
          walletAddress,
          Number(initialTokens),
          { nonce }
        );
        await tx2.wait();
      }

      res.json({
        message: "✅ Student added successfully",
        student_id,
        wallet_address: walletAddress,
        tokens: initialTokens || 0,
      });
    } catch (err) {
      console.error("❌ Add student error:", err);
      res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    }
  });

  return router;
};
  