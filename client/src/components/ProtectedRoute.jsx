import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Protects routes that require authentication.
 * Redirects to /login if no token is present.
 * Uses replace to prevent back-button navigation to protected pages.
 */
const ProtectedRoute = () => {
  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
