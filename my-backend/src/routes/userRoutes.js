import express from "express";
import { createUserWallet } from "../controllers/userController.js";

const router = express.Router();

router.post("/create-wallet", createUserWallet);

export default router;
