/**
 * Deploy VennNFT contract to Fuse.
 * Usage: npx hardhat run scripts/deploy.js --network fuse
 */
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const name = "VennNFT";
  const symbol = "VENN";
  const goodDollar = process.env.GOOD_DOLLAR_ADDRESS;
  const goodDAOWallet = process.env.GOOD_DAO_WALLET;
  const royaltyFeeBps = 250; // 2.5%

  if (!goodDollar || !goodDAOWallet) {
    throw new Error("Set GOOD_DOLLAR_ADDRESS and GOOD_DAO_WALLET in .env");
  }

  const VennNFT = await ethers.getContractFactory("VennNFT");
  const contract = await VennNFT.deploy(
    name,
    symbol,
    goodDollar,
    goodDAOWallet,
    royaltyFeeBps
  );

  await contract.deployed();

  console.log("VennNFT deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});