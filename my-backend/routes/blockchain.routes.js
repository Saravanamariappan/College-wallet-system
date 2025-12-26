const express = require("express");
const router = express.Router();
const { getTransactions } = require("../blockchain/blockchainController");
const {
  studentPayVendor,
  getBalance,
} = require("../blockchain/blockchainController");

router.post("/student-pay", studentPayVendor);
router.get("/balance/:address", getBalance);
router.get("/transactions/:wallet", getTransactions);

module.exports = router;
