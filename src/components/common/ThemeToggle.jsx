// src/components/common/ThemeToggle.jsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-switch"
      onClick={toggleTheme}
      aria-label="Toggle light or dark theme"
    >
      <span className={`switch-pill ${theme}`}>
        <span className="switch-icon sun">☀️</span>
        <span className="switch-icon moon">🌙</span>
        <span className="switch-thumb" />
      </span>
    </button>
  );
};

export default ThemeToggle;
