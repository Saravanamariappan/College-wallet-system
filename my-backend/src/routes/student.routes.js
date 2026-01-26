import express from "express";
import {
  payVendor,
  getStudentWallet
} from "../controllers/student.controller.js";

const router = express.Router();



/* STUDENT WALLET */
router.get("/wallet/:userId", getStudentWallet);

/* PAY */
router.post("/pay", payVendor);

export default router;
