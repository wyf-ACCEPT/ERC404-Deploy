# Deploy Your Own ERC404

This project consists of a set of Solidity smart contracts for creating a mixed `ERC20`/`ERC721` token standard called `ERC404` and a concrete implementation of this standard named Pandora. Additionally, it includes a deployment script written in TypeScript and an environment configuration file.

## Contracts

### ERC404.sol

`ERC404.sol` defines the ERC404 abstract contract, which serves as a gas-efficient, mixed ERC20/ERC721 implementation with native liquidity and fractionalization. It includes features such as token transfers, approvals, and metadata handling. 

### Pandora.sol

`Pandora.sol` is a concrete implementation of the ERC404 standard, and it's the first one. It extends `ERC404.sol` and adds additional functionalities specific to the Pandora token. Notable features include:

- **Custom Token Metadata**: Implements `tokenURI` function to generate custom token metadata based on token IDs.
- **Data URI and Base Token URI**: Allows setting data URI and base token URI for generating token metadata.

If you want to create your own ERC404 token, you can use `ERC404.sol` as a base and extend it with your own functionalities. For here, you can use `Pandora.sol` as an example.

## Deployment Script

### deploy.ts

`deploy.ts` is a TypeScript deployment script used to deploy the Pandora contract onto the EVM blockchain. It utilizes Hardhat for EVM chain development and interacts with the EVM chain using ethers.js. 

## Environment Variables

### .env.example

`.env.example` is a template file for configuring environment variables required for deployment and interaction with the EVM chains. You should copy the file to `.env` and fill in the required values before running the deployment script, including:

- **PRIVATE_KEY_ADMIN**: Private key of the admin wallet used for deployment and contract management.
- **ADDRESS_ADMIN**: Ethereum address corresponding to the admin wallet.
- **BSC_SCAN_API**: API key for BscScan, if needed for contract verification or other purposes.
- **BNB_RPC**: RPC endpoint for interacting with the BNB Chain (BSC) network.

## Usage

1. **Environment Configuration**: Copy `.env.example` to `.env` and fill in the required values for environment variables.

2. **Deployment**: Run the deployment script `deploy.ts` to deploy the Pandora contract to the Ethereum blockchain:

```bash
yarn
npx hardhat run ./scripts/deploy.ts --network bsc
```

1. **Upload your code**: After deployment, you can upload your code to the BscScan for verification. You can use the following command to do that:

```bash
npx hardhat verify --network bsc "<DEPLOYED_CONTRACT_ADDRESS>"
```
