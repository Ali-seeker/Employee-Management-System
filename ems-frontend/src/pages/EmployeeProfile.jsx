import React, { useEffect, useState } from "react";
import api, { setAuthToken } from "../services/api";
import Navbar from "../components/Navbar";

const EmployeeProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);

    api
      .get("/user") // Custom endpoint to get logged-in user info
      .then((res) => {
        setProfile({ ...res.data, password: "" });
      })
      .catch(() => alert("Failed to fetch profile"));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put("/user/update", profile);
      alert("Profile updated!");
    } catch {
      alert("Failed to update");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">My Profile</h2>
        <form onSubmit={handleUpdate} className="space-y-3">
          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
          <input
            type="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
            placeholder="New Password"
            className="w-full p-2 border rounded"
          />
          <button className="bg-blue-600 text-white py-2 px-4 rounded">
            Update
          </button>
        </form>
      </div>
    </>
  );
};

export default EmployeeProfile;
