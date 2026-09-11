import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CarList from "./pages/CarList";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <header className="text-center py-6 space-y-4">
          <h1 className="text-4xl font-bold text-blue-400">Car Rental App</h1>
          <p className="text-lg">🚗 Powered by React + TailwindCSS</p>

          {/* Navigation */}
          <nav className="space-x-4">
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
            <Link
              to="/cars"
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold transition"
            >
              View Cars
            </Link>
          </nav>
        </header>

        {/* Page Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cars" element={<CarList />} />
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

