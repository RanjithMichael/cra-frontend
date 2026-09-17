import { useEffect, useState } from "react";
import axios from "axios";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get("/api/my-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch my bookings:", err);
      }
    };
    fetchBookings();
  }, [token]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">📑 My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-black">You have no bookings yet.</p>
      ) : (
        <table className="w-full border-collapse border mt-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-black">Car</th>
              <th className="border p-2 text-black">Start Date</th>
              <th className="border p-2 text-black">End Date</th>
              <th className="border p-2 text-black">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td className="border p-2">
                  {b.car ? `${b.car.make} ${b.car.model}` : "Car not linked"}
                </td>
                <td className="border p-2">
                  {new Date(b.startDate).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  {new Date(b.endDate).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      b.status === "pending"
                        ? "bg-yellow-500"
                        : b.status === "confirmed"
                        ? "bg-green-600"
                        : b.status === "cancelled"
                        ? "bg-red-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
