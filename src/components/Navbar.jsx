import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 shadow-md flex justify-between items-center">
      {/* Logo / App Name */}
      <h1 className="text-xl font-bold tracking-wide">🚗 Car Rental App</h1>

      {/* Nav Links */}
      <div className="flex gap-4">
        <Link to="/cars" className="hover:text-yellow-300">View Cars</Link>
        {token && (
          <>
            <Link to="/my-bookings" className="hover:text-yellow-300">My Bookings</Link>
            <Link to="/admin" className="hover:text-yellow-300">Admin Dashboard</Link>
          </>
        )}
      </div>

      {/* Auth Buttons */}
      <div className="flex gap-3">
        {!token ? (
          <>
            <Link to="/login" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200">Login</Link>
            <Link to="/register" className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">Logout</button>
        )}
      </div>
    </nav>
  );
}
