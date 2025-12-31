import { createStudentWallet } from "../services/walletService.js";
import { registerVendorOnChain } from "../services/blockchainService.js";

export const createVendor = async (req, res) => {
  try {
    // 1. Create vendor wallet
    const wallet = createStudentWallet(); // same function

    // 2. Register vendor on blockchain
    const txHash = await registerVendorOnChain(wallet.address);

    res.json({
      message: "Vendor wallet created & registered",
      vendorAddress: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic,
      blockchainTx: txHash
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
