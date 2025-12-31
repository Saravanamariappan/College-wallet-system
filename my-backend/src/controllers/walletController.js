import db from "../config/db.js";
import { getOnChainBalance } from "../services/blockchainService.js";


export const getBalance = async (req, res) => {
const { user_id } = req.params;


db.query("SELECT wallet_address FROM users WHERE user_id=?", [user_id], async (err, rows) => {
if (rows.length === 0) return res.status(404).json({ error: "User not found" });


const balance = await getOnChainBalance(rows[0].wallet_address);
res.json({ balance: balance.toString() });
});
};