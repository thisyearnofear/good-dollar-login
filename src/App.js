import "./App.css";
import React, { useState } from "react";
import ModernLogin from "./components/ModernLogin/ModernLogin";
import SlideLogin from "./components/SlideLogin/SlideLogin";
import TemplateToggle from "./components/TemplateToggle/TemplateToggle";

function App() {
  const [activeTemplate, setActiveTemplate] = useState("modern");

  const toggleTemplate = () => {
    setActiveTemplate(activeTemplate === "modern" ? "slide" : "modern");
  };

  const ActiveTemplateComponent =
    activeTemplate === "modern" ? ModernLogin : SlideLogin;

  return (
    <div className="App">
      <TemplateToggle
        activeTemplate={activeTemplate}
        onToggle={toggleTemplate}
      />
      <ActiveTemplateComponent />
    </div>
  );
}

export default App;
