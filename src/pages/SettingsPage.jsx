import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../CONSTANTS";

const SettingsPage = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [user, setUser] = useState({
    qualification: "",
    profession: "",
    mobileNo: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/users/${userId}`, user);
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-6 text-indigo-600">Edit Profile</h2>

      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          name="qualification"
          value={user.qualification}
          onChange={handleChange}
          placeholder="Qualification"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="profession"
          value={user.profession}
          onChange={handleChange}
          placeholder="Profession"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="mobileNo"
          value={user.mobileNo}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="address"
          value={user.address}
          onChange={handleChange}
          placeholder="Address"
          rows="3"
          className="w-full p-2 border rounded"
        />
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Update Profile
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            type="button"
            className="text-red-500 hover:text-red-700"
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
