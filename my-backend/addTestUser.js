import { db } from "./src/config/db.js";
import { ethers } from "ethers";

const addTestUser = async () => {
  try {
    // Create random wallet for test student
    const wallet = ethers.Wallet.createRandom();
    
    const email = "student@gmail.com";
    const password = "1234";
    const role = "STUDENT";
    const name = "Test Student";
    const walletAddress = wallet.address;
    const privateKey = wallet.privateKey;

    // Check if user already exists
    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      console.log("❌ User already exists!");
      return;
    }

    // Insert user
    const [result] = await db.execute(
      `INSERT INTO users (email, password, role, name, wallet_address, private_key, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [email, password, role, name, walletAddress, privateKey]
    );

    console.log("✅ Test student created!");
    console.log("Email: " + email);
    console.log("Password: " + password);
    console.log("Wallet: " + walletAddress);
    console.log("User ID: " + result.insertId);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

addTestUser();
