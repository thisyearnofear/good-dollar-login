import React from "react";
import { DiagramProvider, useDiagram } from "../contexts/DiagramContext";
import Stepper from "../components/Stepper/Stepper";
import TopicsStep from "./steps/TopicsStep";
import WordStep from "./steps/WordStep";
import StyleStep from "./steps/StyleStep";
import PublishStep from "./steps/PublishStep";
import MintStep from "./steps/MintStep";
import { AnimatePresence, motion } from "framer-motion";

const steps = ["topics", "word", "style", "publish", "mint"];
const stepLabels = ["Topics", "Word", "Style", "Publish", "Mint"];

const stepComponents = {
  topics: TopicsStep,
  word: WordStep,
  style: StyleStep,
  publish: PublishStep,
  mint: MintStep
};

/**
 * StudioWizard orchestrates the state machine steps.
 */
function StepContent({ current }) {
  const { state } = useDiagram();
  const Step = stepComponents[state.value];
  // Each step exports a static .stepKey property for AnimatePresence
  const key = Step.stepKey || state.value;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={key}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Step />
      </motion.div>
    </AnimatePresence>
  );
}

import { useDiagram } from "../contexts/DiagramContext";
import { DiagramProvider } from "../contexts/DiagramContext";

const StudioWizard = () => {
  const { state } = useDiagram();
  const currentIdx = steps.indexOf(state.value);
  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
      <Stepper steps={stepLabels} currentStep={currentIdx} />
      <StepContent current={state.value} />
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

// Attach stepKey to each step for animation
TopicsStep.stepKey = "topics";
WordStep.stepKey = "word";
StyleStep.stepKey = "style";
PublishStep.stepKey = "publish";
MintStep.stepKey = "mint";