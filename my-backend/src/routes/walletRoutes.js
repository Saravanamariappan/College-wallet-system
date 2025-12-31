import express from "express";
import { getBalance } from "../controllers/walletController.js";
const r = express.Router();
r.get('/balance/:user_id', getBalance);
export default r;