import db from "../config/db.js";
import bcrypt from "bcrypt";

export const studentLogin = (req, res) => {
  const { studentId, password } = req.body;

  const sql = "SELECT * FROM students WHERE student_id = ?";
  db.query(sql, [studentId], async (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0)
      return res.status(401).json({ message: "Student not found" });

    const match = await bcrypt.compare(password, result[0].password);
    if (!match)
      return res.status(401).json({ message: "Invalid password" });

    res.json({
      message: "Login success",
      student: result[0]
    });
  });
};
