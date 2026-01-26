import express from "express";
import {
  createStudentWallet,
  createVendorWallet,
  registerStudent,
  registerVendor,
  mintTokens,
  getAllStudents,
  getAllVendors,
  getMintHistory
} from "../controllers/admin.controller.js";

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

export default router;
