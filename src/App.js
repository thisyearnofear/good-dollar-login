import "./App.css";
import React, { useState } from "react";
import { templates, defaultTemplate } from "./templates";
import TemplateToggle from "./components/TemplateToggle/TemplateToggle";
import Tutorial from "./components/Tutorial/Tutorial";

function App() {
  const [activeTemplate, setActiveTemplate] = useState(defaultTemplate);
  const [showTutorial, setShowTutorial] = useState(true);

  const ActiveTemplateComponent = templates[activeTemplate].component;

  const handleToggle = () => {
    setActiveTemplate(activeTemplate === "slide" ? "modern" : "slide");
  };

  return (
    <div className="App">
      <TemplateToggle activeTemplate={activeTemplate} onToggle={handleToggle} />

      <ActiveTemplateComponent />

      {showTutorial && <Tutorial onComplete={() => setShowTutorial(false)} />}
    </div>
  );
}

export default App;
