import { useEffect, useState } from "react";
import axios from "axios";

export default function BookingList() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Bookings data:", res.data);
        setBookings(res.data);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to load bookings");
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/bookings/${id}/status`,
        { status: "cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(bookings.map(b => b._id === id ? { ...b, status: "cancelled" } : b));
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
    }
  };

  const calculateDays = (start, end) => {
    const diff = new Date(end) - new Date(start);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((b) => (
            <div key={b._id} className="border rounded-lg p-6 bg-white shadow-md">
              {/* Car details */}
              <div className="flex items-center gap-4">
                {b.car?.image && (
                  <img
                    src={b.car.image}
                    alt={`${b.car.make} ${b.car.model}`}
                    className="w-32 h-20 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold">
                    {b.car ? `${b.car.make} ${b.car.model}` : "Car"}
                  </h3>
                  <p className="text-gray-600">Year: {b.car?.year}</p>
                  <p className="text-gray-600">Price/Day: ₹{b.car?.pricePerDay}</p>
                  <p className="text-gray-600">Available: {b.car?.available ? "Yes" : "No"}</p>
                </div>
              </div>

              {/* Booking details */}
              <div className="mt-4">
                <p><strong>Start:</strong> {new Date(b.startDate).toLocaleDateString()}</p>
                <p><strong>End:</strong> {new Date(b.endDate).toLocaleDateString()}</p>
                <p><strong>Total Days:</strong> {calculateDays(b.startDate, b.endDate)}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      b.status === "pending"
                        ? "bg-yellow-500"
                        : b.status === "confirmed"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {b.status}
                  </span>
                </p>
              </div>

              {/* Action buttons */}
              {b.status === "pending" && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleCancel(b._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


