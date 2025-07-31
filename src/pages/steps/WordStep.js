import React, { useState } from "react";
import { useDiagram } from "../../contexts/DiagramContext";
import SkeletonBox from "../../components/SkeletonBox";
import axios from "axios";

/**
 * WordStep: fetch intersection suggestions, radio select, update context.
 */
const WordStep = () => {
  const { state, send } = useDiagram();
  const { topicA, topicB, intersection } = state.context;
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [err, setErr] = useState("");

  React.useEffect(() => {
    // Fetch only if not fetched before
    if (!topicA || !topicB) return;
    if (suggestions.length > 0) return;
    setLoading(true);
    setErr("");
    axios
      .post("/api/ai/suggest", { topics: [topicA, topicB] })
      .then(({ data }) => setSuggestions(data.suggestions || []))
      .catch((e) =>
        setErr(e.response?.data?.error || "Failed to fetch suggestions.")
      )
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [topicA, topicB]);

  const handleSelect = (sugg) => {
    send({ type: "SET_FIELD", key: "intersection", value: sugg });
  };

  const handleNext = () => send("NEXT");
  const handlePrev = () => send("PREV");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">
        What's the overlap?
      </h2>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      {loading ? (
        <div className="mb-4 flex flex-col gap-2">
          <SkeletonBox className="h-8 w-full" />
          <SkeletonBox className="h-8 w-4/5" />
        </div>
      ) : (
        <div className="mb-4 flex flex-col gap-2">
          {suggestions.map((sugg) => (
            <label
              key={sugg}
              className={`flex items-center gap-2 transition-transform ${
                intersection === sugg ? "scale-105 animate-wiggle shadow-md" : ""
              }`}
            >
              <input
                type="radio"
                name="suggestion"
                value={sugg}
                checked={intersection === sugg}
                onChange={() => handleSelect(sugg)}
                className="accent-blue-600"
              />
              <span>{sugg}</span>
            </label>
          ))}
        </div>
      )}
      <div className="flex gap-2 mt-4">
        <button
          className="bg-gray-300 px-6 py-2 rounded font-semibold hover:bg-gray-400 transition"
          onClick={handlePrev}
        >
          Back
        </button>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition flex-1"
          onClick={handleNext}
          disabled={!intersection}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WordStep;