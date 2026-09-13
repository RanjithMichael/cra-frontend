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

  const handlePayment = async (booking) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/payments/create-payment-intent",
        { bookingId: booking._id, amount: booking.payment.amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = res.data.checkoutUrl; // redirect to Stripe Checkout
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
              {/* Car details */}
              <h3 className="text-lg font-semibold">
                {b.car ? `${b.car.make} ${b.car.model}` : "Car"}
              </h3>
              <p><strong>Year:</strong> {b.car?.year}</p>
              <p><strong>Price/Day:</strong> ₹{b.car?.pricePerDay}</p>
              <p>Available: {b.car?.available ? "Yes" : "No"}</p>
              {b.car?.image && (
               <img
                src={b.car.image}
                alt={`${b.car.make} ${b.car.model}`}
                className="w-full h-32 object-cover rounded mt-2"
              />
              )}
              {/* Booking details */}
              <p><strong>Start:</strong> {new Date(b.startDate).toLocaleDateString()}</p>
              <p><strong>End:</strong> {new Date(b.endDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {b.status}</p>

              {/* Payment details */}
              <p><strong>Amount:</strong> ${b.payment?.amount} {b.payment?.currency}</p>
              <p><strong>Payment Status:</strong> {b.payment?.status}</p>

              {/* Action buttons */}
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

