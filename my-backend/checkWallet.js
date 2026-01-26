import { Wallet } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const wallet = new Wallet(process.env.BACKEND_PRIVATE_KEY);

console.log("ADMIN WALLET ADDRESS:", wallet.address);
console.log("ADMIN WALLET PRIVATE KEY:", process.env.BACKEND_PRIVATE_KEY);
