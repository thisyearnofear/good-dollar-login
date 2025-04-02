import React, { useState } from "react";
import {
  LoginButton,
  createLoginLink,
  parseLoginResponse,
} from "@gooddollar/goodlogin-sdk";
import { config } from "../../config";
import "./ModernLogin.css";

const ModernLogin = () => {
  const [gooddollarData, setGooddollarData] = useState({});
  const [activeTab, setActiveTab] = useState("dev");
  const [showTooltip, setShowTooltip] = useState(false);

  const gooddollarLinks = {
    dev: createLoginLink({
      redirectLink: config.dev.redirectLink,
      v: "Google",
      web: config.dev.webUrl,
      id: config.dev.id,
      r: ["mobile", "location", "email", "name"],
      rdu: window.location.href,
    }),
    prod: createLoginLink({
      redirectLink: config.prod.redirectLink,
      v: "Google",
      web: config.prod.webUrl,
      id: config.prod.id,
      r: ["mobile", "location", "email", "name"],
      rdu: window.location.href,
    }),
    staging: createLoginLink({
      redirectLink: config.staging.redirectLink,
      v: "Google",
      web: config.staging.webUrl,
      id: config.staging.id,
      r: ["mobile", "location", "email", "name"],
      rdu: window.location.href,
    }),
  };

  const handleLogin = async (data) => {
    try {
      if (data.error) {
        alert("Login request denied!");
        return;
      }
      const parsedData = await parseLoginResponse(data);
      setGooddollarData(parsedData);
    } catch (e) {
      console.error(e);
      alert("An error occurred during login");
    }
  };

  const EnvironmentInfo = () => (
    <div className={`environment-info ${showTooltip ? "show" : ""}`}>
      <div className="info-content">
        <h3>Environment Information</h3>
        <div className="info-section">
          <h4>Development</h4>
          <p>
            For testing during development. Uses test networks and mock data.
            Perfect for developers to test new features without affecting real
            data.
          </p>
        </div>
        <div className="info-section">
          <h4>Staging</h4>
          <p>
            Pre-production environment for final testing. Similar to production
            but with test data. Used to catch bugs before they reach real users.
          </p>
        </div>
        <div className="info-section">
          <h4>Production</h4>
          <p>
            Live environment with real transactions and data. This is what real
            users interact with. Changes here affect actual user data.
          </p>
        </div>
        <button className="close-info" onClick={() => setShowTooltip(false)}>
          ×
        </button>
      </div>
    </div>
  );

  if (Object.keys(gooddollarData).length > 0) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <img
              src="/good-logo.png"
              alt="GoodDollar Logo"
              className="profile-logo"
            />
            <h2>Welcome, {gooddollarData?.fullName?.value}</h2>
          </div>
          <div className="profile-info">
            <div className="info-group">
              <label>Wallet Address</label>
              <p>{gooddollarData?.walletAddress?.value}</p>
            </div>
            <div className="info-group">
              <label>Email</label>
              <p>{gooddollarData?.email?.value}</p>
            </div>
            <div className="info-group">
              <label>Mobile</label>
              <p>{gooddollarData?.mobile?.value}</p>
            </div>
            <div className="info-group">
              <label>Location</label>
              <p>{gooddollarData?.location?.value}</p>
            </div>
          </div>
          <button
            className="logout-button"
            onClick={() => {
              setGooddollarData({});
              window.location.href = "https://gooddollar.netlify.app";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img
            src="/good-logo.png"
            alt="GoodDollar Logo"
            className="login-logo"
          />
          <h1>GoodDollar</h1>
          <p>Choose your environment to continue</p>
        </div>

        <div className="environment-section">
          <div className="environment-header">
            <span className="info-icon" onClick={() => setShowTooltip(true)}>
              ℹ️
            </span>
          </div>

          <EnvironmentInfo />

          <div className="environment-tabs">
            <button
              className={`tab ${activeTab === "dev" ? "active" : ""}`}
              onClick={() => setActiveTab("dev")}
            >
              Development
            </button>
            <button
              className={`tab ${activeTab === "staging" ? "active" : ""}`}
              onClick={() => setActiveTab("staging")}
            >
              Staging
            </button>
            <button
              className={`tab ${activeTab === "prod" ? "active" : ""}`}
              onClick={() => setActiveTab("prod")}
            >
              Production
            </button>
          </div>
        </div>

        <div className="login-content">
          <LoginButton
            onLoginCallback={handleLogin}
            gooddollarlink={gooddollarLinks[activeTab]}
            rdu="gasdasd"
            className="login-button"
          >
            Login with GoodDollar
          </LoginButton>
        </div>
      </div>
    </div>
  );
};

export default ModernLogin;
