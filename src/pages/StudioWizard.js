import React from "react";
import { DiagramProvider, useDiagram } from "../contexts/DiagramContext";
import Stepper from "../components/Stepper/Stepper";
import TopicsStep from "./steps/TopicsStep";
import WordStep from "./steps/WordStep";
import StyleStep from "./steps/StyleStep";
import PublishStep from "./steps/PublishStep";
import MintStep from "./steps/MintStep";

const steps = ["topics", "word", "style", "publish", "mint"];
const stepLabels = ["Topics", "Word", "Style", "Publish", "Mint"];

/**
 * StudioWizard orchestrates the state machine steps.
 */
function StepContent() {
  const { state } = useDiagram();
  switch (state.value) {
    case "topics":
      return <TopicsStep />;
    case "word":
      return <WordStep />;
    case "style":
      return <StyleStep />;
    case "publish":
      return <PublishStep />;
    case "mint":
      return <MintStep />;
    default:
      return null;
  }
}

const StudioWizard = () => {
  const { state } = useDiagram();
  const currentIdx = steps.indexOf(state.value);
  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
      <Stepper steps={stepLabels} currentStep={currentIdx} />
      <StepContent />
    </div>
  );
};

export default function StudioWizardPage() {
  return (
    <DiagramProvider>
      <StudioWizard />
    </DiagramProvider>
  );
}