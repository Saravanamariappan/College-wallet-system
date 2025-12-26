const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  router.post("/student/login", (req, res) => {
    const { studentId, password } = req.body;

    db.query(
      "SELECT student_id, name, wallet_address, balance FROM students WHERE student_id=? AND password=?",
      [studentId, password],
      (err, results) => {
        if (err) return res.status(500).json({ message: "DB error" });
        if (results.length === 0)
          return res.status(401).json({ message: "Invalid login" });

        res.json({ message: "Login success", student: results[0] });
      }
    );
  });

  return router;
};
