import React from "react";
import { useDiagram } from "../../contexts/DiagramContext";
import PalettePicker from "../../components/PalettePicker/PalettePicker";
import VennDiagram from "../../components/VennDiagram/VennDiagram";
import { Dialog } from "@headlessui/react";

/**
 * StyleStep: select palette, preview diagram.
 */
const StyleStep = () => {
  const { state, send } = useDiagram();
  const { topicA, topicB, intersection, colors } = state.context;
  const [showSheet, setShowSheet] = React.useState(false);

  const handleSelect = (colors) => {
    send({ type: "SET_FIELD", key: "colors", value: colors });
  };

  const handleNext = () => send("NEXT");
  const handlePrev = () => send("PREV");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Make it yours!</h2>
      <div className="mb-4">
        <button
          className="sm:hidden bg-brand-turquoise text-white px-4 py-1 rounded mb-2"
          onClick={() => setShowSheet(true)}
        >
          Palette
        </button>
        <div className="hidden sm:block">
          <PalettePicker onSelect={handleSelect} />
        </div>
        <Dialog open={showSheet} onClose={() => setShowSheet(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-lg p-4">
            <PalettePicker
              onSelect={(c) => {
                handleSelect(c);
                setShowSheet(false);
              }}
            />
            <button className="mt-2 text-sm text-gray-500" onClick={() => setShowSheet(false)}>
              Close
            </button>
          </div>
        </Dialog>
      </div>
      <VennDiagram
        topicA={topicA}
        topicB={topicB}
        intersection={intersection}
        circleColors={colors}
      />
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
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StyleStep;