import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { API_BASE_URL } from "../CONSTANTS";

const MessagesPage = () => {
  const [users, setUsers] = useState([]);
  const userId = parseInt(localStorage.getItem("userId"));
  const navigate = useNavigate();
  const stompClient = useRef(null);

  const handleApplicationsClick = () => {
    navigate("/applications");
  };

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  useEffect(() => {
    const socket = new SockJS("https://springboot-skillslyde.onrender.com/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("WebSocket connected");

        client.subscribe(`/topic/messages/${userId}`, async (message) => {
          const receivedMessage = JSON.parse(message.body);
          const senderId = receivedMessage.senderId;

          const alreadyExists = users.some((user) => user.userId === senderId);
          if (!alreadyExists) {
            try {
              const res = await axios.get(`https://springboot-skillslyde.onrender.com/api/users/${senderId}`);
              const fullUser = res.data;
              setUsers((prevUsers) => [...prevUsers, fullUser]);
            } catch (err) {
              console.error("Failed to fetch user details for new sender", err);
            }
          }
        });
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected");
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [userId, users]); // Include `users` to get latest list when checking for duplicates

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/messages/${userId}`);
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch chat users", err);
      }
    };

    fetchUsers();
  }, [userId]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-indigo-700">Your Chats</h2>
        <div className="flex gap-2">
          <button
            onClick={handleNotificationClick}
            className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
            title="Notifications"
          >
            🔔
          </button>
          <button
            onClick={handleApplicationsClick}
            className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700"
            title="Applications"
          >
            📄
          </button>
        </div>
      </div>

      {/* Chat List with Profile Images */}
      <div className="bg-white rounded-lg shadow-md">
        {users.length === 0 ? (
          <p className="p-4 text-gray-500">No chats available</p>
        ) : (
          users.map((user) => (
            <div
              key={user.userId}
              onClick={() => navigate(`/chat/${user.userId}`)}
              className="flex items-center p-4 border-b hover:bg-indigo-50 cursor-pointer"
            >
              <img
{/*                 src={`/api/users/${user.userId}/profile-image`} */}
              src={`${API_BASE_URL}/api/users/${user.userId}/profile-image`}
                alt={`${user.name}'s profile`}
                className="w-10 h-10 rounded-full object-cover border mr-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-profile.jpg"; // Place this image in /public folder
                }}
              />
              <span className="text-gray-800 font-medium">{user.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
