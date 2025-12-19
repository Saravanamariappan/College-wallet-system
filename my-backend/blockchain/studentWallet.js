import { ethers } from "ethers";
import ABI from "../../blockchain/artifacts/contracts/Lock.sol/StudentWallet.json" assert { type: "json" };

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

export const studentWalletContract = new ethers.Contract(
  contractAddress,
  ABI.abi,
  provider
);
