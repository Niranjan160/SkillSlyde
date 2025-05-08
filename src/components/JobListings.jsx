import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { FiFilter } from "react-icons/fi"; // Filter icon from react-icons
import Spinner from "./Spinner";
import categories from "../data/categories"; // ⭐ Import category images
import Custom from "../assets/images/custom.webp";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { API_BASE_URL } from "../CONSTANTS";

const JobListings = ({ isHome = false }) => {
  const currentUserId = parseInt(localStorage.getItem("userId"));

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [titleSearch, setTitleSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false); // State to control filter sidebar visibility

  const [selectedJob, setSelectedJob] = useState(null);

  // Function to fetch jobs from the server
  const fetchJobs = async () => {
    try {
      console.log("inside..");

      const res = await fetch(`${API_BASE_URL}/api/jobs/status/OPEN`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("DaTA: ", data);
      const sortedJobs = data.sort(
        (a, b) => new Date(b.postedAt) - new Date(a.postedAt)
      );
      setJobs(isHome ? sortedJobs.slice(0, 3) : sortedJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial job fetch
    fetchJobs();

    // Real-time job updates via WebSocket
    const socket = new SockJS(`${API_BASE_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to /topic/jobs");
        client.subscribe("/topic/jobs", (message) => {
          const newJob = JSON.parse(message.body);
          setJobs((prevJobs) => {
            const alreadyExists = prevJobs.some(
              (job) => job.jobId === newJob.jobId
            );
            if (!alreadyExists) {
              return [newJob, ...prevJobs]; // Insert at the top
            }
            return prevJobs;
          });
        });
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
      },
    });

    client.activate();

    const interval = setInterval(() => {
      fetchJobs(); // Fallback polling
    }, 30000);

    return () => {
      clearInterval(interval);
      if (client) client.deactivate();
    };
  }, [isHome]);

  const getTimeAgo = (dateStr) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };

  const handleApply = async (job) => {
    const applicantId = parseInt(localStorage.getItem("userId"));
    const employerId = job.userId;
    try {
      await fetch(`${API_BASE_URL}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.jobId, applicantId, employerId }),
      });
      alert("Application submitted ");
    } catch (error) {
      console.error("Error applying:", error);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const salary = parseFloat(job.salary || job.wages || 0);

    return (
      (!jobTypeFilter || job.jobType === jobTypeFilter) &&
      (!salaryFilter ||
        (salaryFilter === "below5k" && salary < 5000) ||
        (salaryFilter === "5kto10k" && salary >= 5000 && salary <= 10000) ||
        (salaryFilter === "10kto20k" && salary > 10000 && salary <= 20000) ||
        (salaryFilter === "20k+" && salary > 20000)) &&
      (!cityFilter ||
        job.location.toLowerCase().includes(cityFilter.toLowerCase())) &&
      (!titleSearch ||
        job.title.toLowerCase().includes(titleSearch.toLowerCase()))
    );
  });

  // ⭐ Helper to get image by category
  const getCategoryImage = (categoryName) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category ? category.image : Custom;
  };

  return (
    <section className="bg-blue-50 py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-indigo-500 mb-8 text-center">
          {isHome ? "Recent Jobs" : "Available Jobs"}
        </h2>

        {/* Filters Button */}
        <button
          className="text-indigo-500 bg-white p-2 rounded-lg shadow-md flex items-center mb-4"
          onClick={() => setShowFilters(!showFilters)} // Toggle filter options
        >
          <FiFilter className="mr-2" /> Filters
        </button>

        {/* Filters Modal */}
        {showFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 px-4 transition-all">
            <div
              className="bg-white w-full sm:w-80 md:w-96 p-6 shadow-lg rounded-md absolute top-1/4 left-0 right-0 sm:left-1/2 sm:-translate-x-1/2"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              {/* Close Button */}
              <button
                className="text-red-500 font-bold text-2xl absolute top-4 right-4"
                onClick={() => setShowFilters(false)}
              >
                ×
              </button>

              <h3 className="text-lg font-bold text-indigo-500 mb-6">
                Filters
              </h3>

              {/* Filters Form */}
              <div className="space-y-4">
                {/* Job Type */}
                <select
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="">All Job Types</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="One-Time">One-Time(service)</option>
                  <option value="Work From Home">Work From Home</option>
                </select>

                {/* Salary Range */}
                <select
                  value={salaryFilter}
                  onChange={(e) => setSalaryFilter(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="">All Salaries</option>
                  <option value="below5k">Below ₹5,000</option>
                  <option value="5kto10k">₹5,000 - ₹10,000</option>
                  <option value="10kto20k">₹10,000 - ₹20,000</option>
                  <option value="20k+">Above ₹20,000</option>
                </select>

                {/* City */}
                <input
                  type="text"
                  placeholder="City"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="border p-2 rounded w-full"
                />

                {/* Search Job Title */}
                <input
                  type="text"
                  placeholder="Search Job Title"
                  value={titleSearch}
                  onChange={(e) => setTitleSearch(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Jobs */}
        {loading ? (
          <Spinner loading={loading} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredJobs.map((job) => (
              <div
                key={job.jobId}
                className="flex bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden"
                onClick={() => setSelectedJob(job)}
                style={{ height: "170px" }}
              >
                {/* Left Details */}
                <div className="p-4 w-2/3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-indigo-700">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Location: {job.location}
                    </p>
                    <p className="text-sm text-gray-600">Type: {job.jobType}</p>
                    <p className="text-sm text-gray-600">
                      {job.wages ? "Wages" : "Salary"}: ₹
                      {job.wages || job.salary}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Posted: {getTimeAgo(job.postedAt)}
                  </p>
                </div>

                {/* Right Image */}
                <img
                  src={getCategoryImage(job.jobCategories)}
                  alt={job.jobCategories}
                  className="w-1/3 h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        {/* Job Details Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-2">
            <div className="bg-white w-full max-w-md md:max-w-4xl rounded-lg p-6 flex flex-col md:flex-row gap-6 relative">
              <button
                className="absolute top-2 right-4 text-red-500 font-bold text-2xl"
                onClick={() => setSelectedJob(null)}
              >
                ×
              </button>

              {/* Left Image */}
              <img
                src={getCategoryImage(selectedJob.jobCategories)}
                alt={selectedJob.jobCategories}
                className="h-60 w-full md:w-1/2 object-cover rounded-lg"
                loading="lazy"
              />

              {/* Right Details */}
              <div className="md:w-1/2 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-indigo-700">
                    {selectedJob.title}
                  </h2>
                  <p className="text-gray-700 mt-4">
                    {selectedJob.description}
                  </p>

                  <div className="text-sm text-gray-600 mt-4 space-y-2">
                    <p>
                      <strong>Location:</strong> {selectedJob.location}
                    </p>
                    <p>
                      <strong>Type:</strong> {selectedJob.jobType}
                    </p>
                    <p>
                      <strong>Salary/Wages:</strong> ₹
                      {selectedJob.wages || selectedJob.salary}
                    </p>
                    <p>
                      <strong>Status:</strong> {selectedJob.status || "Open"}
                    </p>
                    <p>
                      <strong>Posted By:</strong> {selectedJob.userEntity?.name}
                    </p>
                    <p className="text-xs">
                      Posted {getTimeAgo(selectedJob.postedAt)}
                    </p>
                  </div>
                </div>

                {selectedJob.userEntity?.userId !== currentUserId && (
                  <button
                    className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
                    onClick={() => handleApply(selectedJob)}
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobListings;
