import express from "express";
import {
  createTransaction,
  getStudentTransactions,
  getVendorTransactions
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.post("/", createTransaction);
router.get("/student/:address", getStudentTransactions);
router.get("/vendor/:address", getVendorTransactions);

export default router;
