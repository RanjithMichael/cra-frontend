import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import ViewCars from "./pages/ViewCars";
import MyBookings from "./pages/MyBookings";
import Homepage from "./pages/Homepage";
import { HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <HelmetProvider>
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
              <Route path="/view-cars" element={<ViewCars />} />   
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
              <Route path="/cars" element={<ViewCars />} />

              {/* Homepage */}
              <Route path="/" element={<Homepage />} />

              {/* Catch-all redirect for invalid routes */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;




