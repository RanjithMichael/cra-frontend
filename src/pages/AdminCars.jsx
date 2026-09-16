import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AddCarForm from "../components/AddCarForm";
import CarEditForm from "../components/CarEditForm";

// CarItem component for each car
function CarItem({ car, token, refreshCars }) {
  const [file, setFile] = useState(null);
  const [editing, setEditing] = useState(false);

  const handleImageUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.put(`/api/cars/${car._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Car image updated!");
      refreshCars();
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
      await axios.delete(`/api/cars/${car._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Car deleted successfully!");
      refreshCars();
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  return (
    <div className="border p-4 mb-4 rounded shadow-sm">
      {editing ? (
        <CarEditForm
          car={car}
          token={token}
          refreshCars={refreshCars}
          onClose={() => setEditing(false)}
        />
      ) : (
        <>
          <h3 className="font-bold text-lg">
            {car.make} {car.model} ({car.year})
          </h3>
          <p>Price per day: ${car.pricePerDay}</p>
          <p><strong>Category:</strong> {car.category}</p>
          {car.description && (
            <p className="italic text-gray-600 mt-1">{car.description}</p>
          )}
          <img
            src={car.image?.url || "/placeholder.jpg"}
            alt={car.name}
            width="200"
            className="mt-2 rounded"
          />

          <form onSubmit={handleImageUpdate} className="mt-2">
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button
              type="submit"
              className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
            >
              Update Image
            </button>
          </form>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminCars() {
  const token = localStorage.getItem("token");
  const [cars, setCars] = useState([]);

  // useCallback ensures fetchCars is stable and removes the warning
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

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Car Management</h1>
      <AddCarForm token={token} refreshCars={fetchCars} />

      <h2 className="mt-6 text-xl font-semibold">Existing Cars</h2>
      {cars.length === 0 ? (
        <p>No cars available.</p>
      ) : (
        cars.map((car) => (
          <CarItem
            key={car._id}
            car={car}
            token={token}
            refreshCars={fetchCars}
          />
        ))
      )}
    </div>
  );
}




