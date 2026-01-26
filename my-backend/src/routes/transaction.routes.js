import express from "express";
import {
  getStudentTransactions,
  getVendorTransactions,
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.get("/student/:address", getStudentTransactions);
router.get("/vendor/:address", getVendorTransactions);

export default router;
