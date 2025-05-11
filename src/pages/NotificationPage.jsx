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
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white shadow rounded mt-4 relative">
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-indigo-700">Notifications</h2>
  
      {notifications.length === 0 ? (
        <p className="text-sm text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification, index) => (
            <li
              key={index}
              className="p-4 border rounded bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center w-full sm:w-auto">
                {/* Profile Image */}
                <img
                  src={`data:image/jpeg;base64,${notification.profileimage}`}
                  alt={notification.userName}
                  className="w-12 h-12 rounded-full object-cover "
                />
                <div className="ml-4 text-sm">
                  <h3 className="font-semibold text-base">{notification.userName}</h3>
                  <p className="text-gray-600">{notification.title}</p>
                  <p className="text-xs text-gray-400">{notification.description}</p>
                </div>
              </div>
  
              {/* Accept and Reject Buttons */}
              <div className="flex gap-2 w-full sm:w-auto justify-end sm:justify-start">
                <button
                  disabled={buttonClicked}
                  onClick={() =>
                    handleAccept(
                      notification.applicationId,
                      notification.userId,
                      notification.jobId
                    )
                  }
                  className="flex-1 sm:flex-none px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  disabled={buttonClicked}
                  onClick={() =>
                    handleReject(
                      notification.applicationId,
                      notification.userId
                    )
                  }
                  className="flex-1 sm:flex-none px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl h-[90vh] relative shadow-lg flex flex-col overflow-hidden">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ❌
            </button>
  
            <div className="overflow-y-auto p-4 pt-10">
              <Profile userId={selectedUserId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default NotificationPage;
