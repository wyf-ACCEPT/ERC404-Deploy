import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    bsc: {
      url: process.env.BNB_RPC,
      accounts: [
        process.env.PRIVATE_KEY_ADMIN!,
      ]
    },
  },
  etherscan: {
    apiKey: {
      bsc: process.env.BSC_SCAN_API!,
    }
  }
};

export default config;
