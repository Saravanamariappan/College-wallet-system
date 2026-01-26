import { Wallet } from "ethers";

/* ==================================================
   COMMON WALLET CREATOR
   (Student / Vendor / Admin)
================================================== */
export function createWallet() {
  const wallet = Wallet.createRandom();

  return {
    address: wallet.address,
    privateKey: wallet.privateKey
  };
}
