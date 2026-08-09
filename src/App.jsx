// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Toast Notifications
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ⚠️ Required for toast styles & slide animation

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OwnerDashboard from "./pages/OwnerDashboard";
import StoresPage from "./pages/StoresPage";
import OrdersPage from "./pages/OrdersPage";
import SettingsPage from "./pages/SettingsPage";
import ServedOrdersPage from "./pages/ServedOrdersPage";

import "./App.css";
import CatalogPage from "./pages/catalogProductCard";

function App() {
  return (
    <ThemeProvider>
      <Router>
        {/* 🔔 Toast Notifications Container (Slides down from Top-Right) */}
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
          {/* 🌐 PUBLIC ROUTES (Accessible by anyone) */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/CatalogPage" element={<CatalogPage />} />

          {/* 🛡️ PROTECTED ROUTES (Requires JWT token in localStorage) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/manager" element={<OwnerDashboard />} />
            <Route path="/StoresPage" element={<StoresPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/ServedOrders" element={<ServedOrdersPage />} />
          </Route>

          {/* 404 Fallback - Redirect unknown URLs back to Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
