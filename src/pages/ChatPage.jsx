import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { Camera } from "lucide-react";
import { API_BASE_URL } from "../CONSTANTS";
const ChatPage = () => {
  const { userId: receiverId } = useParams();
  const senderId = localStorage.getItem("userId");
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [receiver, setReceiver] = useState(null);

  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Connect to WebSocket
  useEffect(() => {
    const socket = new SockJS(`${API_BASE_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("WebSocket connected");

        client.subscribe(`/topic/messages/${senderId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);

          // Check if the message belongs to this conversation
          const relevant =
            (receivedMessage.senderId === parseInt(senderId) &&
              receivedMessage.receiverId === parseInt(receiverId)) ||
            (receivedMessage.senderId === parseInt(receiverId) &&
              receivedMessage.receiverId === parseInt(senderId));

          if (relevant) {
            setMessages((prev) => [...prev, receivedMessage]);
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
      stompClient.current?.deactivate();
    };
  }, [senderId, receiverId]);

  // Fetch receiver details
  useEffect(() => {
    const fetchReceiver = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/users/${receiverId}`
        );
        setReceiver(res.data);
      } catch (error) {
        console.error("Error fetching receiver:", error);
      }
    };
    fetchReceiver();
  }, [receiverId]);

  // Fetch previous messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/messages/${senderId}/${receiverId}`
        );
        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [senderId, receiverId]);

  // Send a message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newMessage = {
      senderId: parseInt(senderId),
      receiverId: parseInt(receiverId),
      content: content.trim(),
    };

    try {
      // ONLY use the REST API which will save and broadcast
      await axios.post(
        `${API_BASE_URL}/api/messages/send`,
        newMessage
      );

      setContent(""); // Clear input
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const [showOptions, setShowOptions] = useState(false);

  // const handleShareLocation = () => {
  //   navigator.geolocation.getCurrentPosition(
  //     async (position) => {
  //       const { latitude, longitude } = position.coords;
  //       const locationMessage = {
  //         senderId: parseInt(senderId),
  //         receiverId: parseInt(receiverId),
  //         content: `📍 Location: https://maps.google.com/?q=${latitude},${longitude}`,
  //       };
  //       await axios.post('http://localhost:8080/api/messages/send', locationMessage);
  //       setShowOptions(false);
  //     },
  //     (error) => {
  //       console.error('Error getting location:', error);
  //       alert("Unable to fetch location.");
  //     }
  //   );
  // };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("senderId", senderId);
    formData.append("receiverId", receiverId);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/messages/image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // ✅ Optional: Push message directly to chat for instant display
      setMessages((prev) => [...prev, res.data]);
      console.log("Image upload response:", res.data);

      setShowOptions(false);
    } catch (error) {
      console.error("Error sending photo:", error);
      alert("Failed to send photo.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-6 relative">
      {receiver && (
        <h2 className="text-2xl font-semibold mb-4">
          Chat with {receiver.name}
        </h2>
      )}

      {/* <div className="h-96 overflow-y-auto border rounded p-4 mb-4 bg-gray-50">
        {messages.map((msg, index) => (
          // <div
          //   key={index}
          //   className={`mb-2 p-2 rounded ${
          //     msg.senderId === parseInt(senderId)
          //       ? 'bg-indigo-100 text-right'
          //       : 'bg-white text-left border'
          //   }`}
          // >
          //   {msg.content}
          // </div>
          <div
            key={index}
            className={`mb-2 p-2 rounded ${
              msg.senderId === parseInt(senderId)
                ? "bg-indigo-100 text-right"
                : "bg-white text-left border"
            }`}
          >
            <div
              key={index}
              className={`mb-2 p-2 rounded ${
                msg.senderId === parseInt(senderId)
                  ? "bg-indigo-100 text-right"
                  : "bg-white text-left border"
              }`}
            >
              {(() => {
                try {
                  const parsed = JSON.parse(msg.content);
                  if (parsed.type === "image") {
                    return (
                      <img
                        src={parsed.url}
                        alt="Sent"
                        className="max-w-xs rounded"
                      />
                    );
                  } else if (parsed.type === "location") {
                    return (
                      <a
                        href={`https://www.google.com/maps?q=${parsed.lat},${parsed.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        📍 Shared Location
                      </a>
                    );
                  } else {
                    return parsed.text || msg.content; // fallback for other types
                  }
                } catch {
                  return msg.content;
                }
              })()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div> */}
<div className="h-96 overflow-y-auto border rounded p-4 mb-4 bg-gray-50">
  {messages.map((msg, index) => (
    <div
      key={msg.id || index} // Ensure each message has a unique key
      className={`mb-2 p-2 rounded ${
        msg.senderId === parseInt(senderId)
          ? 'bg-indigo-100 text-right'
          : 'bg-white text-left border'
      }`}
    >
      <div>
        {
          (() => {
            try {
              const parsed = JSON.parse(msg.content);
              if (parsed.type === "image") {
                return <img src={parsed.url} alt="Sent" className="max-w-xs rounded" />;
              } else if (parsed.type === "location") {
                return (
                  <a
                    href={`https://www.google.com/maps?q=${parsed.lat},${parsed.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    📍 Shared Location
                  </a>
                );
              } else {
                return parsed.text || msg.content; // fallback for other types
              }
            } catch {
              return msg.content;
            }
          })()
        }
      </div>
    </div>
  ))}
  <div ref={messagesEndRef} />
</div>

      <form className="flex gap-2 items-center relative" onSubmit={handleSend}>
        <input
          className="flex-1 border p-2 rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
        />

        {/* Attachment Button */}
        <div className="relative">
          <button
            type="button"
            className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
            onClick={() => setShowOptions(!showOptions)}
          >
            +
          </button>

          {/* Dropdown Options Positioned Above */}
          {showOptions && (
            <div className="absolute bottom-full mb-2 w-15 bg-white border rounded shadow z-10">
              <label className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <Camera className="w-6 h-6 text-gray-700" />
                <input
  type="file"
  accept="image/*"
  className="hidden"
  onChange={handlePhotoUpload}
/>

              </label>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
