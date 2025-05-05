import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddressAutoComplete from "../components/AddressAutoComplete"; // 👈 imported
import { API_BASE_URL } from "../CONSTANTS";

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNo: "",
    dob: "",
    qualification: "",
    profession: "",
    experience: "",
    gender: "",
    area: "",
    city: "",
    state: "",
    country: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isOver18 = (dateString) => {
    const dob = new Date(dateString);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    return age > 18 || (age === 18 && m >= 0);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isOver18(user.dob)) {
      setMessage("❌ You must be at least 18 years old.");
      setIsError(true);
      return;
    }

    if (user.password !== user.confirmPassword) {
      setMessage("❌ Passwords do not match!");
      setIsError(true);
      return;
    }

    const fullAddress = `${user.area}, ${user.city}, ${user.state}, ${user.country}`;
    const payload = {
      ...user,
      address: fullAddress,
    };

    try {
      await axios.post(`${API_BASE_URL}/api/users/register`, payload);
      setMessage("✅ Registered successfully! Redirecting...");
      setIsError(false);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration failed:", err);
      setMessage("❌ Error during registration.");
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-5xl flex flex-col md:flex-row overflow-hidden">
        {/* Left - Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Create Account</h2>

          {/* Error Message */}
          {message && (
            <p className={`text-center text-sm mt-4 ${isError ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          )}

          <form onSubmit={handleRegister} className="grid grid-cols-1 gap-6">
            {/* Basic Fields with Labels */}
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className="input"
              onChange={handleChange}
              required
            />

            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="input"
              onChange={handleChange}
              required
            />

            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              type="text"
              name="mobileNo"
              placeholder="Enter your mobile number"
              className="input"
              onChange={handleChange}
              required
            />

            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dob"
              className="input"
              onChange={handleChange}
              required
            />

            <label className="block text-sm font-medium text-gray-700">Qualification (Optional)</label>
            <input
              type="text"
              name="qualification"
              placeholder="Enter your qualification"
              className="input"
              onChange={handleChange}
            />

            <label className="block text-sm font-medium text-gray-700">Profession</label>
            <input
              type="text"
              name="profession"
              placeholder="Enter your profession"
              className="input"
              onChange={handleChange}
              required
            />

            <label className="block text-sm font-medium text-gray-700">Experience (Optional)</label>
            <input
              type="text"
              name="experience"
              placeholder="Enter your experience"
              className="input"
              onChange={handleChange}
            />

            {/* Gender Dropdown */}
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              className="input"
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            {/* Address AutoComplete */}
            <div className="col-span-2 grid grid-cols-2 gap-4">
  <input
    type="text"
    name="area"
    value={user.area}
    placeholder="Area"
    className="input"
    onChange={handleChange} // Allow manual editing
  />
  <input
    type="text"
    name="city"
    value={user.city}
    placeholder="City"
    className="input"
    onChange={handleChange} // Allow manual editing
  />
  <input
    type="text"
    name="state"
    value={user.state}
    placeholder="State"
    className="input"
    onChange={handleChange} // Allow manual editing
  />
  <input
    type="text"
    name="country"
    value={user.country}
    placeholder="Country"
    className="input"
    onChange={handleChange} // Allow manual editing
  />
</div>
            {/* Password Fields */}
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="input"
              onChange={handleChange}
              required
            />

            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              className="input"
              onChange={handleChange}
              required
            />

            {/* Submit Button */}
            <div className="col-span-2 mt-4">
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
              >
                Register
              </button>
            </div>
          </form>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 font-semibold hover:underline">
              Login
            </a>
          </p>
        </div>

        {/* Right - Info Section */}
        <div className="w-full md:w-1/2 bg-indigo-600 text-white p-8 flex flex-col justify-center items-center">
          <h3 className="text-2xl text-center font-bold mb-2">Welcome to SkillSyde<br />Job Portal</h3>
        </div>
      </div>
    </div>
  );
};

export default Register;
