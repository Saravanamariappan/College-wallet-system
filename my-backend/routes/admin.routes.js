const express = require("express");
const { ethers } = require("ethers");
const { contract } = require("../config/blockchain");

module.exports = (db) => {
  const router = express.Router();

  // ADD STUDENT
  router.post("/add-student", async (req, res) => {
    const { student_id, name, password, initialTokens } = req.body;

    try {
      const wallet = ethers.Wallet.createRandom();

      await db.promise().query(
        `INSERT INTO students 
         (student_id, name, password, wallet_address, private_key, balance)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          student_id,
          name,
          password,
          wallet.address,
          wallet.privateKey,
          initialTokens || 0,
        ]
      );

      await contract.registerStudent(wallet.address);

      if (initialTokens && initialTokens > 0) {
        await contract.mint(wallet.address, initialTokens);
      }

      res.json({ message: "Student added", wallet: wallet.address });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ADD VENDOR
  router.post("/add-vendor", async (req, res) => {
    const { vendor_id, name, password } = req.body;

    try {
      const wallet = ethers.Wallet.createRandom();

      await db.promise().query(
        `INSERT INTO vendors
         (vendor_id, name, password, wallet_address, private_key, balance)
         VALUES (?, ?, ?, ?, ?, 0)`,
        [vendor_id, name, password, wallet.address, wallet.privateKey]
      );

      await contract.registerVendor(wallet.address);

      res.json({ message: "Vendor added", wallet: wallet.address });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
