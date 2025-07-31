import "./App.css";
import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ModernLogin from "./components/ModernLogin/ModernLogin";
import SlideLogin from "./components/SlideLogin/SlideLogin";
import TemplateToggle from "./components/TemplateToggle/TemplateToggle";
import OAuthRedirect from "./pages/OAuthRedirect";
import { useUserContext } from "./contexts/UserContext";
import StudioWizardPage from "./pages/StudioWizard";
import { ToastProvider } from "./components/ui/ToastContainer";

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
    <ToastProvider>
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
            ) : (
              <StudioWizardPage />
            )
          }
        />
        <Route path="/studio" element={<StudioWizardPage />} />
        <Route path="/oauth/redirect" element={<OAuthRedirect />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
