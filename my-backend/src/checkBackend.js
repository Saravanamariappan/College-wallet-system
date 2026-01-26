import { adminContract as contract } from "../services/blockchainService.js";


const run = async () => {
  const backend = await contract.backend();
  console.log("Backend address set in contract:", backend);
};

run();
