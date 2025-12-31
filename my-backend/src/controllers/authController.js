import db from "../config/db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

export const login = async (req, res) => {
  const { user_id, password } = req.body;

  const [rows] = await db.query(
    "SELECT * FROM users WHERE user_id=?",
    [user_id]
  );

  if (!rows.length)
    return res.status(401).json({ message: "User not found" });

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);

  if (!match)
    return res.status(401).json({ message: "Wrong password" });

  res.json({
    token: generateToken(user),
    role: user.role,
  });
};
