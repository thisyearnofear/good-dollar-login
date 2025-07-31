import React, { createContext, useContext, useState, useCallback } from "react";
import { Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ToastContext and container provider.
 */
const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback(
    (toast) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { ...toast, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, toast.duration || 3500);
    },
    [setToasts]
  );
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Transition
              key={toast.id}
              as={React.Fragment}
              show
              enter="transition-opacity duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`pointer-events-auto px-4 py-3 rounded shadow-lg bg-white border-l-4 ${
                  toast.type === "error"
                    ? "border-red-500 text-red-700"
                    : "border-green-500 text-green-700"
                }`}
              >
                {toast.message}
              </motion.div>
            </Transition>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}