require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    amoy: {
      url: process.env.RPC_URL,              // Polygon Amoy RPC
      accounts: [process.env.ADMIN_PRIVATE_KEY],
    },
  },
};

require("hardhat-gas-reporter");

module.exports = {
  solidity: "0.8.20",
  gasReporter: {
    enabled: true,
  },
};