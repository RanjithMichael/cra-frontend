import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminBookingList() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/bookings", {
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
        `http://localhost:5000/api/admin/bookings/${id}/status`,
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
      await axios.delete(`http://localhost:5000/api/admin/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(bookings.filter(b => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin - All Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="border rounded p-4 bg-white shadow">
              <h3 className="text-lg font-semibold">{b.car?.name || "Car"}</h3>
              <p>User: {b.user?.name} ({b.user?.email})</p>
              <p>Start: {new Date(b.startDate).toLocaleDateString()}</p>
              <p>End: {new Date(b.endDate).toLocaleDateString()}</p>
              <p>Status: {b.status}</p>
              <p>Amount: ${b.payment?.amount} {b.payment?.currency}</p>
              <p>Payment Status: {b.payment?.status}</p>

              <div className="mt-2 flex gap-2">
                {b.status === "pending" && (
                  <button
                    onClick={() => updateStatus(b._id, "confirmed")}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Confirm
                  </button>
                )}
                {b.status !== "cancelled" && (
                  <button
                    onClick={() => updateStatus(b._id, "cancelled")}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => deleteBooking(b._id)}
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
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
