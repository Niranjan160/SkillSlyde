import { FaEnvelope } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const FloatingChatButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (location.pathname === "/messages" || location.pathname.includes("/chat/")) {
      navigate("/jobs"); // Or back to last route
    } else {
      navigate("/messages");
    }
    setIsOpen(!isOpen);
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 z-50"
    >
      <FaEnvelope size={20} />
    </button>
  );
};

export default FloatingChatButton;
