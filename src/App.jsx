// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

// 🔌 WE PLUG IN OUR OUTLET SEPARATELY HERE TO AVOID INF LOOPS:
import { SimpleAuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Toast Notifications
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OwnerDashboard from "./pages/OwnerDashboard";
import StoresPage from "./pages/StoresPage";
import OrdersPage from "./pages/OrdersPage";
import SettingsPage from "./pages/SettingsPage";
import ServedOrdersPage from "./pages/ServedOrdersPage";
import CatalogPage from "./pages/catalogProductCard";
import AboutPage from "./pages/AboutPage";
import ResetPassword from "./pages/ResetPassword";
import "./App.css";
import { baseApi } from "./components/common/apiEndpoint";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  // 🛡️ YOUR SAFEGUARD TOKEN LOADER LIVES HERE:
  useEffect(() => {
    const verifyUserToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setIsVerifying(false);
        return;
      }

      try {
        const response = await fetch(`${baseApi}/api/admin/verify`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("token"); // Wipe bad token
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth verify error:", error);
        setIsAuthenticated(false);
      } finally {
        setTimeout(() => {
          setIsVerifying(false);
        }, 800); // Keeps modal smooth
      }
    };

    verifyUserToken();
  }, []);

  // 🌟 YOUR PRETTY LOADING MODAL LIVES HERE:
  if (isVerifying) {
    return (
      <div className="pretty-loader-overlay">
        <div className="pretty-loader-modal">
          <div className="pretty-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-core"></div>
          </div>
          <h2>Securing Connection</h2>
          <p>Verifying credentials with CloudPlaza servers...</p>
          <div className="loader-progress-bar">
            <div className="loader-progress-fill"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      {/* ⚡ We pass our live state down through the outlet here */}
      <SimpleAuthContext.Provider
        value={{ isAuthenticated, setIsAuthenticated }}
      >
        <Router>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Slide}
          />

          <Routes>
            {/* 🌐 PUBLIC ROUTES (If logged in, bounce them to /manager instantly) */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/manager" replace />
                ) : (
                  <LandingPage />
                )
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/manager" replace /> : <Login />
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate to="/manager" replace />
                ) : (
                  <Register />
                )
              }
            />

            <Route path="/CatalogPage" element={<CatalogPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/forgetPassword" element={<ResetPassword />} />
            {/* 🛡️ PROTECTED ROUTES */}
            <Route element={<ProtectedRoute />}>
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/manager" element={<OwnerDashboard />} />
              <Route path="/StoresPage" element={<StoresPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/ServedOrders" element={<ServedOrdersPage />} />
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SimpleAuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
