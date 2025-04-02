import React, { useState, useRef } from "react";
import {
  LoginButton,
  createLoginLink,
  parseLoginResponse,
} from "@gooddollar/goodlogin-sdk";
import { config } from "../../config";
import "./SlideLogin.css";

const environments = {
  dev: {
    name: "Development",
    color: "#3498db",
    redirectLink: config.dev.redirectLink,
    id: config.dev.id,
  },
  staging: {
    name: "Staging",
    color: "#e67e22",
    redirectLink: config.staging.redirectLink,
    id: config.staging.id,
  },
  prod: {
    name: "Production",
    color: "#2ecc71",
    redirectLink: config.prod.redirectLink,
    id: config.prod.id,
  },
};

const SlideLogin = () => {
  const [activeEnv, setActiveEnv] = useState("dev");
  const [gooddollarData, setGooddollarData] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef(null);

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

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Snap to closest environment
    const scrollPosition = sliderRef.current.scrollLeft;
    const envWidth = sliderRef.current.offsetWidth;
    const envIndex = Math.round(scrollPosition / envWidth);
    const envKeys = Object.keys(environments);
    setActiveEnv(envKeys[envIndex]);
    sliderRef.current.scrollTo({
      left: envIndex * envWidth,
      behavior: "smooth",
    });
  };

  const createEnvLink = (env) => {
    return createLoginLink({
      redirectLink: config[env].redirectLink,
      v: "Google",
      web: config[env].webUrl,
      id: config[env].id,
      r: ["mobile", "location", "email", "name"],
      rdu: window.location.href,
    });
  };

  if (Object.keys(gooddollarData).length > 0) {
    return (
      <div className="slide-profile">
        <div
          className="slide-profile-content"
          style={{ backgroundColor: environments[activeEnv].color }}
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
    <div className="slide-container">
      <div
        className="slide-environments"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {Object.entries(environments).map(([key, env]) => (
          <div
            key={key}
            className={`slide-environment ${activeEnv === key ? "active" : ""}`}
            style={{ backgroundColor: env.color }}
          >
            <div className="environment-content">
              <img
                src="/good-logo.png"
                alt="GoodDollar Logo"
                className="slide-logo"
              />
              <h2>{env.name}</h2>
              <p>Login to GoodDollar {env.name} Environment</p>
              <LoginButton
                onLoginCallback={handleLogin}
                gooddollarlink={createEnvLink(key)}
                rdu="gasdasd"
                className="slide-login-button"
              >
                Connect Wallet
              </LoginButton>
            </div>
          </div>
        ))}
      </div>
      <div className="slide-indicators">
        {Object.keys(environments).map((key) => (
          <button
            key={key}
            className={`slide-indicator ${activeEnv === key ? "active" : ""}`}
            style={{ backgroundColor: environments[key].color }}
            onClick={() => {
              setActiveEnv(key);
              sliderRef.current.scrollTo({
                left:
                  Object.keys(environments).indexOf(key) *
                  sliderRef.current.offsetWidth,
                behavior: "smooth",
              });
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SlideLogin;
