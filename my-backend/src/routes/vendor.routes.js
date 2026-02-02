import express from "express";
import {
  getVendorDashboard,
  vendorSendAdmin,
  getVendorTransactions,
  searchVendors,
  getAllVendors,
  getVendorSettings,
} from "../controllers/vendorController.js";

const router = express.Router();

router.get('/dashboard/:userId', getVendorDashboard);


router.post("/send-admin", vendorSendAdmin);

router.get("/", (req, res) => {
  res.json({ message: "Vendor API working ✅" });
});

router.get("/all", getAllVendors);

router.get("/transactions/:wallet", getVendorTransactions);

router.get("/vendors/search", searchVendors);
router.get("/settings/:userId", getVendorSettings);

export default router;
