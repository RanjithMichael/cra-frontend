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
        console.error("Failed to fetch cars:", err);
      }
    };
    fetchCars();
  }, [token]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">🚗 Available Cars</h1>

      {cars.length === 0 ? (
        <p className="text-black">No cars available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car._id} className="bg-white rounded shadow-md p-4">
              <img
                src={car.image || "/placeholder.jpg"}
                alt={car.name}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h2 className="text-xl font-semibold text-black">{car.name}</h2>
              <p className="text-gray-700">{car.make} {car.model} ({car.year})</p>
              <p className="text-gray-700">Category: {car.category}</p>
              <p className="text-gray-700">₹{car.pricePerDay} / day</p>
              {car.description && (
                <p className="text-gray-600 mt-2">{car.description}</p>
              )}
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
