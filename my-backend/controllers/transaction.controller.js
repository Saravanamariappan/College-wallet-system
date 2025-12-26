exports.createTransaction = (db) => (req, res) => {
  const { from_user, to_user, amount, type } = req.body;

  db.query(
    "INSERT INTO transactions (from_user,to_user,amount,type) VALUES (?,?,?,?)",
    [from_user, to_user, amount, type]
  );

  db.query(
    "UPDATE students SET balance = balance - ? WHERE student_id=?",
    [amount, from_user]
  );

  db.query(
    "UPDATE vendors SET balance = balance + ? WHERE vendor_id=?",
    [amount, to_user]
  );

  res.json({ message: "Transaction successful" });
};

exports.studentHistory = (db) => (req, res) => {
  db.query(
    "SELECT * FROM transactions WHERE from_user=?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
};
