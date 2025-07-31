require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    fuse: {
      url: process.env.FUSE_RPC || "https://rpc.fuse.io",
      accounts: [process.env.FUSE_PRIVATE_KEY].filter(Boolean),
    },
  },
};