const express = require("express");
const { contract } = require("../config/blockchain");

module.exports = (db) => {
  const router = express.Router();

  router.post("/pay", async (req, res) => {
    const { student_id, vendor_id, amount } = req.body;

    try {
      const [[student]] = await db
        .promise()
        .query("SELECT wallet_address FROM students WHERE student_id=?", [
          student_id,
        ]);

      const [[vendor]] = await db
        .promise()
        .query("SELECT wallet_address FROM vendors WHERE vendor_id=?", [
          vendor_id,
        ]);

      await contract.studentSpend(
        student.wallet_address,
        vendor.wallet_address,
        amount
      );

      await db.promise().query(
        "UPDATE students SET balance = balance - ? WHERE student_id=?",
        [amount, student_id]
      );

      await db.promise().query(
        "UPDATE vendors SET balance = balance + ? WHERE vendor_id=?",
        [amount, vendor_id]
      );

      res.json({ message: "Payment successful" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
