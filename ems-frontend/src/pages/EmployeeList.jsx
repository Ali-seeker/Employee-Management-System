import React, { useEffect, useState } from "react";
import api, { setAuthToken } from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  const fetchEmployees = () => {
    api
      .get("/employees")
      .then((res) => setEmployees(res.data))
      .catch(() => alert("Failed to fetch employees"));
  };

  const deleteEmployee = (id) => {
    if (!window.confirm("Are you sure?")) return;
    api
      .delete(`/employees/${id}`)
      .then(() => {
        alert("Deleted successfully");
        fetchEmployees();
      })
      .catch(() => alert("Failed to delete employee"));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
    fetchEmployees();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Employees</h2>
          <button
            onClick={() => navigate("/employees/add")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Employee
          </button>
        </div>
        <table className="min-w-full border text-left">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Department</th>
              <th className="border px-4 py-2">Designation</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td className="border px-4 py-2">{emp.name}</td>
                <td className="border px-4 py-2">{emp.email}</td>
                <td className="border px-4 py-2">{emp.department}</td>
                <td className="border px-4 py-2">{emp.designation}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => navigate(`/employees/edit/${emp.id}`)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteEmployee(emp.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EmployeeList;
