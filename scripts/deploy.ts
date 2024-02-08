import { ethers, upgrades } from "hardhat"
import "dotenv/config"

async function main() {
  const admin = new ethers.Wallet(process.env.PRIVATE_KEY_ADMIN!)
  const tokenName = "Pandora"

  const pandora = await ethers.deployContract(tokenName)

  console.log(`\x1b[0m${tokenName} deployed to:\x1b[32m ${await pandora.getAddress()}`)
  console.log(`\x1b[0mThe admin address is:\x1b[32m ${admin.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });