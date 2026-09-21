import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 shadow-lg">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo / App Name */}
        <h1 className="text-2xl font-extrabold tracking-wide flex items-center gap-2">
          🚗 <span>Car Rental App</span>
        </h1>

        {/* Nav Links */}
        <div className="hidden md:flex gap-6 font-medium">
          <Link
            to="/cars"
            className="hover:text-yellow-300 transition-colors duration-200"
          >
            View Cars
          </Link>
          {token && (
            <>
              <Link
                to="/my-bookings"
                className="hover:text-yellow-300 transition-colors duration-200"
              >
                My Bookings
              </Link>
              <Link
                to="/admin"
                className="hover:text-yellow-300 transition-colors duration-200"
              >
                Admin Dashboard
              </Link>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="flex gap-3">
          {!token ? (
            <>
              <Link
                to="/login"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
