import { getAddress } from "ethers";
import {
  registerStudentOnChain,
  registerVendorOnChain,
  mintToStudent
} from "../services/blockchainService.js";

/* ---------------- REGISTER STUDENT ---------------- */
export const registerStudent = async (req, res) => {
  try {
    const { studentAddress } = req.body;
    if (!studentAddress) {
      return res.status(400).json({ error: "studentAddress required" });
    }

    const student = getAddress(studentAddress);
    const txHash = await registerStudentOnChain(student);

    res.json({
      message: "Student registered successfully",
      txHash
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ---------------- REGISTER VENDOR ---------------- */
export const registerVendor = async (req, res) => {
  try {
    const { vendorAddress } = req.body;
    if (!vendorAddress) {
      return res.status(400).json({ error: "vendorAddress required" });
    }

    const vendor = getAddress(vendorAddress);
    const txHash = await registerVendorOnChain(vendor);

    res.json({
      message: "Vendor registered successfully",
      txHash
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ---------------- MINT TOKENS ---------------- */
export const mintTokens = async (req, res) => {
  try {
    const { studentAddress, amount } = req.body;
    if (!studentAddress || !amount) {
      return res.status(400).json({ error: "Missing data" });
    }

    const student = getAddress(studentAddress);
    const txHash = await mintToStudent(student, amount);

    res.json({
      message: "Tokens minted successfully",
      txHash
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
