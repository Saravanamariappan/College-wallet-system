import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ABI */
const abiPath = path.join(__dirname, "../config/abi.json");
const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));

/* Provider */
export const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

/* Wallets */
export const adminWallet = new ethers.Wallet(
  process.env.ADMIN_PRIVATE_KEY,
  provider
);

export const backendWallet = new ethers.Wallet(
  process.env.BACKEND_PRIVATE_KEY,
  provider
);

/* Contracts */
export const adminContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi,
  adminWallet
);

export const backendContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi,
  backendWallet
);

/* Admin */
export async function registerStudentOnChain(student) {
  const tx = await adminContract.registerStudent(student);
  await tx.wait();
  return tx.hash;
}

export async function registerVendorOnChain(vendor) {
  const tx = await adminContract.registerVendor(vendor);
  await tx.wait();
  return tx.hash;
}

export async function mintToStudent(student, amount) {
  const tx = await adminContract.mint(student, amount);
  await tx.wait();
  return tx.hash;
}

/* Backend */
export async function studentPayVendor(student, vendor, amount) {
  const tx = await backendContract.studentSpend(student, vendor, amount);
  await tx.wait();
  return tx.hash;
}

export async function getBalance(address) {
  return await adminContract.getBalance(address);
}

/* DEBUG */
console.log("Admin wallet   :", adminWallet.address);
console.log("Backend wallet :", backendWallet.address);

const backendOnChain = await adminContract.backend();
console.log("Backend in contract:", backendOnChain);
