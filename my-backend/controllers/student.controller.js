const db = require("../db");

exports.getDashboard = async (req, res) => {
  const { student_id } = req.params;

  const [rows] = await db.promise().query(
    "SELECT * FROM students WHERE student_id = ?",
    [student_id]
  );

  res.json(rows[0]);
};
