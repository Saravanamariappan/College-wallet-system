import express from "express";
import {
  payVendor,
  getStudentWallet,
  getStudentPrivateKey,
  changeStudentPassword
} from "../controllers/student.controller.js";

const router = express.Router();



/* STUDENT WALLET */
router.get("/wallet/:userId", getStudentWallet);

/* PAY */
router.post("/pay", payVendor);

router.get("/private-key/:userId", getStudentPrivateKey);
router.put("/change-password/:userId", changeStudentPassword);


export default router;
