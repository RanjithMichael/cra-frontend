import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Spinner from "../components/Spinner";


export default function ViewCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [dateRanges, setDateRanges] = useState({});
  const [searchParams] = useSearchParams();
  const selectedCarId = searchParams.get("carId");
  const destination = searchParams.get("destination");

  // Refs to scroll into view
  const carRefs = useRef({});

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await axios.get("https://cra-backend-production-eebb.up.railway.app/api/cars", {
          headers: { Authorization: `Bearer ${token}` },
        });

        //Filter by destination if provided
        if (destination) {
          const filtered = data.filter((car) =>
            car.category?.toLowerCase().includes(destination.toLowerCase())
          );
          setCars(filtered.length > 0 ? filtered : data); // fallback to all cars if none match
        } else {
          setCars(data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch cars:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [token, destination]);

  useEffect(() => {
    if (selectedCarId && carRefs.current[selectedCarId]) {
      carRefs.current[selectedCarId].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [cars, selectedCarId]);

  const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

  const calculateDays = (start, end) => {
    const diff = new Date(end) - new Date(start);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleBookNow = async (carId) => {
    const [startDate, endDate] = dateRanges[carId] || [null, null];
    if (!startDate || !endDate) {
      alert("⚠️ Please select a start and end date before booking.");
      return;
    }
    try {
      const { data } = await axios.post(
        "/api/bookings",
        {
          carId,
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        },
        { headers: { Authorization: `Bearer ${token}` } }
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

    {loading ? (
      <>
        <Spinner />
        <p className="text-black">Loading cars...</p>
      </>
    ) : Array.isArray(cars) && cars.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {cars.map((car) => {
          const [startDate, endDate] = dateRanges[car._id] || [null, null];
          const days = startDate && endDate ? calculateDays(startDate, endDate) : 0;
          const totalCost = days * (car.pricePerDay || 0);

          return (
            <div
              key={car._id}
              ref={(el) => (carRefs.current[car._id] = el)}
              className={`flex flex-col bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 ${
                car._id === selectedCarId ? "ring-4 ring-indigo-500" : "hover:scale-105"
              }`}
            >
              <img
                src={
                  car.image?.url ||
                  `https://via.placeholder.com/400x300?text=${encodeURIComponent(car.category)}+Image`
                }
                alt={car.name}
                className="w-full h-48 object-cover"
              />

              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-gray-900">{car.name}</h2>
                <p className="text-gray-600">
                  {car.make} {car.model} ({car.year})
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700">
                    {car.category}
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">
                    {car.fuelType || "N/A"}
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-700">
                    {car.transmission || "N/A"}
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-700">
                    {car.seats ? `${car.seats} Seats` : "N/A"}
                  </span>
                </div>

                <p className="text-lg font-bold text-blue-600 mt-3">
                  {formatINR(car.pricePerDay)} / day
                </p>

                {car.description && (
                  <p className="text-gray-500 mt-2 text-sm line-clamp-2">{car.description}</p>
                )}

                {/* DatePicker inside card */}
                <div className="mt-3">
                  <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) =>
                      setDateRanges((prev) => ({ ...prev, [car._id]: update }))
                    }
                    isClearable
                    className="border p-2 rounded w-full text-black"
                    placeholderText="Select booking dates"
                  />
                </div>

                {/* Live cost preview */}
                {days > 0 && (
                  <div className="mt-2 text-sm text-gray-700">
                    <p>
                      📅 {days} day(s) selected —{" "}
                      <span className="font-semibold text-blue-600">
                        {formatINR(totalCost)} total
                      </span>
                    </p>
                  </div>
                )}

                <button
                  className="mt-auto w-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-indigo-900 transition"
                  onClick={() => handleBookNow(car._id)}
                >
                  🚀 Book Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <p className="text-black">No cars available.</p>
    )}
  </div>
);
}
