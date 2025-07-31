import "./App.css";
import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ModernLogin from "./components/ModernLogin/ModernLogin";
import SlideLogin from "./components/SlideLogin/SlideLogin";
import TemplateToggle from "./components/TemplateToggle/TemplateToggle";
import StudioPage from "./pages/StudioPage";
import { useUserContext } from "./contexts/UserContext";

/**
 * Root app component.
 * Shows login or redirects to /studio after login.
 */
function App() {
  const [activeTemplate, setActiveTemplate] = useState("modern");
  const navigate = useNavigate();
  const { goodUser } = useUserContext?.() || {};

  React.useEffect(() => {
    if (goodUser) {
      navigate("/studio");
    }
    // eslint-disable-next-line
  }, [goodUser]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          !goodUser ? (
            <div className="App">
              <TemplateToggle
                activeTemplate={activeTemplate}
                onToggle={() =>
                  setActiveTemplate(activeTemplate === "modern" ? "slide" : "modern")
                }
              />
              {activeTemplate === "modern" ? <ModernLogin /> : <SlideLogin />}
            </div>
          ) : null
        }
      />
      <Route path="/studio" element={<StudioPage />} />
    </Routes>
  );
}

export default App;
