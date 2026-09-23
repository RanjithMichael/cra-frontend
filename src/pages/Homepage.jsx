import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function HomePage() {
  const [popularCars, setPopularCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularCars = async () => {
      try {
        const res = await axios.get("/api/cars?popular=true"); // 👈 backend filter
        setPopularCars(res.data);
      } catch (err) {
        console.error("Failed to fetch popular cars:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularCars();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 text-center">
        <h1 className="text-4xl font-extrabold mb-4">Welcome to Car Rental App</h1>
        <p className="text-lg mb-6">Find the best cars at affordable daily rates</p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          <Link
            to="/cars"
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
          >
            🚗 View Cars
          </Link>
          <Link
            to="/login"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
          >
            Register
          </Link>
        </div>
      </section>

      {/* Popular Cars */}
      <main className="p-8">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">🔥 Popular Cars</h2>
        {loading ? (
          <p className="text-gray-600">Loading popular cars...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCars.map((car) => (
              <article
                key={car._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col"
              >
                <img
                  src={car.image?.url || "/images/placeholder.png"}
                  alt={car.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900">{car.name}</h3>
                  <p className="text-gray-600">{car.make}</p>
                  <p className="text-sm text-gray-700">
                    {car.fuelType} | {car.transmission} | {car.seats} seats
                  </p>
                  <p className="mt-2 text-blue-600 font-bold">
                    ₹{car.pricePerDay.toLocaleString()} / day
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


