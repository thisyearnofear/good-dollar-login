import "./App.css";
import { useState } from "react";
import {
  LoginButton,
  createLoginLink,
  parseLoginResponse,
} from "@gooddollar/goodlogin-sdk";

function App() {
  const gooddollarLinkDev = createLoginLink({
    redirectLink: "http://gooddev.netlify.app/AppNavigation/LoginRedirect",
    v: "Google",
    web: 'https://gooddollar.netlify.app/',
    id: "0x09D2011Ca5781CA70810F6d82837648132762F9a",
    r: ["mobile", "location", "email", "name"],
    rdu: window.location.href,
  });
  const gooddollarLinkProd = createLoginLink({
    redirectLink: "http://wallet.gooddollar.org/AppNavigation/LoginRedirect",
    v: "Google",
    web: "https://gooddollar.netlify.app",
    id: "0x7abcaB0f7d818B869FE4782631dFA9142e9830eE",
    r: ["mobile", "location", "email", "name"],
    rdu: window.location.href,
  });
  const gooddollarLinkStaging = createLoginLink({
    redirectLink: "http://goodqa.netlify.app/AppNavigation/LoginRedirect",
    v: "Google",
    web: "https://gooddollar.netlify.app",
    id: "0x7abcaB0f7d818B869FE4782631dFA9142e9830eE",
    r: ["mobile", "location", "email", "name"],
    rdu: window.location.href,
  });

  const [gooddollarData, setGooddollarData] = useState({});

  return (
    <div className="App">
      <header className="App-header">
        <img
          style={{ width: 200, height: 50, objectFit: "contain" }}
          src="https://sp-ao.shortpixel.ai/client/to_auto,q_glossy,ret_img/https://www.gooddollar.org/wp-content/uploads/2020/05/logo.png"
          className="App-logo"
          alt="logo"
        />
        {Object.keys(gooddollarData).length === 0 ? (
          <>
            <p>An App To Test the loggin with G$ functionality.</p>
            <LoginButton
              onLoginCallback={async (data) => {
                console.log(data)
                try {
                  if (data.error) return alert("Login request denied !");
                  parseLoginResponse(data).then((d) => {
                    setGooddollarData(d)
                  })
                } catch (e) {
                  console.log(e);
                }
              }}
              gooddollarlink={gooddollarLinkDev}
              style={{ fontSize: 20, padding: 20, marginBottom: 10 }}
              rdu="gasdasd"
            >
              Loggin With GOODDOLLAR(DEV)
            </LoginButton>
            <LoginButton
              gooddollarlink={gooddollarLinkProd}
              style={{ fontSize: 20, padding: 20, marginBottom: 10 }}
              rdu="gasdasd"
              onLoginCallback={() => { }}
            >
              Loggin With GOODDOLLAR(PROD)
            </LoginButton>
            <LoginButton
              gooddollarlink={gooddollarLinkStaging}
              style={{ fontSize: 20, padding: 20 }}
              rdu="gasdasd"
              onLoginCallback={() => { }}
            >
              Loggin With GOODDOLLAR(STAGING)
            </LoginButton>
          </>
        ) : (
          <div>
            <p>Logged In</p>
            <p>Name : {gooddollarData.fullName.value}</p>
            <p>Wallet Address : {gooddollarData.walletAddress.value}</p>
            <p>Mobile Number : {gooddollarData.mobile.value}</p>
            <p>Location : {gooddollarData?.location?.value}</p>
            <p>Email : {gooddollarData.email.value}</p>
            <button
              onClick={() => {
                setGooddollarData({});
                window.location.href = "https://gooddollar.netlify.app";
              }}
              style={{ fontSize: 20, padding: 20 }}
            >
              Logout
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
