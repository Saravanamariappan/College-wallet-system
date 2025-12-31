import express from "express";
import {
  createStudent,
  registerStudent,
  mintStudentTokens,
  payVendor,
  getBalance
} from "../controllers/student.controller.js";

const router = express.Router();

/* -------- STUDENT ROUTES -------- */

// create wallet (NO blockchain)
router.post("/create", createStudent);

// admin → register student on blockchain
router.post("/register", registerStudent);

// admin → mint tokens to student
router.post("/mint", mintStudentTokens);

// backend → student pays vendor
router.post("/pay", payVendor);

// get balance
router.get("/balance/:address", getBalance);

// health check
router.get("/", (req, res) => {
  res.json({ message: "Student API working ✅" });
});

export default router;
