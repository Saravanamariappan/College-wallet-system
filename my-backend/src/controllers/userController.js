import { createWallet } from "../utils/createWallet.js";

export const createUserWallet = async (req, res) => {
  const { role } = req.body; // "student" or "vendor"

  if (!["student", "vendor"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const wallet = createWallet();

  // 🔴 Real project la DB-la save pannanum
  // wallet.privateKey NEVER frontend-ku anuppa koodathu

  res.json({
    role,
    address: wallet.address,
    privateKey: wallet.privateKey // ⚠️ only for testing
  });
};
