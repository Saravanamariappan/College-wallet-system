import express from "express";
import { createVendor } from "../controllers/vendor.controller.js";

const router = express.Router();

router.post("/create", createVendor);

export default router;
