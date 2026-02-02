import express from "express";
import {
  payVendor,
  getStudentWallet,
  getStudentPrivateKey
} from "../controllers/student.controller.js";

const router = express.Router();



/* STUDENT WALLET */
router.get("/wallet/:userId", getStudentWallet);

/* PAY */
router.post("/pay", payVendor);

router.get("/private-key/:userId", getStudentPrivateKey);


export default router;
