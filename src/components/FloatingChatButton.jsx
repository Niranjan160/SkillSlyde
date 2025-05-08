import { FaEnvelope } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../CONSTANTS";

const FloatingChatButton = ({ employerId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasNewApplications, setHasNewApplications] = useState(false);

  const handleToggle = () => {
    if (location.pathname === "/messages" || location.pathname.includes("/chat/")) {
      navigate("/jobs");
    } else {
      navigate("/messages");
    }
    setHasNewApplications(false);
  };

  useEffect(() => {
    const fetchNewApplications = async () => {
      const employerId = localStorage.getItem("userId");
      try {
        const res = await fetch(`${API_BASE_URL}/api/applications/unread/${employerId}`);
        console.log("res: ",res);
        
        const data = await res.json();
        console.log("data: ",data);

        setHasNewApplications(data.hasUnread);
      } catch (err) {
        console.error("Error fetching application notifications", err);
      }
    };

    fetchNewApplications();

    const interval = setInterval(fetchNewApplications, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, [employerId]);

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 z-50"
    >
      {hasNewApplications && (
        <span className="absolute top-2 right-2 w-3 h-3 bg-red-600 rounded-full border-2 border-white animate-ping"></span>
      )}
      <FaEnvelope size={20} />
    </button>
  );
};

export default FloatingChatButton;
