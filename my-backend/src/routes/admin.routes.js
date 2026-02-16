import express from "express";
import {
  createStudentWallet,
  createVendorWallet,
  registerStudent,
  registerVendor,
  mintTokens,
  getAllStudents,
  getAllVendors,
  getMintHistory,
  getAdminDashboard,
  getTotalMinted,
  getVendorAdminTransactions,
  adminSendTokens,
  getAdminSendHistory,
  getAdminWalletBalance,
  getAdminSettings
} from "../controllers/admin.controller.js";

import { getAllTransactions } from "../controllers/transaction.controller.js";
const router = express.Router();

/* WALLET CREATE */
router.post("/students/create-wallet", createStudentWallet);
router.post("/vendors/create-wallet", createVendorWallet);

/* REGISTER */
router.post("/students/register", registerStudent);
router.post("/vendors/register", registerVendor);

/* MINT */
router.post("/mint-token", mintTokens);
router.get("/mint/history", getMintHistory);

/* GET ALL STUDENTS & VENDORS */
router.get("/students", getAllStudents);
router.get("/vendors", getAllVendors);

router.get("/dashboard", getAdminDashboard);

router.get("/mint/total", getTotalMinted);
router.get("/transactions", getAllTransactions);
router.get("/vendor-admin-transactions", getVendorAdminTransactions);

/* ================= SEND ================= */
router.post("/send-token", adminSendTokens);
router.get("/send/history", getAdminSendHistory);


router.get("/wallet-balance", getAdminWalletBalance);
router.get("/settings", getAdminSettings);


export default router;
