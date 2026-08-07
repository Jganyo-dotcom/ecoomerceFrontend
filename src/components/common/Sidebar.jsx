// src/components/common/Sidebar.jsx
import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/sidebar.css";

const Sidebar = ({ companyName: propCompanyName, tenantId: propTenantId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 📥 READ USER DATA FROM LOCALSTORAGE
  // 📥 READ USER DATA FROM LOCALSTORAGE ON EVERY RENDER
  const storedUser = (() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
      return null;
    }
  })(); // 💡 Adding () here immediately executes the function block cleanly!

  // Use values from localStorage -> props -> defaults
  const companyName = propCompanyName || storedUser?.companyName;
  const tenantId =
    propTenantId || storedUser?.companyRef || storedUser?.company;
  // Desktop collapse state (Hide/Show sidebar content on desktop)
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Mobile drawer state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Mapped directly to your application routes
  const navItems = [
    { id: "overview", label: "Overview", icon: "📊", path: "/manager" },
    { id: "orders", label: "Active Orders", icon: "📦", path: "/orders" },
    {
      id: "served-orders",
      label: "Served Orders",
      icon: "📜",
      path: "/ServedOrders",
    },
    {
      id: "products",
      label: "Product Catalog",
      icon: "🏷️",
      path: "/CatalogPage",
    },
    { id: "stores", label: "Store Branches", icon: "🏪", path: "/StoresPage" },
    {
      id: "settings",
      label: "Company Settings",
      icon: "⚙️",
      path: "/settings",
    },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileOpen(false); // Close mobile drawer when a link is clicked
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* 📱 MOBILE TOP BAR & TOGGLE BUTTON */}
      <div className="mobile-topbar">
        <button
          className="mobile-hamburger-btn"
          onClick={() => setIsMobileOpen(true)}
        >
          ☰ <span className="mobile-menu-text">Menu</span>
        </button>
        <span className="mobile-brand-title">{companyName}</span>
      </div>

      {/* 📱 MOBILE OVERLAY BACKDROP */}
      {isMobileOpen && (
        <div
          className="sidebar-mobile-backdrop"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 📌 MAIN SIDEBAR CONTAINER (STICKY FIXED HEIGHT) */}
      <aside
        className={`app-sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobileOpen ? "mobile-open" : ""
        }`}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* SIDEBAR HEADER */}
        <div className="sidebar-header">
          {!isCollapsed && (
            <div className="sidebar-brand">
              <h2 className="brand-name">{companyName}</h2>
              <span className="tenant-badge">Ref: {tenantId}</span>
            </div>
          )}

          {/* DESKTOP HIDE/COLLAPSE TOGGLE BUTTON */}
          <button
            className="desktop-toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand Sidebar" : "Hide Sidebar"}
          >
            {isCollapsed ? "➔" : "✕"}
          </button>

          {/* MOBILE CLOSE BUTTON */}
          <button
            className="mobile-close-btn"
            onClick={() => setIsMobileOpen(false)}
          >
            &times;
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="sidebar-nav" style={{ flex: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                onClick={() => handleNavClick(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                {!isCollapsed && (
                  <span className="nav-label">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* FOOTER USER / LOGOUT AREA */}
        <div className="sidebar-footer">
          {!isCollapsed && storedUser?.name && (
            <div
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.8rem",
                color: "#64748b",
                borderBottom: "1px solid #f1f5f9",
                marginBottom: "0.5rem",
              }}
            >
              Logged in as: <strong>{storedUser.name}</strong> (
              {storedUser.role})
            </div>
          )}
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
