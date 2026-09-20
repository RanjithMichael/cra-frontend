import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AddCarForm from "../components/AddCarForm";
import CarEditForm from "../components/CarEditForm";

export default function AdminDashboard() {
  const token = localStorage.getItem("token");
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("cars");
  const [editingCarId, setEditingCarId] = useState(null);

  // Helper: format INR currency
  const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  // Helper: calculate total days
  const calculateDays = (start, end) => {
    const diff = new Date(end) - new Date(start);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Fetch cars
  const fetchCars = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/cars", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(data);
    } catch (err) {
      console.error("Failed to fetch cars:", err);
    }
  }, [token]);

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchCars();
    fetchBookings();
  }, [fetchCars, fetchBookings]);

  // Update booking status
  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.patch(`/api/bookings/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBookings();
    } catch (err) {
      console.error("Failed to update booking:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">🛠 Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("cars")}
          className={`px-4 py-2 rounded font-semibold ${
            activeTab === "cars" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"
          }`}
        >
          🚗 Cars
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`px-4 py-2 rounded font-semibold ${
            activeTab === "bookings" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"
          }`}
        >
          📑 Bookings
        </button>
      </div>

      {/* Cars Tab */}
      {activeTab === "cars" && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">Manage Cars</h2>
          <AddCarForm token={token} refreshCars={fetchCars} />

          <table className="w-full border-collapse border mt-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-black">Image</th>
                <th className="border p-2 text-black">Name</th>
                <th className="border p-2 text-black">Make</th>
                <th className="border p-2 text-black">Model</th>
                <th className="border p-2 text-black">Year</th>
                <th className="border p-2 text-black">Price/Day</th>
                <th className="border p-2 text-black">Category</th>
                <th className="border p-2 text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car._id}>
                  {editingCarId === car._id ? (
                    <td colSpan={8} className="border p-4">
                      <CarEditForm
                        car={car}
                        token={token}
                        refreshCars={fetchCars}
                        onClose={() => setEditingCarId(null)}
                      />
                    </td>
                  ) : (
                    <>
                      <td className="border p-2">
                        <img src={car.image || "/placeholder.jpg"} alt={car.name} className="w-20 h-14 object-cover mx-auto" />
                      </td>
                      <td className="border p-2 text-black">{car.name}</td>
                      <td className="border p-2 text-black">{car.make}</td>
                      <td className="border p-2 text-black">{car.model}</td>
                      <td className="border p-2 text-black">{car.year}</td>
                      <td className="border p-2 text-black">{formatINR(car.pricePerDay)}</td>
                      <td className="border p-2 text-black">{car.category}</td>
                      <td className="border p-2 flex gap-2 justify-center">
                        <button onClick={() => setEditingCarId(car._id)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">✏️ Edit</button>
                        <button
                          onClick={async () => {
                            if (!window.confirm("Delete this car?")) return;
                            await axios.delete(`/api/cars/${car._id}`, {
                              headers: { Authorization: `Bearer ${token}` },
                            });
                            fetchCars();
                          }}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Bookings Tab */}
      {activeTab === "bookings" && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">Manage Bookings</h2>
          <table className="w-full border-collapse border mt-6 text-black">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-black">Car</th>
                <th className="border p-2 text-black">Start Date</th>
                <th className="border p-2 text-black">End Date</th>
                <th className="border p-2 text-black">Days</th>
                <th className="border p-2 text-black">Price/Day</th>
                <th className="border p-2 text-black">Total Cost</th>
                <th className="border p-2 text-black">Status</th>
                <th className="border p-2 text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const days = calculateDays(b.startDate, b.endDate);
                const pricePerDay = b.car?.pricePerDay || 0;
                const totalCost = days * pricePerDay;

                return (
                  <tr key={b._id}>
                    <td className="border p-2 text-black">{b.car ? `${b.car.make} ${b.car.model}` : "Car"}</td>
                    <td className="border p-2 text-black">{new Date(b.startDate).toLocaleDateString()}</td>
                    <td className="border p-2 text-black">{new Date(b.endDate).toLocaleDateString()}</td>
                    <td className="border p-2 text-black">{days}</td>
                    <td className="border p-2 text-black">{formatINR(pricePerDay)}</td>
                    <td className="border p-2 font-semibold text-black">{formatINR(totalCost)}</td>
                    <td className="border p-2 text-black">
                      <span className={`px-2 py-1 rounded text-white text-sm ${
                        b.status === "pending" ? "bg-yellow-500" :
                        b.status === "confirmed" ? "bg-green-600" :
                        b.status === "cancelled" ? "bg-red-600" : "bg-gray-500"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="border p-2 flex gap-2 justify-center text-black">
                      {b.status === "pending" && (
                        <>
                                                    <button
                            onClick={() => handleUpdateStatus(b._id, "confirmed")}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            ✅ Confirm
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(b._id, "cancelled")}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            ❌ Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
