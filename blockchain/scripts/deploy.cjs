const hre = require("hardhat");

async function main() {
  const { ethers } = hre;

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const StudentWallet = await ethers.getContractFactory("StudentWallet");
  const contract = await StudentWallet.deploy();

  await contract.deployed();


  console.log("StudentWallet deployed at:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
