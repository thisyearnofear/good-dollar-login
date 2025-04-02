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

  const gooddollarLink = createLoginLink({
    redirectLink: config.prod.redirectLink,
    v: "Google",
    web: config.prod.webUrl,
    id: config.prod.id,
    r: ["mobile", "location", "email", "name"],
    rdu: window.location.origin,
  });

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
              window.location.href = config.prod.webUrl;
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
          <p>Connect your wallet to continue</p>
        </div>

        <div className="login-content">
          <LoginButton
            onLoginCallback={handleLogin}
            gooddollarlink={gooddollarLink}
            rdu={window.location.origin}
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
