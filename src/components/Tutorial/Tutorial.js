import React, { useState } from "react";
import "./Tutorial.css";

const steps = [
  {
    title: "GoodDollar",
    content:
      "Explore different ways to implement GoodDollar authentication in your applications.",
    position: "center",
  },
  {
    title: "Switch Styles",
    content:
      "Toggle between 👼🏿 and 💵  styles to find the perfect fit for your app.",
    position: "top",
  },
  {
    title: "Choose Environment",
    content:
      "Select between Development, Staging, and Production environments.",
    position: "bottom",
  },
];

const Tutorial = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsVisible(false);
      onComplete();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`tutorial-overlay ${steps[currentStep].position}`}>
      <div className="tutorial-content">
        <h3>{steps[currentStep].title}</h3>
        <p>{steps[currentStep].content}</p>
        <div className="tutorial-actions">
          <div className="tutorial-dots">
            {steps.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentStep ? "active" : ""}`}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>
          <button onClick={handleNext}>
            {currentStep === steps.length - 1 ? "Get Started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
