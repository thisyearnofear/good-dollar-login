export const config = {
  dev: {
    redirectLink: "http://gooddev.netlify.app/AppNavigation/LoginRedirect",
    webUrl: "https://gooddollar.netlify.app",
    id: "0x09D2011Ca5781CA70810F6d82837648132762F9a",
    callbackUrl: "http://localhost:3000/callback",
  },
  prod: {
    redirectLink: "http://wallet.gooddollar.org/AppNavigation/LoginRedirect",
    webUrl: "https://gooddollar.netlify.app",
    id: "0x7abcaB0f7d818B869FE4782631dFA9142e9830eE",
    callbackUrl: "http://localhost:3000/callback",
  },
  staging: {
    redirectLink: "http://goodqa.netlify.app/AppNavigation/LoginRedirect",
    webUrl: "https://gooddollar.netlify.app",
    id: "0x7abcaB0f7d818B869FE4782631dFA9142e9830eE",
    callbackUrl: "http://localhost:3000/callback",
  },
};
