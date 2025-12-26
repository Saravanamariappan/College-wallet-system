const hre = require("hardhat");

async function main() {
  const [admin, backend] = await hre.ethers.getSigners();

  console.log("Admin:", admin.address);
  console.log("Backend:", backend.address);

  const Token = await hre.ethers.getContractFactory("KGISLCollegeToken");

  // ✅ PASS BACKEND ADDRESS
  const token = await Token.deploy(backend.address);

  await token.deployed();

  console.log("KGISLCollegeToken deployed to:", token.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
