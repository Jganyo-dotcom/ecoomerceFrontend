import React from "react";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="nav-header">
      <div className="nav-brand" onClick={() => (window.location.href = "/")}>
        OmniStore<span>HQ</span>
      </div>

      <div className="nav-right">
        <button
          className="nav-link"
          onClick={() => (window.location.href = "/catalog")}
        >
          Catalog
        </button>
        <button
          className="nav-link"
          onClick={() => (window.location.href = "/login")}
        >
          Sign In
        </button>
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
