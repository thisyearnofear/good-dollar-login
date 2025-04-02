import React, { useState } from "react";
import {
  LoginButton,
  createLoginLink,
  parseLoginResponse,
} from "@gooddollar/goodlogin-sdk";
import { config } from "../../config";
import "./SlideLogin.css";

const SlideLogin = () => {
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
      <div className="slide-profile">
        <div
          className="slide-profile-content"
          style={{ backgroundColor: "#3498db" }}
        >
          <img
            src="/good-logo.png"
            alt="GoodDollar Logo"
            className="slide-logo"
          />
          <h2>Welcome, {gooddollarData?.fullName?.value}</h2>
          <div className="profile-details">
            <div className="detail-item">
              <span>Wallet Address</span>
              <p>{gooddollarData?.walletAddress?.value}</p>
            </div>
            <div className="detail-item">
              <span>Email</span>
              <p>{gooddollarData?.email?.value}</p>
            </div>
            <div className="detail-item">
              <span>Mobile</span>
              <p>{gooddollarData?.mobile?.value}</p>
            </div>
            <div className="detail-item">
              <span>Location</span>
              <p>{gooddollarData?.location?.value}</p>
            </div>
          </div>
          <button
            className="slide-logout"
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
    <div className="slide-container">
      <div
        className="slide-environments"
        style={{ backgroundColor: "#3498db" }}
      >
        <div className="environment-content">
          <img
            src="/good-logo.png"
            alt="GoodDollar Logo"
            className="slide-logo"
          />
          <h2>GoodDollar</h2>
          <p>Connect your wallet to continue</p>
          <LoginButton
            onLoginCallback={handleLogin}
            gooddollarlink={gooddollarLink}
            rdu={window.location.origin}
            className="slide-login-button"
          >
            Connect Wallet
          </LoginButton>
        </div>
      </div>
    </div>
  );
};

export default SlideLogin;
