import React, { useState, useRef } from "react";
import { useDiagram } from "../../contexts/DiagramContext";
import { useUserContext } from "../../contexts/UserContext";
import VennDiagram from "../../components/VennDiagram/VennDiagram";
import { useToast } from "../../components/ui/ToastContainer";
import axios from "axios";

/**
 * PublishStep: upload to Canva, export & pin, on success set cid and NEXT.
 */
const PublishStep = () => {
  const { state, send } = useDiagram();
  const { walletAddress, canvaLinked, setCanvaLinked } = useUserContext();
  const { topicA, topicB, intersection, colors } = state.context;
  const [designId, setDesignId] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [pinnedUrl, setPinnedUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const svgRef = useRef();
  const { addToast } = useToast();

  const handleLinkCanva = () => {
    addToast({ message: "Canva linking not implemented here.", type: "error" });
  };

  const handleUploadCanva = async () => {
    if (!canvaLinked || !walletAddress) {
      addToast({ message: "Connect Canva and wallet.", type: "error" });
      return;
    }
    setUploading(true);
    try {
      const svg = svgRef.current.getSVG();
      const fileName = `venn-${Date.now()}.svg`;
      const { data } = await axios.post("/api/canva/upload", {
        svg, fileName, wallet: walletAddress
      });
      setDesignId(data.designId);
      setEditUrl(data.editUrl);
      if (data.editUrl) window.open(data.editUrl, "_blank");
      addToast({ message: "Uploaded to Canva!", type: "success" });
    } catch (e) {
      addToast({ message: e.response?.data?.error || "Upload failed.", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleExportPin = async () => {
    if (!designId || !walletAddress) {
      addToast({ message: "Upload to Canva first.", type: "error" });
      return;
    }
    setExporting(true);
    try {
      const { data } = await axios.get(`/api/canva/export/${designId}`, {
        params: { wallet: walletAddress }
      });
      setPinnedUrl(data.url);
      send({ type: "SET_FIELD", key: "cid", value: (data.cid || "") });
      addToast({ message: "Exported & pinned to IPFS!", type: "success" });
      send("NEXT");
    } catch (e) {
      addToast({ message: e.response?.data?.error || "Export/pin failed.", type: "error" });
    } finally {
      setExporting(false);
    }
  };

  const handlePrev = () => send("PREV");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Publish your Venn</h2>
      <VennDiagram
        ref={svgRef}
        topicA={topicA}
        topicB={topicB}
        intersection={intersection}
        circleColors={colors}
      />
      <div className="mb-2 text-center">
        {canvaLinked ? (
          <span className="inline-flex items-center gap-1 text-green-700 font-medium">
            Canva linked <span aria-label="linked">✅</span>
          </span>
        ) : (
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded font-semibold mt-2"
            onClick={handleLinkCanva}
          >
            Link Canva
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2 mb-2">
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded font-semibold hover:bg-indigo-700 transition disabled:opacity-50 w-full"
          onClick={handleUploadCanva}
          disabled={uploading || !canvaLinked}
        >
          {uploading ? "Uploading..." : "Upload to Canva"}
        </button>
        {editUrl && (
          <a
            href={editUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline text-sm text-center"
          >
            Open in Canva Editor
          </a>
        )}
        {designId && (
          <button
            className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 transition disabled:opacity-50 w-full"
            onClick={handleExportPin}
            disabled={exporting}
          >
            {exporting ? "Exporting..." : "Export & Pin"}
          </button>
        )}
        {pinnedUrl && (
          <a
            href={pinnedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 underline text-sm text-center"
          >
            View Pinned (IPFS)
          </a>
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

export default PublishStep;