import React from "react";
import "./TemplateSelector.css";

const TemplateSelector = ({ templates, activeTemplate, onSelect, onClose }) => {
  return (
    <div className="template-selector">
      <div className="template-selector-header">
        <h2>Choose a Login Template</h2>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="templates-grid">
        {Object.entries(templates).map(([key, template]) => (
          <div
            key={key}
            className={`template-card ${
              activeTemplate === key ? "active" : ""
            }`}
            onClick={() => onSelect(key)}
          >
            <div className="template-preview">
              <img src={template.preview} alt={`${template.name} preview`} />
            </div>
            <div className="template-info">
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <div className="template-features">
                {template.features?.map((feature, index) => (
                  <span key={index} className="feature-tag">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
