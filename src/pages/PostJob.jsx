import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import categories from "../data/categories";
import Custom from "../assets/images/custom.webp";
import { API_BASE_URL } from "../CONSTANTS";

const PostJob = ({ addJob, userId }) => {
  const navigate = useNavigate();
  const [job, setJob] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    salaryRange: "",
    isCustomSalary: false,
    expectedHours: "",
    jobType: "Full-Time",
    jobCategories: "",
    isWages: false,
    showFormModal: false,
    customCategory: false,
  });
  const [userJobs, setUserJobs] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null); //  For opening the modal
  const [editJobData, setEditJobData] = useState(null); //  For editing
  const [showModal, setShowModal] = useState(false); //  Modal open/close
  const [isEditing, setIsEditing] = useState(false); //  Track if editing or viewing

  // Fetch user's posted jobs on mount
  useEffect(() => {
    if (userId) {
      fetch(`${API_BASE_URL}/api/jobs/user/${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch jobs");
          return res.json();
        })
        .then((data) => {
          data.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt)); // ✅ newest first
          setUserJobs(data);
        })
                .catch((err) => console.error(err));
    }
  }, [userId]);

  const handleCategoryClick = (category) => {
    const isCustom = category === "Custom Category";
    setJob({
      title: isCustom ? "" : category,
      description: "",
      location: "",
      salary: "",
      expectedHours: "",
      jobType: "Full-Time",
      jobCategories: isCustom ? "Custom" : category,
      isWages: false,
      showFormModal: true,
      customCategory: isCustom,
    });
    setIsCustomSalary(false); // Reset toggle to Choose Range mode
    setShowCategoryModal(false);
  };

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleJobTypeChange = (e) => {
    const value = e.target.value;
    const isWages = value === "One-Time(service)";
    setJob({ ...job, jobType: value, isWages });
  };

  const [isCustomSalary, setIsCustomSalary] = useState(false);

  const salaryRanges = [
    { label: "₹5,000 - ₹10,000", value: "5000-10000" },
    { label: "₹10,000 - ₹20,000", value: "10000-20000" },
    { label: "₹20,000 - ₹30,000", value: "20000-30000" },
    { label: "₹30,000+", value: "30000+" },
  ];

  const handleSalaryRangeChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "custom") {
      setJob({ ...job, salaryRange: "", salary: "", isCustomSalary: true });
    } else {
      setJob({
        ...job,
        salaryRange: selectedValue,
        salary: "",
        isCustomSalary: false,
      });
    }
  };
  const handleCustomSalaryChange = (e) => {
    setJob({ ...job, salary: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    userId,
    title: job.title,
    description: job.description,
    location: job.location,
    salary: job.salary,
    jobCategories: job.jobCategories,
    jobType: job.jobType,
    status: "OPEN",
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed to post job");

    const newJob = await response.json();

    // Update the job list locally
    setUserJobs((prevJobs) => [newJob, ...prevJobs]);

    toast.success("Job posted successfully");

    // Close the modal
    setJob({ ...job, showFormModal: false });
  } catch (err) {
    toast.error("Failed to post job");
    console.error(err);
  }
};

  
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-4 lg:px-5">
          <h1 className="text-3xl font-bold text-indigo-600 mb-8 text-center">
            Post a New Job
          </h1>

          {/* Category Selector */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Select Job Category
            </h2>
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {categories.slice(0, 6).map((cat) => (
                <div
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="min-w-[160px] cursor-pointer relative rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-32 w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white text-center py-2 text-sm font-medium">
                    {cat.name}
                  </div>
                </div>
              ))}
              <button
                className="min-w-[120px] bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center"
                onClick={() => setShowCategoryModal(true)}
              >
                See More
              </button>
            </div>
          </div>

          {/* Category Modal */}
          {showCategoryModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Select a Category
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <div
                      key={cat.name}
                      className="cursor-pointer relative rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                      onClick={() => handleCategoryClick(cat.name)}
                    >
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="h-32 w-full object-cover"
                        onError={(e) => (e.target.src = Custom)}
                      />
                      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white text-center py-2 text-sm font-medium">
                        {cat.name}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="mt-6 w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                  onClick={() => setShowCategoryModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Form Modal */}
          {job.showFormModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col md:flex-row gap-8"
                >
                  {/* Left Column */}
                  <div className="flex-1 space-y-4">
                    {/* Job Title */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Job Title
                      </label>
                      <input
                        name="title"
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                        value={job.title}
                        onChange={handleChange}
                        disabled={!job.customCategory}
                        required
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        name="location"
                        type="text"
                        placeholder="eg.Area,District,State"
                        className="w-full border border-gray-300 rounded-lg p-3"
                        value={job.location}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Job Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Job Type
                      </label>
                      <select
                        name="jobType"
                        className="w-full border border-gray-300 rounded-lg p-3"
                        value={job.jobType}
                        onChange={handleJobTypeChange}
                        required
                      >
                        <option>Full-Time</option>
                        <option>Part-Time</option>
                        <option>One-Time(service)</option>
                        <option>Work From Home</option>
                      </select>
                    </div>

                    {/* Salary / Wages */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {job.isWages ? "Wages (₹) (Optional)" : "Salary (₹)"}
                      </label>

                      {/* Toggle Buttons */}
                      <div className="flex mb-3 rounded-full bg-gray-200 w-fit p-1">
                        <button
                          type="button"
                          className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                            !isCustomSalary
                              ? "bg-indigo-600 text-white"
                              : "text-gray-700 hover:bg-gray-300"
                          }`}
                          onClick={() => setIsCustomSalary(false)}
                        >
                          Choose Range
                        </button>
                        <button
                          type="button"
                          className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                            isCustomSalary
                              ? "bg-indigo-600 text-white"
                              : "text-gray-700 hover:bg-gray-300"
                          }`}
                          onClick={() => setIsCustomSalary(true)}
                        >
                          Enter Custom
                        </button>
                      </div>

                      {/* Salary Field */}
                      {!isCustomSalary ? (
                        <select
                          name="salary"
                          className="w-full border border-gray-300 rounded-lg p-3"
                          value={job.salary}
                          onChange={handleChange}
                          required={!job.isWages}
                        >
                          <option value="">Select a range</option>
                          {[
                            { label: "₹500 - ₹1,000", value: "500-1000" },
                            { label: "₹5,000 - ₹10,000", value: "5000-10000" },
                            {
                              label: "₹10,000 - ₹15,000",
                              value: "10000-15000",
                            },
                            {
                              label: "₹15,000 - ₹20,000",
                              value: "15000-20000",
                            },
                            {
                              label: "₹25,000 - ₹30,000",
                              value: "25000-30000",
                            },
                            { label: "₹30,000+", value: "30000+" },
                          ].map((range) => (
                            <option key={range.value} value={range.value}>
                              {range.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          name="salary"
                          type="text"
                          className="w-full border border-gray-300 rounded-lg p-3"
                          placeholder="Enter exact amount in ₹"
                          value={job.salary}
                          onChange={handleChange}
                          required={!job.isWages}
                        />
                      )}
                    </div>

                    {/* Expected Hours */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Expected Hours{" "}
                        <span className="text-gray-400 text-xs">
                          (Optional)
                        </span>
                      </label>
                      <input
                        name="expectedHours"
                        type="text"
                        placeholder="eg.8"
                        className="w-full border border-gray-300 rounded-lg p-3"
                        value={job.expectedHours}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        rows={10}
                        placeholder="Enter the details of the job.."
                        className="w-full border border-gray-300 rounded-lg p-3"
                        value={job.description}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end mt-4 space-x-3">
                      <button
                        type="button"
                        className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600"
                        onClick={() => {
                          setJob({
                            title: "",
                            description: "",
                            location: "",
                            salary: "",
                            expectedHours: "",
                            jobType: "Full-Time",
                            jobCategories: "",
                            isWages: false,
                            showFormModal: false,
                            customCategory: false,
                          });
                          setIsCustomSalary(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                      >
                        Post Job
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* User's Posted Jobs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userJobs.map((job) => (
              <div
                key={job.jobId}
                className="flex bg-white rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden cursor-pointer"
                // Set different heights for mobile and desktop
                style={{ height: "180px" }} // Mobile default
                onClick={() => {
                  setSelectedJob(job);
                  setEditJobData(job);
                  setShowModal(true);
                }}
              >
                {/* Left Image */}
                <img
                  src={
                    categories.find((cat) => cat.name === job.jobCategories)
                      ?.image || Custom
                  }
                  alt={job.jobCategories}
                  className="w-1/3 h-full object-cover"
                />

                {/* Right Details */}
                <div className="w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-indigo-700 truncate">
                      {job.title}
                    </h3>
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 space-y-1 mt-2 md:mt-3">
                    <p>
                      <strong>Location:</strong> {job.location}
                    </p>
                    <p>
                      <strong>Type:</strong> {job.jobType}
                    </p>
                    <p>
                      <strong>{job.wages ? "Wages" : "Salary"}:</strong> ₹
                      {job.wages || job.salary}
                    </p>
                    <p>
                      <strong>Status:</strong> {job.status}
                    </p>
                    <p>
                      <strong>Posted:</strong>{" "}
                      {new Date(job.postedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ======= Modal for Viewing/Editing Job ======= */}
          {showModal && selectedJob && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-2 md:p-4">
              <div className="bg-white w-full max-w-md md:max-w-2xl p-4 md:p-6 rounded-lg relative overflow-y-auto max-h-[90vh]">
                {/* Close Button */}
                <button
                  className="absolute top-2 right-4 text-2xl text-gray-600 hover:text-red-600"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedJob(null);
                    setIsEditing(false);
                  }}
                >
                  ×
                </button>

                {/* Modal Title */}
                <h2 className="text-xl md:text-2xl font-bold text-indigo-700 mb-4 md:mb-6 text-center">
                  {isEditing ? "Edit Job" : "Job Details"}
                </h2>

                {/* Form or Details */}
                <div className="space-y-3 md:space-y-4">
                  {/* Job Title */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Title
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editJobData?.title || ""}
                        onChange={(e) =>
                          setEditJobData({
                            ...editJobData,
                            title: e.target.value,
                          })
                        }
                        className="w-full border rounded p-2 md:p-3 text-sm md:text-base"
                        required
                      />
                    ) : (
                      <p className="text-gray-600 text-sm md:text-base">
                        {selectedJob.title}
                      </p>
                    )}
                  </div>

                  {/* Job Description */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Description
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editJobData?.description || ""}
                        onChange={(e) =>
                          setEditJobData({
                            ...editJobData,
                            description: e.target.value,
                          })
                        }
                        className="w-full border rounded p-2 md:p-3 text-sm md:text-base"
                        rows="3"
                        required
                      />
                    ) : (
                      <p className="text-gray-600 text-sm md:text-base">
                        {selectedJob.description}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editJobData?.location || ""}
                        onChange={(e) =>
                          setEditJobData({
                            ...editJobData,
                            location: e.target.value,
                          })
                        }
                        className="w-full border rounded p-2 md:p-3 text-sm md:text-base"
                        required
                      />
                    ) : (
                      <p className="text-gray-600 text-sm md:text-base">
                        {selectedJob.location}
                      </p>
                    )}
                  </div>

                  {/* Salary/Wages */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Salary/Wages
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editJobData?.salary || ""}
                        onChange={(e) =>
                          setEditJobData({
                            ...editJobData,
                            salary: e.target.value,
                          })
                        }
                        className="w-full border rounded p-2 md:p-3 text-sm md:text-base"
                      />
                    ) : (
                      <p className="text-gray-600 text-sm md:text-base">
                        ₹ {selectedJob.wages || selectedJob.salary}
                      </p>
                    )}
                  </div>

                  {/* Job Type */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Type
                    </label>
                    {isEditing ? (
                      <select
                        value={editJobData?.jobType || ""}
                        onChange={(e) =>
                          setEditJobData({
                            ...editJobData,
                            jobType: e.target.value,
                          })
                        }
                        className="w-full border rounded p-2 md:p-3 text-sm md:text-base"
                        required
                      >
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="One-Time">One-Time(service)</option>
                        <option value="Work From Home">Work From Home</option>
                      </select>
                    ) : (
                      <p className="text-gray-600 text-sm md:text-base">
                        {selectedJob.jobType}
                      </p>
                    )}
                  </div>

                  {/* ===== Action Buttons ===== */}
                  <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-6 mt-5">
                    {isEditing ? (
                      <>
                        {/* Save Button */}
                        <button
                          type="button"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm md:text-base"
                          onClick={async () => {
                            try {
                              await fetch(
                                `${API_BASE_URL}/api/jobs/${selectedJob.jobId}`,
                                {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    ...editJobData,
                                    userId: userId,
                                  }),
                                }
                              );
                              alert("Job updated successfully!");
                              setIsEditing(false);
                              setShowModal(false);
                              const res = await fetch(
                                `${API_BASE_URL}/api/jobs/user/${userId}`
                              );
                              const data = await res.json();
                              setUserJobs(data);
                            } catch (error) {
                              console.error("Error updating job:", error);
                            }
                          }}
                        >
                          Save
                        </button>

                        {/* Cancel Button */}
                        <button
                          type="button"
                          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm md:text-base"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Edit Button */}
                        <button
                          type="button"
                          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm md:text-base"
                          onClick={() => setIsEditing(true)}
                        >
                          Edit
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm md:text-base"
                          onClick={async () => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this job?"
                              )
                            ) {
                              try {
                                await fetch(
                                  `${API_BASE_URL}/api/jobs/${selectedJob.jobId}`,
                                  {
                                    method: "DELETE",
                                  }
                                );
                                alert("Job deleted successfully!");
                                setShowModal(false);
                                const res = await fetch(
                                  `${API_BASE_URL}/api/jobs/user/${userId}`
                                );
                                const data = await res.json();
                                setUserJobs(data);
                              } catch (error) {
                                console.error("Error deleting job:", error);
                              }
                            }
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        {/* </div> */}
      </div>
    </div>
  );
};

export default PostJob;
