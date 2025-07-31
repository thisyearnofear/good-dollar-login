/**
 * storageService.js
 * Pins buffers/files to IPFS using web3.storage.
 */
import { Web3Storage, File } from "web3.storage";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.WEB3_STORAGE_TOKEN;
const client = new Web3Storage({ token });

/**
 * Pin a buffer to IPFS with a filename.
 * @param {Buffer} buffer
 * @param {string} fileName
 * @returns {Promise<{cid: string, url: string}>}
 */
export async function pinBuffer(buffer, fileName) {
  const file = new File([buffer], fileName);
  const cid = await client.put([file], { wrapWithDirectory: false });
  return {
    cid,
    url: `https://ipfs.io/ipfs/${cid}/${fileName}`,
  };
}