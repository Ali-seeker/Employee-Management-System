import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>
        <Link to="/employees" className="text-blue-600 underline">
          View All Employees
        </Link>
      </div>
    </>
  );
};

export default Dashboard;
