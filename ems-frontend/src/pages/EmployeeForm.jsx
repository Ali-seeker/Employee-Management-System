import React, { useEffect, useState } from "react";
import api, { setAuthToken } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

const EmployeeForm = () => {
  const { id } = useParams(); // edit mode if ID exists
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    salary: "",
    joining_date: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);

    if (isEdit) {
      api
        .get(`/employees/${id}`)
        .then((res) => {
          setForm({ ...res.data, password: "" }); // remove password for update
        })
        .catch((err) => {
          console.error("Failed to fetch employee:", err);
          alert("Failed to load employee details.");
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await api.put(`/employees/${id}`, form);
        alert("Employee updated successfully");
      } else {
        await api.post("/employees", form);
        alert("Employee added successfully");
      }
      navigate("/employees");
    } catch (err) {
      console.error("Submit error:", err);
      const errorMsg = err?.response?.data?.message || "Internal Server Error";
      alert("Error: " + errorMsg);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        {isEdit ? "Edit" : "Add"} Employee
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-2 border rounded"
        />
        {!isEdit && (
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-2 border rounded"
          />
        )}
        <input
          name="department"
          value={form.department}
          onChange={handleChange}
          placeholder="Department"
          className="w-full p-2 border rounded"
        />
        <input
          name="designation"
          value={form.designation}
          onChange={handleChange}
          placeholder="Designation"
          className="w-full p-2 border rounded"
        />
        <input
          name="salary"
          type="number"
          value={form.salary}
          onChange={handleChange}
          placeholder="Salary"
          className="w-full p-2 border rounded"
        />
        <input
          name="joining_date"
          type="date"
          value={form.joining_date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button className="bg-blue-600 text-white py-2 px-4 rounded">
          {isEdit ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
