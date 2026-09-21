import { useEffect, useState } from "react";
import axios from "axios";

export default function ViewCars() {
  const [cars, setCars] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await axios.get("/api/cars", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCars(data);
      } catch (err) {
        console.error("❌ Failed to fetch cars:", err);
      }
    };
    fetchCars();
  }, [token]);

  // Helper: format INR currency
  const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  // Handle booking
  const handleBookNow = async (carId) => {
    try {
      const { data } = await axios.post(
        "/api/bookings",
        {
          carId,
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Booking created successfully!");
      console.log("Booking:", data);
    } catch (err) {
      console.error("❌ Failed to create booking:", err);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">🚗 Available Cars</h1>

      {cars.length === 0 ? (
        <p className="text-black">No cars available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {cars.map((car) => (
            

            <div
              key={car._id}
              className="flex flex-col bg-white rounded-lg shadow-md p-4 transition transform hover:scale-105 hover:shadow-xl"
            >
              <img
                src={car.image?.url || "/placeholder.jpg"}
                alt={car.name}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h2 className="text-xl font-semibold text-black">{car.name}</h2>
              <p className="text-gray-700">
                {car.make} {car.model} ({car.year})
              </p>
              <p className="text-gray-700">Category: {car.category}</p>
              <p className="text-gray-700">Fuel: {car.fuelType || "N/A"}</p>
              <p className="text-lg font-bold text-blue-600 mt-2">
                {formatINR(car.pricePerDay)} / day
              </p>
              {car.description && (
                <p className="text-gray-600 mt-2 text-sm">{car.description}</p>
              )}

              {/* Button aligned at bottom */}
              <button
                className="mt-auto w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded hover:from-blue-700 hover:to-blue-900 transition"
                onClick={() => handleBookNow(car._id)}
              >
                🚀 Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
