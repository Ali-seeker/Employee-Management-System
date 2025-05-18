import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/" />;
  if (roleRequired && role !== roleRequired) return <Navigate to="/profile" />;

  return children;
};

export default ProtectedRoute;
