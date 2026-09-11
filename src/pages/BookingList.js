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

  const handlePayment = async (booking) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/payments/create-payment-intent",
        { bookingId: booking._id, amount: booking.payment.amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Example: redirect to Stripe Checkout
      window.location.href = res.data.checkoutUrl;
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="border rounded p-4 bg-white shadow">
              <h3 className="text-lg font-semibold">{b.car?.name || "Car"}</h3>
              <p>Start: {new Date(b.startDate).toLocaleDateString()}</p>
              <p>End: {new Date(b.endDate).toLocaleDateString()}</p>
              <p>Status: {b.status}</p>
              <p>Amount: ${b.payment?.amount} {b.payment?.currency}</p>
              <p>Payment Status: {b.payment?.status}</p>

              {b.status === "pending" && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleCancel(b._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                  {b.payment?.status === "unpaid" && (
                    <button
                      onClick={() => handlePayment(b)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
