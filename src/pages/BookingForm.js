import { useState } from "react";
import axios from "axios";

export default function BookingForm({ carId }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/bookings",
        { car: carId, startDate, endDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Booking successful!");
    } catch (err) {
      alert(err.response?.data?.error || "Booking failed");
    }
  };

  return (
    <form
      onSubmit={handleBooking}
      className="bg-white p-6 rounded shadow-md space-y-4"
    >
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
  );
}
