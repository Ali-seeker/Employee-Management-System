import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setAuthToken(null);
      navigate("/");
    } catch {
      alert("Logout failed");
    }
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <div className="space-x-4">
        {/* ✅ Show these only to Admin */}
        {role === "admin" && (
          <>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/employees" className="hover:underline">
              Employees
            </Link>
          </>
        )}

        {/* ✅ Visible to all logged-in users */}
        <Link to="/profile" className="hover:underline">
          Profile
        </Link>
      </div>

      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
