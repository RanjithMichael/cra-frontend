import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminBookingList() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/bookings/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to load bookings");
      }
    };
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:5000/api/bookings/admin/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(bookings.map(b => b._id === id ? res.data : b));
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const deleteBooking = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/bookings/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(bookings.filter(b => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const calculateDays = (start, end) => {
    const diff = new Date(end) - new Date(start);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin - All Bookings</h2>
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
                <p><strong>User:</strong> {b.user?.name} ({b.user?.email})</p>
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

              {/* Admin action buttons */}
              <div className="mt-4 flex gap-3">
                {b.status === "pending" && (
                  <button
                    onClick={() => updateStatus(b._id, "confirmed")}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Confirm
                  </button>
                )}
                {b.status !== "cancelled" && (
                  <button
                    onClick={() => updateStatus(b._id, "cancelled")}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => deleteBooking(b._id)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

