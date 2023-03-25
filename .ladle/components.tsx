import type { GlobalProvider } from "@ladle/react";
import React, { useEffect } from "react";
import "tailwindcss/tailwind.css";
import "../src/styles/globals.css";

// Inspired by https://dev.to/sdorra/dark-mode-with-ladle-and-tailwindcss-19j9
export const Provider: GlobalProvider = ({ children, globalState }) => {
  useEffect(() => {
    if (globalState.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [globalState.theme]);
  return <div className="p-4">{children}</div>;
};
