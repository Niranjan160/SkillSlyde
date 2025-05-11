import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.webp";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

useEffect(() => {
  const checkUser = () => {
    setUserId(localStorage.getItem("userId"));
  };

  // Listen to storage changes (in case of multiple tabs)
  window.addEventListener("storage", checkUser);

  // Optional: run on route change too if needed
  checkUser();

  return () => {
    window.removeEventListener("storage", checkUser);
  };
}, []);


  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
      : "text-indigo-600 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2";

  return (
    <nav className="bg-indigo-300 border-b-2 border-indigo-400 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Navbar Container */}
        <div className="flex justify-between items-center h-16">
          {/* Logo - centered on mobile */}
          <NavLink to="/" className="flex items-center space-x-2">
            <img className="h-10 w-10 rounded-full" src={logo} alt="SkillSlyde" />
            <span className="text-white text-2xl font-bold  md:block">
              SkillSlyde
            </span>
          </NavLink>

          {/* Navigation Links - horizontal on large screens, stacked on mobile */}
          <div className="hidden md:flex space-x-6 items-center ml-auto">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/jobs" className={linkClass}>
              Jobs
            </NavLink>
            {userId && (
  <NavLink to="/add-job" className={linkClass}>
    Post Job
  </NavLink>
)}

            {/* User Profile or Login */}
            {userId ? (
              <button
                className="text-indigo-600 hover:text-indigo-900"
                onClick={() => navigate("/profile")}
              >
                <FaUserCircle size={28} />
              </button>
            ) : (
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
            )}
          </div>
        </div>

        {/* Mobile Navigation Links - centered horizontally */}
        <div className="md:hidden flex justify-center space-x-4 mt-2">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/jobs" className={linkClass}>
            Jobs
          </NavLink>
          <NavLink to="/add-job" className={linkClass}>
            Post Job
          </NavLink>

          {/* User Profile or Login */}
          {userId ? (
            <button
              className="text-indigo-600 hover:text-indigo-900"
              onClick={() => navigate("/profile")}
            >
              <FaUserCircle size={28} />
            </button>
          ) : (
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
