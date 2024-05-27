
require("@nomiclabs/hardhat-waffle");

const API_URL =
  "https://eth-sepolia.g.alchemy.com/v2/r2QSBD2l6RBIJvw89Fit-sany_tVHQGP";
const PRIVATE_KEY =
  "3162ecdc20d711e35717bfe6d12abb5ba2ab7286e84cfac7c67bcf7ed95a1735";

module.exports = {
  solidity: "0.8.4",
  networks: {
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
