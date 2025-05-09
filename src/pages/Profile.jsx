import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { API_BASE_URL } from "../CONSTANTS";

const Profile = ({ userId }) => {
  const currentuserId = localStorage.getItem("userId");
  if (!userId) userId = currentuserId;

  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [workedJobs, setWorkedJobs] = useState([]);
  const [viewMode, setViewMode] = useState(null);
  const fileInputRef = useRef();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 600,
      fileType: "image/webp",
    };

    try {
      const compressedFile = await imageCompression(file, options);

      const formData = new FormData();
      formData.append("image", compressedFile);

      await axios.post(
        `${API_BASE_URL}/api/users/${userId}/upload-profile-image`,
        formData
      );
      alert("Profile image uploaded successfully!");
      await fetchProfileImage();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const fetchProfileImage = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/users/${userId}/profile-image`,
        {
          responseType: "arraybuffer",
        }
      );
      console.log("res: ",res);
      const base64Image = btoa(
        new Uint8Array(res.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      const imageUrl = `data:image/webp;base64,${base64Image}`;
      setUser((prevUser) => ({ ...prevUser, profileImage: imageUrl }));
    } catch (err) {
      console.error("Error fetching profile image:", err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/${userId}`);
        const rating = await axios.get(
          `${API_BASE_URL}/api/applications/getrating/${userId}`
        );
        const userData = res.data;
        // console.log("Ratings: ",rating);

        userData.rating = rating.data;
        // Fetch profile image after user data
        // try {
        //   const imgRes = await axios.get(`/api/users/${userId}/profile-image`, {
        //     responseType: "arraybuffer",
        //   });

        //   const base64Image = btoa(
        //     new Uint8Array(imgRes.data).reduce(
        //       (data, byte) => data + String.fromCharCode(byte),
        //       ""
        //     )
        //   );
        //   userData.profileImage = `data:image/webp;base64,${base64Image}`;
        // } catch (imgErr) {
        //   console.warn("No profile image found or error loading it");
        // }

        setUser(userData);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/${userId}/jobs`);
        setJobs(res.data);

        const data = await axios.get(
          `${API_BASE_URL}/api/applications/getjobs/${userId}`
        );
        console.log(data);

        setWorkedJobs(data.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    if (userId) {
      fetchUser();
      fetchJobs();
      fetchProfileImage();
      console.log("user: ",user);
    }
  }, [userId]);

  const calculateAge = (dob) => {
    if (!dob) return "-";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  if (!user)
    return (
      <div className="text-center mt-10 text-gray-600">Loading profile...</div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Profile Card */}
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden">
        <div
          className="relative cursor-pointer md:w-1/3 p-6 bg-indigo-100 flex flex-col items-center justify-center"
          onClick={() => fileInputRef.current.click()}
        >
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-4 border-indigo-500 shadow-md"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
              No Image
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            // capture="environment" // or "user" for front camera
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
          />

          <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
          <p className="text-sm text-gray-600">{user.profession}</p>
        </div>

        {/* User Info */}
        <div className="md:w-2/3 p-6">
          <h3 className="text-lg font-semibold mb-4 text-indigo-600"></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Gender:</strong> {user.gender}{" "}
            </p>
            <p>
              <strong>Age:</strong> {calculateAge(user.dob)} years
            </p>
            <p>
              <strong>Qualification:</strong> {user.qualification || "N/A"}
            </p>
            {/* <p><strong>Experience:</strong> {user.experience || "N/A"}</p> */}
            {user.rating !== 0 ? (
              <p className="text-yellow-600 font-semibold mt-2">
                ⭐ Total Rating: {user.rating} / 5
              </p>
            ) : (
              <p className="text-gray-500 italic mt-2">
                No ratings available yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="col-span-2 mt-4 grid grid-cols-2 gap-4 text-center">
        <div
          className="bg-indigo-50 rounded-lg p-4 shadow-sm cursor-pointer hover:bg-indigo-100"
          onClick={() => setViewMode(viewMode === "posted" ? null : "posted")}
        >
          <p className="text-lg font-bold text-indigo-600">{jobs.length}</p>
          <p className="text-sm text-gray-700">Jobs Posted</p>
        </div>
        <div
          className="bg-green-50 rounded-lg p-4 shadow-sm cursor-pointer hover:bg-green-100"
          onClick={() => setViewMode(viewMode === "worked" ? null : "worked")}
        >
          <p className="text-lg font-bold text-green-600">
            {workedJobs.length}
          </p>
          <p className="text-sm text-gray-700">Jobs Worked</p>
        </div>
      </div>

      {/* Posted or Worked Jobs */}
      {viewMode && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-indigo-600 mb-4">
            {viewMode === "posted" ? "Jobs Posted" : "Jobs Worked"}
          </h3>
          <ul className="grid gap-4">
            {(viewMode === "posted" ? jobs : workedJobs).map((job) => (
              <li
                key={job.jobId}
                className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm"
              >
                <h4 className="font-semibold text-lg">
                  {viewMode === "posted" ? job.title : job.jobEntity.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {viewMode === "posted"
                    ? job.description
                    : job.jobEntity.description}
                </p>
                <div className="flex justify-between mt-2 text-sm">
                  <span>
                    <strong>Location:</strong>{" "}
                    {viewMode === "posted"
                      ? job.location
                      : job.jobEntity.location}
                  </span>
                  <span>
                    <strong>Salary:</strong> ₹
                    {viewMode === "posted" ? job.salary : job.jobEntity.salary}
                  </span>
                  <span>
                    <strong>Type:</strong>{" "}
                    {viewMode === "posted"
                      ? job.jobType
                      : job.jobEntity.jobType}
                  </span>
                  {viewMode !== "posted" && (
                    <span>
                      <strong>Ratings:</strong> {job.rating} ⭐
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Logout Button */}
      {currentuserId === userId && (
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold shadow"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
