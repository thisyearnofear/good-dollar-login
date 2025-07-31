import React, { useState } from "react";

/**
 * PalettePicker lets user choose color palette for circles.
 * @param {object} props
 * @param {function} props.onSelect
 */
const palettes = [
  ["#60a5fa", "#f472b6"],
  ["#00C4B3", "#8453E3"],
  ["#FF6C5C", "#FFD166"],
  ["#3F37C9", "#F72585"]
];

const PalettePicker = ({ onSelect }) => {
  const [selected, setSelected] = useState(0);

  const handlePick = (i) => {
    setSelected(i);
    onSelect(palettes[i]);
  };

  return (
    <div className="flex items-center gap-4 mt-4 mb-2">
      <span className="text-xs text-gray-500 mr-2">Palette:</span>
      {palettes.map((pair, i) => (
        <button
          key={i}
          className={`w-12 h-12 flex items-center justify-center rounded-full border-2
            ${i === selected ? "border-brand-turquoise ring-4 ring-brand-turquoise/30" : "border-gray-200"}
            transition-all`}
          style={{ background: `linear-gradient(135deg, ${pair[0]} 60%, ${pair[1]} 100%)` }}
          onClick={() => handlePick(i)}
          aria-label={`Pick palette ${i + 1}`}
          type="button"
        >
          {/* Empty button, color shows palette */}
        </button>
      ))}
    </div>
  );
};

export default PalettePicker;