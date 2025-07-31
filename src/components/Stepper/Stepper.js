import React from "react";
import "./Stepper.css"; // optional if you want to add custom styles

/**
 * Stepper shows progress through steps.
 * @param {object} props
 * @param {string[]} props.steps
 * @param {number} props.currentStep
 */
const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, i) => (
          <div key={step} className="flex-1 flex flex-col items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-lg font-bold
              ${i <= currentStep ? "bg-brand-turquoise" : "bg-gray-300"}
              ${i === currentStep ? "animate-wiggle shadow-lg" : ""}
            `}>
              {i + 1}
            </div>
            <span className={`mt-2 text-xs text-center ${i === currentStep ? "font-semibold text-brand-turquoise" : "text-gray-500"}`}>
              {step}
            </span>
          </div>
        ))}
      </div>
      {/* Progress bar */}
      <div className="relative h-1 w-full bg-gray-200 rounded">
        <div
          className="absolute h-1 bg-brand-turquoise rounded transition-all"
          style={{
            width: `${((currentStep) / (steps.length - 1)) * 100}%`
          }}
        />
      </div>
    </div>
  );
};

export default Stepper;