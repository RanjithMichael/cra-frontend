import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CarList from "./pages/CarList";
import BookingForm from "./pages/BookingForm";
import BookingList from "./pages/BookingList";
import AdminBookingList from "./pages/AdminBookingList";

function App() {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login"; // redirect to login
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <header className="text-center py-6 space-y-4">
          <h1 className="text-4xl font-bold text-blue-400">Car Rental App</h1>
          <p className="text-lg">🚗 Powered by React + TailwindCSS</p>

          {/* Navigation */}
          <nav className="space-x-4">
            {!token && (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition"
                >
                  Register
                </Link>
              </>
            )}

            {token && (
              <>
                <Link
                  to="/cars"
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold transition"
                >
                  View Cars
                </Link>
                <Link
                  to="/my-bookings"
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-semibold transition"
                >
                  My Bookings
                </Link>
                {role === "admin" && (
                  <Link
                    to="/admin/bookings"
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition"
                  >
                    Admin Bookings
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg font-semibold transition"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </header>

        {/* Page Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cars" element={<CarList />} />
            <Route path="/book/:carId" element={<BookingForm />} />
            <Route path="/my-bookings" element={<BookingList />} />
            <Route path="/admin/bookings" element={<AdminBookingList />} />
            <Route
              path="/"
              element={
                <div className="flex items-center justify-center h-full">
                  <h2 className="text-2xl">Welcome to Car Rental App</h2>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

