import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { API_BASE_URL } from "../CONSTANTS";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [SelectedJob, setSelectedJob] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [cancelmodalIsOpen, setCancelModalIsOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/applications/accepted/${userId}`);
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications", err);
    }
  };

  const handleCloseClick = async (applicationId, applicantId, userId) => {
    const payload = {
      applicantId,
      applicationId,
      userId,
    };
    await axios.post(`${API_BASE_URL}/api/applications/reject`, payload);
    fetchApplications();
    setCancelModalIsOpen(false);
  };

  const markAsCompleted = async () => {
    if (!selectedApplication) return;
    try {
      await axios.put(
        `${API_BASE_URL}/api/applications/${selectedApplication.applicationId}/complete`,
        { rating }
      );
      fetchApplications();
      setRatingModalOpen(false);
      setSelectedApplication(null);
      setRating(0);
    } catch (err) {
      console.error("Error marking as completed", err);
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setCancelModalIsOpen(false);
    setRatingModalOpen(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-6 relative">
      <h2 className="text-xl font-bold mb-4 text-indigo-700">Accepted Applications</h2>
      {applications.length === 0 ? (
        <p className="text-gray-600">No accepted applications.</p>
      ) : (
        <ul className="space-y-4">
          {applications.map((app) => (
            <li
              key={app.id}
              className="p-4 border rounded bg-gray-50 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`http://192.168.161.190:8080/api/users/${app.userId}/profile-image`}
                  alt={`${app.userName}'s profile`}
                  className="w-12 h-12 rounded-full object-cover border"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-profile.jpg"; // Optional fallback
                  }}
                />
                <div>
                  <h3 className="font-semibold">{app.title}</h3>
                  <p className="text-sm text-gray-600">{app.userName}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedApplication(app);
                    setModalIsOpen(true);
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View Details
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Job Details Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        className="max-w-lg mx-auto mt-20 bg-white p-6 rounded shadow-lg relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <button
          onClick={handleCloseModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ❌
        </button>
        {selectedApplication && (
          <>
            <h2 className="text-xl font-bold mb-4 text-indigo-700">Job Details</h2>
            <p className="mb-1"><strong>Job Title:</strong> {selectedApplication.title}</p>
            <p className="mb-1"><strong>Status:</strong> {selectedApplication.status}</p>
            <p className="mb-1"><strong>Applicant Name:</strong> {selectedApplication.userName}</p>
            <p className="mb-4"><strong>Mobile Number:</strong> {selectedApplication.mobNo}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedJob(selectedApplication);
                  setModalIsOpen(false);
                  setCancelModalIsOpen(true);
                }}
                className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setModalIsOpen(false);
                  setRatingModalOpen(true);
                }}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Complete
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelmodalIsOpen}
        onRequestClose={handleCloseModal}
        className="max-w-lg mx-auto mt-20 bg-white p-6 rounded shadow-lg relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <button
          onClick={handleCloseModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ❌
        </button>
        <p className="mb-4 text-gray-700">Are you sure you want to cancel this job?</p>
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            onClick={() => setCancelModalIsOpen(false)}
          >
            No
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() =>
              handleCloseClick(
                selectedApplication?.applicationId,
                selectedApplication?.userId,
                selectedApplication?.currentUserId
              )
            }
          >
            Yes, Cancel
          </button>
        </div>
      </Modal>

      {/* Rating Modal */}
      <Modal
        isOpen={ratingModalOpen}
        onRequestClose={handleCloseModal}
        className="max-w-lg mx-auto mt-20 bg-white p-6 rounded shadow-lg relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <button
          onClick={handleCloseModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ❌
        </button>
        <h2 className="text-xl font-bold mb-4 text-indigo-700">Rate the Worker</h2>
        <label className="block mb-4 text-gray-700">
          Rating (1 to 5):
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="ml-2 border rounded px-2 py-1"
          >
            <option value={0}>Select</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={markAsCompleted}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={rating === 0}
          >
            Submit Rating & Complete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ApplicationsPage;
