import express from "express";
import { getWalletBalance } from "../controllers/walletController.js";

const router = express.Router();

router.get("/balance/:walletAddress", getWalletBalance);

export default router;
