/**
 * nftService.js
 * Mint Venn diagram NFT on Fuse.
 */
import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const FUSE_RPC = process.env.FUSE_RPC || "https://rpc.fuse.io";
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.FUSE_PRIVATE_KEY;

// Read ABI
const abiPath = path.join(process.cwd(), "contracts", "VennNFT.json");
const abi = JSON.parse(fs.readFileSync(abiPath, "utf8")).abi;

const provider = new ethers.JsonRpcProvider(FUSE_RPC);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, abi, signer);

/**
 * Mint NFT for given wallet and CID.
 * @param {object} opts
 * @param {string} opts.to - wallet address
 * @param {string} opts.cid - IPFS CID
 * @returns {Promise<{txHash:string}>}
 */
export async function mintNFT({ to, cid }) {
  const tokenURI = `ipfs://${cid}`;
  const tx = await contract.mint(to, tokenURI, { gasLimit: 500000 });
  await tx.wait();
  return { txHash: tx.hash };
}