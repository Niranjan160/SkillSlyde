import { useState } from "react";
import { Link } from "react-router-dom";
import getTimeAgo from "../utils/getTimeAgo";
import categories from "../data/categories"; // ✅ Import your categories
import custom from "../assets/images/custom.webp"
const JobList = ({ job, onJobClick }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const getCategoryImage = (categoryName) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category ? category.image : custom;
  };

  return (
    <div
      onClick={() => onJobClick(job)}
      className="flex bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
    >
      {/* Left Image */}
      <img
        src={getCategoryImage(job.jobCategories)}
        alt={job.jobCategories}
        className="w-1/3 object-cover"
      />

      {/* Right Details */}
      <div className="p-4 w-2/3">
        <h3 className="text-xl font-bold text-indigo-700 mb-2">{job.title}</h3>
        <p className="text-gray-600 text-sm">{job.location}</p>
        <p className="text-gray-500 text-xs mt-1">{getTimeAgo(job.postedAt)}</p>

        <p className="text-gray-700 mt-2 text-sm">
          {showFullDescription ? job.description : `${job.description?.substring(0, 90)}...`}
        </p>
        {job.description?.length > 90 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFullDescription(!showFullDescription);
            }}
            className="text-indigo-500 text-xs mt-1"
          >
            {showFullDescription ? "Show Less" : "Read More"}
          </button>
        )}
      </div>
    </div>
  );
};

export default JobList;
