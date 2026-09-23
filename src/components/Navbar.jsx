import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // 👈 redirect to HomePage after logout
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 shadow-lg">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Centered Nav Links */}
        {token && (
          <div className="flex-1 flex justify-center gap-8 font-medium">
            <Link
              to="/"
              className="hover:text-yellow-300 transition-colors duration-200"
            >
              HomePage
            </Link>
            <Link
              to="/my-bookings"
              className="hover:text-yellow-300 transition-colors duration-200"
            >
              My Bookings
            </Link>
            <Link
              to="/admin/dashboard"
              className="hover:text-yellow-300 transition-colors duration-200"
            >
              Admin Dashboard
            </Link>
          </div>
        )}

        {/* Auth Buttons (Right side) */}
        {token && (
          <div className="flex justify-end">
            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}



