import db from "../config/db.js";




export const createTransaction = async (req, res) => {
  const { to_user, amount, tx_hash } = req.body;

  await db.query(
    "INSERT INTO transactions (from_user,to_user,amount,tx_hash) VALUES (?,?,?,?)",
    [req.user.id, to_user, amount, tx_hash]
  );

  res.json({ message: "Transaction saved" });
};
