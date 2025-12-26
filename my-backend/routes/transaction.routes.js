const express = require("express");
const { contract } = require("../config/blockchain");

module.exports = (db) => {
  const router = express.Router();

  // ADMIN → STUDENT CREDIT
  router.post("/admin-credit", async (req, res) => {
    const { to_user, amount } = req.body;

    try {
      const [[student]] = await db
        .promise()
        .query("SELECT wallet_address FROM students WHERE student_id=?", [
          to_user,
        ]);

      await contract.mint(student.wallet_address, amount);

      await db.promise().query(
        "UPDATE students SET balance = balance + ? WHERE student_id=?",
        [amount, to_user]
      );

      res.json({ message: "Student credited" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
