import { ethers, getAddress } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

/* ======================================================
   PATH RESOLVE
====================================================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ======================================================
   LOAD ABI
====================================================== */
const abiPath = path.join(__dirname, "../config/abi.json");
const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));

/* ======================================================
   PROVIDER
====================================================== */
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

/* ======================================================
   WALLETS
====================================================== */
const admin = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
const backend = new ethers.Wallet(process.env.BACKEND_PRIVATE_KEY, provider);

/* ======================================================
   CONTRACT INSTANCES
====================================================== */
const adminContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi,
  admin
);

const backendContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi,
  backend
);

/* ======================================================
   REGISTER STUDENT
====================================================== */
export async function registerStudentOnChain(wallet) {
  try {
    const student = getAddress(wallet);
    console.log("🔵 Registering student:", student);

    const tx = await adminContract.registerStudent(student);
    const receipt = await tx.wait();

    console.log("✅ Student registered:", receipt.hash);
    return receipt.hash;

  } catch (err) {
    console.error("❌ registerStudent error:", err.reason || err.message);

    if (
      err.reason?.includes("Already student") ||
      err.message?.includes("Already student")
    ) {
      return "ALREADY";
    }

    throw err;
  }
}

/* ======================================================
   REGISTER VENDOR
====================================================== */
export async function registerVendorOnChain(wallet) {
  try {
    const vendor = getAddress(wallet);
    console.log("🔵 Registering vendor:", vendor);

    const tx = await adminContract.registerVendor(vendor);
    const receipt = await tx.wait();

    console.log("✅ Vendor registered:", receipt.hash);
    return receipt.hash;

  } catch (err) {
    console.error("❌ registerVendor error:", err.reason || err.message);

    if (
      err.reason?.includes("Already vendor") ||
      err.message?.includes("Already vendor")
    ) {
      return "ALREADY";
    }

    throw err;
  }
}

/* ======================================================
   MINT TOKENS
====================================================== */
export async function mintToStudent(wallet, amount) {
  try {
    const student = getAddress(wallet);
    console.log("🔵 Minting", amount, "tokens to:", student);

    const value = ethers.parseUnits(amount.toString(), 18);

    const tx = await adminContract.mint(student, value);
    const receipt = await tx.wait();

    console.log("✅ Mint success:", receipt.hash);
    return receipt.hash;

  } catch (err) {
    console.error("❌ mint error:", err.reason || err.message);
    throw err;
  }
}

/* ======================================================
   STUDENT PAY → VENDOR
====================================================== */
export async function studentPayVendor(student, vendor, amount) {
  try {
    const from = getAddress(student);
    const to = getAddress(vendor);

    console.log("🔵 Spending:", amount, "from:", from, "to:", to);

    const value = ethers.parseUnits(amount.toString(), 18);

    const tx = await backendContract.studentSpend(from, to, value);
    await tx.wait();

    console.log("✅ Spend success:", tx.hash);
    return tx;   // 🔥 RETURN FULL TRANSACTION OBJECT

  } catch (err) {
    console.error("❌ studentSpend error:", err.reason || err.message);
    throw err;
  }
}

/* ======================================================
   GET TOKEN BALANCE
====================================================== */
export async function getTokenBalance(wallet) {
  try {
    const addr = getAddress(wallet);
    console.log("🔵 Checking balance:", addr);

    const bal = await adminContract.balanceOf(addr);
    const readable = ethers.formatUnits(bal, 18);

    console.log("💰 Balance:", readable);
    return readable;

  } catch (err) {
    console.error("❌ balance error:", err.reason || err.message);
    return "0";
  }
}
