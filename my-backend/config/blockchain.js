require("dotenv").config();
const { ethers } = require("ethers");

const abi = require("../abi/KGISLCollegeToken.json").abi;

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const adminWallet = new ethers.Wallet(
  process.env.ADMIN_PRIVATE_KEY,
  provider
);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi,
  adminWallet
);

module.exports = {
  provider,
  adminWallet,
  contract,
};
