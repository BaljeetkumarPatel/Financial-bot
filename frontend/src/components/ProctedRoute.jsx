import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, children }) {
  if (!user) {
    // Redirect to login if user not found
    return <Navigate to="/login" replace />;
  }
  return children;
}
