import { adminContract as contract } from "../services/blockchainService.js";


async function check() {
  console.log("Contract address:", contract.target);

  try {
    const name = await contract.name();
    const symbol = await contract.symbol();

    console.log("Token Name:", name);
    console.log("Token Symbol:", symbol);
  } catch (err) {
    console.error("❌ Contract call failed:", err.message);
  }
}

check();
