import React, { useState } from "react";
import axios from "axios";
import VennDiagram from "../components/VennDiagram/VennDiagram";
import { useUserContext } from "../contexts/UserContext";
import { generateCodeVerifier, codeChallenge } from "../utils/pkce";

/**
 * Venn Studio main UI page.
 */
const StudioPage = () => {
  const [topicA, setTopicA] = useState("");
  const [topicB, setTopicB] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showDiagram, setShowDiagram] = useState(false);
  const { walletAddress, canvaLinked, setCanvaLinked } = useUserContext();

  const handleGetSuggestions = async () => {
    setErr("");
    setSuggestions([]);
    setSelected("");
    setShowDiagram(false);
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
    if (selected) setShowDiagram(true);
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
        <VennDiagram topicA={topicA} topicB={topicB} intersection={selected} />
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

export default StudioPage;