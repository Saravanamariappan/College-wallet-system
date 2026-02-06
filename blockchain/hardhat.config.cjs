require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",

  networks: {
    amoy: {
      url: process.env.RPC_URL,   // Polygon Amoy RPC
      accounts: [process.env.ADMIN_PRIVATE_KEY],
      chainId: 80002
    }
  },

  gasReporter: {
    enabled: true,
  },
};
