import React, { useImperativeHandle, useRef } from "react";
import * as d3 from "d3";
import "./VennDiagram.css";

/**
 * Simple Venn diagram with two SVG circles and an intersection label.
 * Exposes getSVG() via ref (outerHTML of SVG).
 * @param {object} props
 * @param {string} topicA
 * @param {string} topicB
 * @param {string} intersection
 * @param {object} ref
 */
const VennDiagram = React.forwardRef(({ topicA, topicB, intersection }, ref) => {
  // Basic layout constants
  const width = 320, height = 180, r = 70;
  const cxA = 110, cxB = 210, cy = 90;
  const svgRef = useRef();

  useImperativeHandle(ref, () => ({
    /**
     * Returns outerHTML of SVG diagram.
     * @returns {string}
     */
    getSVG: () => svgRef.current?.outerHTML ?? "",
  }));

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="mx-auto my-4"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <circle cx={cxA} cy={cy} r={r} fill="#60a5fa" fillOpacity="0.5" />
        <circle cx={cxB} cy={cy} r={r} fill="#f472b6" fillOpacity="0.5" />
        {/* Topic labels */}
        <text x={cxA - 40} y={cy - 55} fontSize="1.25rem" className="fill-blue-700 font-bold">
          {topicA}
        </text>
        <text x={cxB + 22} y={cy - 55} fontSize="1.25rem" className="fill-pink-700 font-bold">
          {topicB}
        </text>
        {/* Intersection word in the middle overlap */}
        <text
          x={(cxA + cxB) / 2}
          y={cy}
          textAnchor="middle"
          fontSize="2rem"
          className="fill-gray-800 font-semibold"
        >
          {intersection}
        </text>
      </g>
    </svg>
  );
});

export default VennDiagram;