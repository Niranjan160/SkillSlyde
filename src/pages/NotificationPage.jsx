// src/pages/NotificationPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Profile from "./Profile"; // 👈 Import your Profile component
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../CONSTANTS";

const NotificationPage = () => {
  const userId = localStorage.getItem("userId");
  const [notifications, setNotifications] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null); // for modal open
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/applications/noti/${userId}`
        );
        setNotifications(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [userId]);

  useEffect(() => {
    const markAsRead = async () => {
      try {
        await fetch(`${API_BASE_URL}/api/applications/mark-as-read/${userId}`, {
          method: "PUT",
        });
      } catch (err) {
        console.error("Error marking applications as read", err);
      }
    };
  
    markAsRead();
  }, []);

  
  const handleAccept = async (applicationId, applicantId,jobId) => {
    const payload = {
      applicationId,
      applicantId,
      userId,
    };
    try {
      setButtonClicked(true)
      await axios.post(
        `${API_BASE_URL}/api/applications/accept`,
        payload
      );
      setNotifications((prev) =>
        prev.filter((noti) => noti.jobId !== jobId)
      );
      setButtonClicked(false)
    } catch (error) {
      console.error("Accept failed:", error);
    }
  };

  const handleReject = async (applicationId,applicantId) => {
    const payload = {
      applicationId,
      applicantId,
      userId,
    };
    try {
      setButtonClicked(true)
      await axios.post(
        `${API_BASE_URL}/api/applications/reject`,payload
      );
      setNotifications((prev) =>
        prev.filter((noti) => noti.applicationId !== applicationId)
      );
      setButtonClicked(false)
    } catch (error) {
      console.error("Reject failed:", error);
    }
  };

  const handleProfileClick = (userId) => {
    setSelectedUserId(userId);
  };

  const handleCloseModal = () => {
    setSelectedUserId(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-6 relative">
      <h2 className="text-xl font-bold mb-4 text-indigo-700">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification, index) => (
            <li
              key={index}
              className="p-4 border rounded bg-gray-50 flex items-center justify-between"
            >
              <div className="flex items-center">
                {/* Profile Image */}
                <img
                  src={`data:image/jpeg;base64,${notification.profileimage}`}
                  alt={notification.userName}
                  className="w-12 h-12 rounded-full object-cover cursor-pointer"
                  onClick={() => handleProfileClick(notification.userId)}
                />
                <div className="ml-4">
                  <h3 className="font-semibold">{notification.userName}</h3>
                  <p className="text-sm text-gray-600">{notification.title}</p>
                  <p className="text-xs text-gray-400">
                    {notification.description}
                  </p>
                </div>
              </div>

              {/* Accept and Reject Buttons */}
              <div className="flex space-x-2">
                <button disabled = {buttonClicked}
                  onClick={() =>
                    handleAccept(
                      notification.applicationId,
                      notification.userId,
                      notification.jobId
                    )
                  }
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 "
                >
                  Accept
                </button>
                <button
                disabled = {buttonClicked}
                  onClick={() =>
                    handleReject(
                      notification.applicationId,
                      notification.userId
                    )
                  }
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Profile Modal */}
{selectedUserId && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg w-[90%] max-w-2xl h-[80vh] relative shadow-lg flex flex-col overflow-hidden">
      
      {/* Close Button */}
      <button
        onClick={handleCloseModal}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
      >
        ❌
      </button>

      {/* Scrollable Content */}
      <div className="overflow-y-auto p-6 pt-10">
        {/* Profile Component */}
        <Profile userId={selectedUserId} />
      </div>

    </div>
  </div>
)}


    
    </div>
  );
};

export default NotificationPage;
