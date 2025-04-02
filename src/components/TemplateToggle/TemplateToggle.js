import React from "react";
import "./TemplateToggle.css";

const TemplateToggle = ({ activeTemplate, onToggle }) => {
  return (
    <div className="template-toggle-container">
      <div className="template-toggle">
        <button
          className={`toggle-option ${
            activeTemplate === "slide" ? "active" : ""
          }`}
          onClick={() => onToggle("slide")}
        >
          <span className="emoji">👼🏿</span>
        </button>
        <button
          className={`toggle-option ${
            activeTemplate === "modern" ? "active" : ""
          }`}
          onClick={() => onToggle("modern")}
        >
          <span className="emoji">💵</span>
        </button>
      </div>
    </div>
  );
};

export default TemplateToggle;
