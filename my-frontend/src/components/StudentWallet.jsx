import { ethers } from "ethers";
import ABI from "../../blockchain/artifacts/contracts/Lock.sol/StudentWallet.json";

function StudentWallet() {

  const connectWallet = async () => {
    // MetaMask check
    if (!window.ethereum) {
      alert("MetaMask install pannunga");
      return;
    }

    // MetaMask connect
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Contract connect
    const contract = new ethers.Contract(
      "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
      ABI.abi,
      signer
    );

    // Example: balance read
    const balance = await contract.getBalance();
    alert(`Wallet Balance: ${balance}`);
  };

  return (
    <div>
      <h2>Student Wallet</h2>
      <button onClick={connectWallet}>Connect Wallet</button>
    </div>
  );
}

export default StudentWallet;
