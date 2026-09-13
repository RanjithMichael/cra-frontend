import { useEffect, useState } from "react";
import axios from "axios";

export default function CarList() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Grab token from localStorage (assuming you store JWT there)
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cars");
        setCars(res.data);
      } catch (err) {
        console.error("Error fetching cars:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleBooking = async (carId) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/bookings",
        {
          carId,
          startDate: "2026-09-15", // later replace with date picker
          endDate: "2026-09-20",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Booking successful!");
      console.log("Booking:", res.data);
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading cars...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Cars</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div
            key={car._id}
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
          >
            {/* Car Image */}
            {car.image ? (
              <img
                src={car.image}
                alt={`${car.make} ${car.model}`}
                className="w-full h-40 object-cover rounded mb-4"
              />
            ) : (
              <div className="w-full h-40 bg-gray-300 flex items-center justify-center rounded mb-4">
                <span className="text-gray-600">No Image Available</span>
              </div>
            )}

            {/* Car Details */}
            <h2 className="text-xl font-semibold mb-2">
              {car.make} {car.model}
            </h2>
            <p className="text-gray-600">Year: {car.year}</p>
            <p className="text-gray-600">Price/Day: ₹{car.pricePerDay}</p>
            <p
              className={`mt-2 font-bold ${
                car.available ? "text-green-600" : "text-red-600"
              }`}
            >
              {car.available ? "Available" : "Not Available"}
            </p>

            {/* Book Now Button */}
            <button
              onClick={() => handleBooking(car._id)}
              disabled={!car.available}
              className={`mt-4 px-4 py-2 rounded ${
                car.available
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              {car.available ? "Book Now" : "Unavailable"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

