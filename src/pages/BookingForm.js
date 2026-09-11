import { useState } from "react";
import axios from "axios";

export default function BookingForm({ carId }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [booking, setBooking] = useState(null);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/bookings",
        { car: carId, startDate, endDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooking(res.data); // store booking info
      alert("Booking created! Proceed to payment.");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/payments/create-payment-intent",
        { bookingId: booking._id, amount: booking.payment.amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect to Stripe Checkout or handle clientSecret
      window.location.href = res.data.checkoutUrl; // if using Stripe Checkout
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md space-y-4">
      <form onSubmit={handleBooking} className="space-y-4">
        <h2 className="text-xl font-bold">Book This Car</h2>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Confirm Booking
        </button>
      </form>

      {booking && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-semibold">Booking Summary</h3>
          <p><strong>Car ID:</strong> {booking.car}</p>
          <p><strong>Start:</strong> {new Date(booking.startDate).toLocaleDateString()}</p>
          <p><strong>End:</strong> {new Date(booking.endDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {booking.status}</p>
          <p><strong>Amount:</strong> ${booking.payment.amount} {booking.payment.currency}</p>
          <p><strong>Payment Status:</strong> {booking.payment.status}</p>

          {booking.payment.status === "unpaid" && (
            <button
              onClick={handlePayment}
              className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Pay Now
            </button>
          )}
        </div>
      )}
    </div>
  );
}
