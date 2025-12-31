import { ethers } from "ethers";

const wallet = ethers.Wallet.createRandom();

console.log("ADMIN ADDRESS :", wallet.address);
console.log("ADMIN PRIVATE KEY :", wallet.privateKey);
