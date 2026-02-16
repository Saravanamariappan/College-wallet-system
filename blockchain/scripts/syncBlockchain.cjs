const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

/* LOAD ENV */
dotenv.config({
  path: path.resolve(__dirname, "../.env")
});

/* LOAD ABI */
const abi = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../../my-backend/src/config/abi.json"),
    "utf8"
  )
);

/* CREATE PROVIDER */
const provider = new ethers.providers.JsonRpcProvider(
  process.env.RPC_URL
);

/* CREATE WALLET */
const wallet = new ethers.Wallet(
  process.env.BACKEND_PRIVATE_KEY,
  provider
);

/* CREATE CONTRACT */
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi,
  wallet
);

/* FIXED GAS SETTINGS */
async function getGasOptions() {

  return {

    gasLimit: 500000,

    maxPriorityFeePerGas: ethers.utils.parseUnits("30", "gwei"),

    maxFeePerGas: ethers.utils.parseUnits("35", "gwei")

  };

}

async function sync() {

  try {

    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("Sync started...");
    console.log("Admin wallet:", wallet.address);

    let adminBalance = await contract.balanceOf(wallet.address);

    console.log("Admin balance:", adminBalance.toString());

    /* MINT IF ZERO */
    if (adminBalance.eq(0)) {

      console.log("Minting 1000 tokens to admin...");

      const mintTx = await contract.mint(
        wallet.address,
        1000,
        await getGasOptions()
      );

      await mintTx.wait();

      console.log("Mint successful");

      adminBalance = await contract.balanceOf(wallet.address);

      console.log("New admin balance:", adminBalance.toString());
    }

    /* SYNC STUDENTS */
    const [students] = await db.execute(
      "SELECT wallet_address, balance FROM students WHERE wallet_address IS NOT NULL"
    );

    for (const s of students) {

      const studentAddr = s.wallet_address;
      const balance = Number(s.balance);

      const isStudent = await contract.isStudent(studentAddr);

      if (!isStudent) {

        console.log("Register student:", studentAddr);

        const tx = await contract.registerStudent(
          studentAddr,
          await getGasOptions()
        );

        await tx.wait();

        console.log("Student registered");
      }

      if (balance > 0) {

        console.log("Sending tokens:", studentAddr, balance);

        const tx = await contract.adminSendToStudent(
          studentAddr,
          balance,
          await getGasOptions()
        );

        await tx.wait();

        console.log("Tokens sent");
      }
    }

    /* SYNC VENDORS */
    const [vendors] = await db.execute(
      "SELECT wallet_address FROM vendors WHERE wallet_address IS NOT NULL"
    );

    for (const v of vendors) {

      const vendorAddr = v.wallet_address;

      const isVendor = await contract.isVendor(vendorAddr);

      if (!isVendor) {

        console.log("Register vendor:", vendorAddr);

        const tx = await contract.registerVendor(
          vendorAddr,
          await getGasOptions()
        );

        await tx.wait();

        console.log("Vendor registered");
      }
    }

    console.log("SYNC COMPLETE");

    await db.end();

  }
  catch (err) {

    console.error("SYNC ERROR:", err);

  }
}

console.log(
  "PRIVATE KEY LOADED:",
  process.env.BACKEND_PRIVATE_KEY ? "YES" : "NO"
);

sync();
