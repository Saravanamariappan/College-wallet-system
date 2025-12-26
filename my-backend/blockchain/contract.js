const path = require("path");
const fs = require("fs");
const { wallet } = require("../config/blockchain");

const abiPath = path.join(
  __dirname,
  "../../../blockchain/artifacts/contracts/KGISLCollegeToken.sol/KGISLCollegeToken.json"
);

const abi = JSON.parse(fs.readFileSync(abiPath)).abi;

const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new wallet.Contract(contractAddress, abi);

module.exports = contract;
