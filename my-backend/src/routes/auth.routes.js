import express from "express";
import { studentLogin } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/student/login", studentLogin);

export default router;
