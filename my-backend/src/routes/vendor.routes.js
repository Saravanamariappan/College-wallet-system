import express from "express";
import {
  getVendorDashboard,
  vendorPayAdmin,
  getVendorTransactions,
  searchVendors,
  getAllVendors,
  getVendorSettings,
  getVendorAdminTransactions
} from "../controllers/vendorController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Vendor API working ✅" });
});

/* DASHBOARD */
router.get("/dashboard/:userId", getVendorDashboard);

/* PAY ADMIN */
router.post("/pay-admin", vendorPayAdmin);

/* VENDOR → ADMIN HISTORY */
router.get("/admin-transactions/:wallet", getVendorAdminTransactions);

/* OTHER */
router.get("/transactions/:wallet", getVendorTransactions);
router.get("/vendors/search", searchVendors);
router.get("/all", getAllVendors);
router.get("/settings/:userId", getVendorSettings);

export default router;
