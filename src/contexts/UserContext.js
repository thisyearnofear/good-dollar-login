import React, { createContext, useState, useContext, useEffect } from "react";

/**
 * User context shape.
 * @typedef {Object} UserContextValue
 * @property {object|null} goodUser
 * @property {string|null} walletAddress
 * @property {boolean} canvaLinked
 * @property {function} setGoodUser
 * @property {function} setWalletAddress
 * @property {function} setCanvaLinked
 */

const UserContext = createContext(null);

/**
 * Provider for user context.
 * Persists canvaLinked in localStorage.
 * @param {object} props
 * @returns {JSX.Element}
 */
export function UserContextProvider({ children }) {
  const [goodUser, setGoodUser] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [canvaLinked, setCanvaLinkedState] = useState(
    () => JSON.parse(localStorage.getItem("canvaLinked") || "false")
  );

  // Persist canvaLinked in localStorage
  useEffect(() => {
    localStorage.setItem("canvaLinked", JSON.stringify(canvaLinked));
  }, [canvaLinked]);

  const setCanvaLinked = (val) => {
    setCanvaLinkedState(val);
    localStorage.setItem("canvaLinked", JSON.stringify(val));
  };

  return (
    <UserContext.Provider
      value={{
        goodUser,
        walletAddress,
        canvaLinked,
        setGoodUser,
        setWalletAddress,
        setCanvaLinked,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

/**
 * Hook to use user context.
 * @returns {UserContextValue}
 */
export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext must be used within UserContextProvider");
  return ctx;
}