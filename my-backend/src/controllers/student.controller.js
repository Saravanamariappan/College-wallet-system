import { Wallet, getAddress } from "ethers";
import {
  registerStudentOnChain,
  mintToStudent,
  studentPayVendor,
  adminContract
} from "../services/blockchainService.js";

/* ---------------- CREATE STUDENT (NO BLOCKCHAIN) ---------------- */
export const createStudent = async (req, res) => {
  try {
    console.log("➡️ CREATE STUDENT called");

    const wallet = Wallet.createRandom();

    console.log("🧾 New student wallet created:");
    console.log("   Address :", wallet.address);

    res.json({
      message: "Student wallet created successfully",
      studentAddress: wallet.address,
      privateKey: wallet.privateKey
    });

  } catch (err) {
    console.error("❌ Create student error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ---------------- REGISTER STUDENT (ADMIN) ---------------- */
export const registerStudent = async (req, res) => {
  try {
    console.log("➡️ REGISTER STUDENT called");
    console.log("📦 Request body:", req.body);

    const { studentAddress } = req.body;
    if (!studentAddress) {
      return res.status(400).json({ error: "studentAddress required" });
    }

    const student = getAddress(studentAddress);
    console.log("✅ Checksummed student address:", student);

    const txHash = await registerStudentOnChain(student);

    console.log("⛓️ Register tx hash:", txHash);

    res.json({
      message: "Student registered on blockchain",
      txHash
    });

  } catch (err) {
    console.error("❌ Register student error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ---------------- MINT TOKENS (ADMIN) ---------------- */
export const mintStudentTokens = async (req, res) => {
  try {
    console.log("➡️ MINT TOKENS called");
    console.log("📦 Request body:", req.body);

    const { studentAddress, amount } = req.body;
    if (!studentAddress || !amount) {
      return res.status(400).json({ error: "Missing data" });
    }

    const student = getAddress(studentAddress);
    console.log("✅ Student address:", student);
    console.log("💰 Amount:", amount);

    const txHash = await mintToStudent(student, amount);

    console.log("⛓️ Mint tx hash:", txHash);

    res.json({
      message: "Tokens minted successfully",
      txHash
    });

  } catch (err) {
    console.error("❌ Mint error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ---------------- STUDENT → VENDOR (BACKEND ONLY) ---------------- */
export const payVendor = async (req, res) => {
  try {
    console.log("➡️ PAY VENDOR called");
    console.log("📦 Request body:", req.body);

    const { studentAddress, vendorAddress, amount } = req.body;
    if (!studentAddress || !vendorAddress || !amount) {
      return res.status(400).json({ error: "Missing data" });
    }

    const student = getAddress(studentAddress);
    const vendor  = getAddress(vendorAddress);

    console.log("👨‍🎓 Student:", student);
    console.log("🏪 Vendor :", vendor);
    console.log("💰 Amount :", amount);

    const txHash = await studentPayVendor(student, vendor, amount);

    console.log("⛓️ Payment tx hash:", txHash);

    res.json({
      message: "Payment successful",
      txHash
    });

  } catch (err) {
    console.error("❌ Pay vendor error FULL:", err);
    console.error("❌ Error message:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ---------------- GET BALANCE ---------------- */
export const getBalance = async (req, res) => {
  try {
    console.log("➡️ GET BALANCE called");
    console.log("📍 Address param:", req.params.address);

    const address = getAddress(req.params.address);
    console.log("✅ Checksummed address:", address);

    console.log("🔑 adminContract signer address:");
    console.log("   ", await adminContract.signer.getAddress());

    const balance = await adminContract.getBalance(address);

    console.log("💰 Balance:", balance.toString());

    res.json({ balance: balance.toString() });

  } catch (err) {
    console.error("❌ Get balance error:", err);
    res.status(500).json({ error: err.message });
  }
};
