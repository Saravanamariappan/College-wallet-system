import { provider, adminWallet } from "../services/blockchainService.js";

const balance = await provider.getBalance(adminWallet.address);

console.log("Admin Address:", adminWallet.address);
console.log("ETH Balance:", balance.toString());
