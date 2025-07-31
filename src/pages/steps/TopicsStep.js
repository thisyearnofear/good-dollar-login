import React, { useState } from "react";
import { useDiagram } from "../../contexts/DiagramContext";

/**
 * TopicsStep: input two topics, NEXT if filled.
 */
const TopicsStep = () => {
  const { state, send } = useDiagram();
  const [localA, setA] = useState(state.context.topicA);
  const [localB, setB] = useState(state.context.topicB);

  const handleNext = () => {
    send({ type: "SET_FIELD", key: "topicA", value: localA });
    send({ type: "SET_FIELD", key: "topicB", value: localB });
    send("NEXT");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">What two worlds do you want to compare?</h2>
      <div className="flex flex-col gap-4 mb-6">
        <input
          className="input input-bordered p-3 border rounded text-lg"
          placeholder="Topic A"
          value={localA}
          onChange={e => setA(e.target.value)}
        />
        <input
          className="input input-bordered p-3 border rounded text-lg"
          placeholder="Topic B"
          value={localB}
          onChange={e => setB(e.target.value)}
        />
      </div>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition w-full"
        onClick={handleNext}
        disabled={!localA.trim() || !localB.trim()}
      >
        Next
      </button>
    </div>
  );
};

export default TopicsStep;