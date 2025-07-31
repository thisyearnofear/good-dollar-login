import React, { createContext, useContext } from "react";
import { useMachine } from "@xstate/react";
import { studioMachine } from "../machines/studioMachine";

/**
 * Diagram context for state machine.
 */
const DiagramContext = createContext(null);

export function DiagramProvider({ children }) {
  const [state, send] = useMachine(studioMachine);
  return (
    <DiagramContext.Provider value={{ state, send }}>
      {children}
    </DiagramContext.Provider>
  );
}

export function useDiagram() {
  const ctx = useContext(DiagramContext);
  if (!ctx) throw new Error("useDiagram must be used within DiagramProvider");
  return ctx;
}