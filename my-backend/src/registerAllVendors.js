import { db } from "../src/config/db.js";
import { getAddress } from "ethers";
import { registerVendorOnChain } from "../src/services/blockchainService.js";

const run = async () => {
  const [vendors] = await db.query("SELECT wallet_address FROM vendors");

  for (let v of vendors) {
    const wallet = getAddress(v.wallet_address);

    console.log("Registering vendor:", wallet);
    await registerVendorOnChain(wallet);
  }

  console.log("✅ All vendors registered on blockchain");
  process.exit();
};

run();
