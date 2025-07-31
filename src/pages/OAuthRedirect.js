import React, { useEffect } from "react";

/**
 * OAuthRedirect page: just waits for backend to complete and postMessage to opener.
 */
const OAuthRedirect = () => {
  useEffect(() => {
    // Nothing: backend will handle postMessage
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl mt-8 font-bold">Completing Canva auth…</h2>
      <p className="text-gray-500 mt-2">You may close this tab if not redirected automatically.</p>
    </div>
  );
};

export default OAuthRedirect;