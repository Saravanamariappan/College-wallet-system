const hre = require("hardhat");

async function main() {
  const [admin] = await hre.ethers.getSigners();

  console.log("Admin:", admin.address);

  // 🔥🔥🔥 FIX IS HERE 🔥🔥🔥
  // This MUST be the SAME address as BACKEND_PRIVATE_KEY
  const BACKEND_ADDRESS = "0x19E03ce8E49c2F25Cec8133E765d855261Bade8a";

  const Token = await hre.ethers.getContractFactory("KGISLCollegeToken");

  // 🔹 backend address passed to constructor
  const token = await Token.deploy(BACKEND_ADDRESS);

  // ethers v5
  await token.deployed();

  console.log("Contract deployed at:", token.address);
  console.log("Backend set in contract:", BACKEND_ADDRESS);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
