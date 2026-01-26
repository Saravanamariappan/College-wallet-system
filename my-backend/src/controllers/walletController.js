// src/controllers/walletController.js

import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

export const getWalletBalance = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    // Validate wallet address
    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      return res.status(400).json({ error: "Invalid wallet address" });
    }

    // Connect RPC
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

    // Token Contract ABI (minimum required)
    const tokenABI = [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)"
    ];

    // Connect contract
    const token = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      tokenABI,
      provider
    );

    // Read balance
    const balance = await token.balanceOf(walletAddress);
    const decimals = await token.decimals();

    res.json({
      wallet: walletAddress,
      raw_balance: balance.toString(),
      formatted_balance: Number(balance) / 10 ** decimals
    });

  } catch (err) {
    console.error("Wallet balance error:", err);
    res.status(500).json({ error: "Failed to fetch wallet balance" });
  }
};
