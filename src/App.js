import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import ViewCars from "./pages/ViewCars";
import MyBookings from "./pages/MyBookings";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/bookings" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/cars" element={<ViewCars />} />
            <Route path="/my-bookings" element={<MyBookings />} />
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
