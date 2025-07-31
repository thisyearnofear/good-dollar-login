import React, { useState } from "react";
import { useDiagram } from "../../contexts/DiagramContext";
import { useUserContext } from "../../contexts/UserContext";
import { useToast } from "../../components/ui/ToastContainer";
import axios from "axios";

/**
 * MintStep: mint NFT using backend, show tx hash with explorer link, toast on success/error.
 */
const MintStep = () => {
  const { state, send } = useDiagram();
  const { walletAddress } = useUserContext();
  const { cid } = state.context;
  const [minting, setMinting] = useState(false);
  const [txHash, setTxHash] = useState("");
  const { addToast } = useToast();

  const handleMint = async () => {
    setMinting(true);
    setTxHash("");
    try {
      const { data } = await axios.post("/api/nft/mint", {
        wallet: walletAddress,
        cid,
      });
      setTxHash(data.txHash);
      send({ type: "SET_FIELD", key: "txHash", value: data.txHash });
      addToast({ message: "NFT minted!", type: "success" });
    } catch (e) {
      addToast({ message: e.response?.data?.error || "Mint failed.", type: "error" });
    } finally {
      setMinting(false);
    }
  };

  const handlePrev = () => send("PREV");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Mint your Venn NFT</h2>
      <div className="mb-4">
        <button
          className="bg-yellow-600 text-white px-6 py-2 rounded font-semibold hover:bg-yellow-700 transition disabled:opacity-50 w-full"
          onClick={handleMint}
          disabled={minting || !cid || !walletAddress}
        >
          {minting ? "Minting..." : "Mint NFT (10 G$)"}
        </button>
        {txHash && (
          <div className="mt-2 text-center">
            <a
              href={`https://explorer.fuse.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-700 underline"
            >
              View on Fuse Explorer
            </a>
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-4">
        <button
          className="bg-gray-300 px-6 py-2 rounded font-semibold hover:bg-gray-400 transition"
          onClick={handlePrev}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default MintStep;