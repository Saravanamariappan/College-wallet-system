import express from "express";
import {
  registerStudent,
  registerVendor
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/register-student", registerStudent);
router.post("/register-vendor", registerVendor);

export default router;
