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
    PROVIDER (FIXED)
  ====================================================== */
  export const provider = new ethers.JsonRpcProvider(
    process.env.RPC_URL,
    {
      name: "polygon-amoy",
      chainId: 80002
    },
    {
      staticNetwork: true,
      polling: true,
      pollingInterval: 4000,
      timeout: 20000
    }
  );

  /* ======================================================
    WALLETS (SAFE INIT)
  ====================================================== */
  export const admin = new ethers.Wallet(
    process.env.ADMIN_PRIVATE_KEY,
    provider
  );

  export const backend = new ethers.Wallet(
    process.env.BACKEND_PRIVATE_KEY,
    provider
  );

  /* ======================================================
    CONTRACT INSTANCES
  ====================================================== */
  export const adminContract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    abi,
    admin
  );

  export const backendContract = new ethers.Contract(
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

      const tx = await adminContract.registerStudent(student);
      await tx.wait(1);

      return tx.hash;
    } catch (err) {
      if (
        err.reason?.includes("Already student") ||
        err.message?.includes("Already student")
      ) return "ALREADY";

      throw err;
    }
  }

  /* ======================================================
    REGISTER VENDOR
  ====================================================== */
  export async function registerVendorOnChain(wallet) {
    try {
      const vendor = getAddress(wallet);

      const tx = await adminContract.registerVendor(vendor);
      await tx.wait(1);

      return tx.hash;
    } catch (err) {
      if (
        err.reason?.includes("Already vendor") ||
        err.message?.includes("Already vendor")
      ) return "ALREADY";

      throw err;
    }
  }

  /* ======================================================
    MINT TOKENS
  ====================================================== */
  export async function mintToStudent(wallet, amount) {
    try {
      const student = getAddress(wallet);
      const tx = await adminContract.mint(student, Number(amount));

      await tx.wait(1);

      return tx.hash;
    } catch (err) {
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

      const tx = await backendContract.studentSpend(from, to, Number(amount));
      await tx.wait(1);

      return tx.hash;
    } catch (err) {
      throw err;
    }
  }

  /* ======================================================
    GET TOKEN BALANCE
  ====================================================== */
  export async function getTokenBalance(wallet) {
    try {
      const addr = getAddress(wallet);

      const bal = await adminContract.balanceOf(addr);
      return ethers.formatUnits(bal, 0);
    } catch (err) {
      return "0";
    }
  }

  /* ======================================================
    GET POL BALANCE (FIXED)
  ====================================================== */
  export async function getPolBalance(address) {
    try {
      if (!address) return "0";

      const bal = await provider.getBalance(address);
      return ethers.formatEther(bal);
    } catch (err) {
      return "0";
    }
  }

  /* ======================================================
    VENDOR PAY → ADMIN
  ====================================================== */

  export async function vendorPayAdminOnChain(vendor, amount) {
    try {
      const from = getAddress(vendor);
      const tx = await backendContract.vendorPayAdmin(from, Number(amount));

      await tx.wait(1);

      return tx.hash;
    } catch (err) {
      throw err;
    }
  }
  export async function adminSendToStudentOnChain(student, amount) {
  try {
    const addr = getAddress(student);

    const tx = await adminContract.adminSendToStudent(
      addr,
      Number(amount)
    );

    await tx.wait(1);

    return tx.hash;

  } catch (err) {
    throw err;
  }
}

