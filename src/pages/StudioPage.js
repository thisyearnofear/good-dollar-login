import React, { useState, useRef } from "react";
import axios from "axios";
import VennDiagram from "../components/VennDiagram/VennDiagram";
import { useUserContext } from "../contexts/UserContext";
import { generateCodeVerifier, codeChallenge } from "../utils/pkce";

/**
 * Venn Studio main UI page with Canva and IPFS integration.
 */
const StudioPage = () => {
  const [topicA, setTopicA] = useState("");
  const [topicB, setTopicB] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showDiagram, setShowDiagram] = useState(false);

  // Canva + export state
  const [designId, setDesignId] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [pinnedUrl, setPinnedUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { walletAddress, canvaLinked, setCanvaLinked } = useUserContext();
  const svgRef = useRef();

  const handleGetSuggestions = async () => {
    setErr("");
    setSuggestions([]);
    setSelected("");
    setShowDiagram(false);
    setDesignId("");
    setEditUrl("");
    setPinnedUrl("");
    if (!topicA.trim() || !topicB.trim()) {
      setErr("Please enter both topics.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post("/api/ai/suggest", {
        topics: [topicA, topicB]
      });
      setSuggestions(data.suggestions || []);
    } catch (e) {
      setErr(e.response?.data?.error || "Failed to fetch suggestions.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    if (selected) {
      setShowDiagram(true);
      setDesignId("");
      setEditUrl("");
      setPinnedUrl("");
    }
  };

  // Canva OAuth logic
  const handleLinkCanva = async () => {
    if (!walletAddress) {
      setErr("Please connect GoodDollar wallet first.");
      return;
    }
    setErr("");
    // PKCE
    const codeVerifier = generateCodeVerifier();
    const state = window.crypto.randomUUID?.() || Math.random().toString(36).slice(2);
    sessionStorage.setItem(`pkce_code_verifier_${state}`, codeVerifier);
    sessionStorage.setItem(`canva_wallet_${state}`, walletAddress);

    // Get authUrl from backend
    try {
      const { data } = await axios.get("/oauth/login", {
        params: { wallet: walletAddress }
      });
      const authUrl = data.authUrl + "&state=" + state;
      const popup = window.open(authUrl, "_blank", "width=500,height=700");
      // Listen for message
      const listener = (event) => {
        if (event.data?.canvaLinked) {
          setCanvaLinked(true);
          popup && popup.close();
          window.removeEventListener("message", listener);
        }
      };
      window.addEventListener("message", listener);
    } catch (e) {
      setErr("Failed to initiate Canva OAuth");
    }
  };

  // Upload Venn SVG to Canva
  const handleUploadCanva = async () => {
    if (!canvaLinked || !walletAddress || !svgRef.current) {
      setErr("Connect Canva and generate a diagram first.");
      return;
    }
    setErr("");
    setUploading(true);
    setEditUrl("");
    setDesignId("");
    setPinnedUrl("");
    try {
      const svg = svgRef.current.getSVG();
      const fileName = `venn-${Date.now()}.svg`;
      const { data } = await axios.post("/api/canva/upload", {
        svg,
        fileName,
        wallet: walletAddress,
      });
      setDesignId(data.designId);
      setEditUrl(data.editUrl);
      if (data.editUrl) window.open(data.editUrl, "_blank");
    } catch (e) {
      setErr(e.response?.data?.error || "Failed to upload to Canva.");
    } finally {
      setUploading(false);
    }
  };

  // Export Canva design and pin to IPFS
  const handleExportPin = async () => {
    if (!designId || !walletAddress) {
      setErr("You must upload to Canva and have a designId.");
      return;
    }
    setErr("");
    setExporting(true);
    setPinnedUrl("");
    try {
      const { data } = await axios.get(`/api/canva/export/${designId}`, {
        params: { wallet: walletAddress }
      });
      setPinnedUrl(data.url);
    } catch (e) {
      setErr(e.response?.data?.error || "Failed to export/pin image.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center">G$ Venn Studio</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          className="input input-bordered flex-1 p-2 border rounded text-lg"
          placeholder="Topic A"
          value={topicA}
          onChange={(e) => setTopicA(e.target.value)}
        />
        <input
          className="input input-bordered flex-1 p-2 border rounded text-lg"
          placeholder="Topic B"
          value={topicB}
          onChange={(e) => setTopicB(e.target.value)}
        />
      </div>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50 w-full mb-4"
        onClick={handleGetSuggestions}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Get Suggestions"}
      </button>
      {err && <div className="text-red-600 mb-2">{err}</div>}

      {suggestions.length > 0 && (
        <div className="mb-4">
          <div className="font-semibold mb-2">AI Suggestions:</div>
          <div className="flex flex-col gap-2">
            {suggestions.map((sugg, idx) => (
              <label key={sugg} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="suggestion"
                  value={sugg}
                  checked={selected === sugg}
                  onChange={() => setSelected(sugg)}
                  className="accent-blue-600"
                />
                <span>{sugg}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        className="bg-pink-500 text-white px-6 py-2 rounded font-semibold hover:bg-pink-600 transition disabled:opacity-50 w-full mb-4"
        onClick={handleGenerate}
        disabled={!selected}
      >
        Generate Diagram
      </button>

      {showDiagram && (
        <>
          <VennDiagram
            ref={svgRef}
            topicA={topicA}
            topicB={topicB}
            intersection={selected}
          />
          {canvaLinked && (
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded font-semibold hover:bg-indigo-700 transition disabled:opacity-50 w-full mb-2"
              onClick={handleUploadCanva}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload to Canva"}
            </button>
          )}
          {editUrl && (
            <div className="mb-2 text-center">
              <a href={editUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
                Open in Canva Editor
              </a>
            </div>
          )}
          {designId && (
            <button
              className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 transition disabled:opacity-50 w-full mb-2"
              onClick={handleExportPin}
              disabled={exporting}
            >
              {exporting ? "Exporting..." : "Export & Pin"}
            </button>
          )}
          {pinnedUrl && (
            <div className="mb-2 text-center">
              <a href={pinnedUrl} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">
                View Pinned Image (IPFS)
              </a>
              <div className="mt-2">
                <img src={pinnedUrl} alt="Exported Venn" className="mx-auto max-h-48 border" />
              </div>
              {/* Mint NFT Button */}
              {walletAddress && (
                <MintNFTSection walletAddress={walletAddress} pinnedUrl={pinnedUrl} />
              )}
            </div>
          )}
        </>
      )}

      <button
        className={`px-6 py-2 rounded font-semibold w-full mt-4 transition flex items-center justify-center gap-2 ${
          canvaLinked
            ? "bg-green-500 text-white opacity-100"
            : "bg-gray-400 text-white opacity-80"
        }`}
        onClick={handleLinkCanva}
        disabled={canvaLinked}
      >
        {canvaLinked ? (
          <>
            <span>Canva linked</span>
            <span role="img" aria-label="linked">
              ✅
            </span>
          </>
        ) : (
          "Link Canva"
        )}
      </button>
    </div>
  );
};

// Mint NFT button and status display
import React, { useState } from "react";
import axios from "axios";

function MintNFTSection({ walletAddress, pinnedUrl }) {
  const [minting, setMinting] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [mintErr, setMintErr] = useState("");

  // Extract CID from pinnedUrl for minting
  const getCid = () => {
    try {
      const match = pinnedUrl.match(/ipfs\/([^\/]+)\//);
      return match ? match[1] : "";
    } catch {
      return "";
    }
  };

  const handleMint = async () => {
    setMinting(true);
    setMintErr("");
    setTxHash("");
    try {
      const cid = getCid();
      const { data } = await axios.post("/api/nft/mint", {
        wallet: walletAddress,
        cid,
      });
      setTxHash(data.txHash);
    } catch (e) {
      setMintErr(e.response?.data?.error || "Mint failed.");
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        className="bg-yellow-600 text-white px-6 py-2 rounded font-semibold hover:bg-yellow-700 transition disabled:opacity-50 w-full"
        onClick={handleMint}
        disabled={minting}
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
      {mintErr && <div className="text-red-600 mt-1">{mintErr}</div>}
    </div>
  );
}

export default StudioPage;