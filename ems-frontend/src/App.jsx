import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EmployeeList from "./pages/EmployeeList.jsx";
import EmployeeForm from "./pages/EmployeeForm.jsx";
import EmployeeProfile from "./pages/EmployeeProfile.jsx";
import Register from "./pages/Register";

// Route Guard
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roleRequired="admin">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <ProtectedRoute roleRequired="admin">
            <EmployeeList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees/add"
        element={
          <ProtectedRoute roleRequired="admin">
            <EmployeeForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees/edit/:id"
        element={
          <ProtectedRoute roleRequired="admin">
            <EmployeeForm />
          </ProtectedRoute>
        }
      />

      {/* Authenticated Route for All Roles */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <EmployeeProfile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
