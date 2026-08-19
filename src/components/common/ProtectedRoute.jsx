// src/components/common/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { SimpleAuthContext } from "../../context/AuthContext"; // 🔌 Connects to the empty outlet file

const ProtectedRoute = () => {
  // Pulls the verified answer directly out of App.jsx
  const { isAuthenticated } = useContext(SimpleAuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
