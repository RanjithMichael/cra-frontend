import { useState } from "react";
import axios from "axios";

export default function CarEditForm({ car, token, refreshCars, onClose }) {
  const [name, setName] = useState(car.name);
  const [make, setMake] = useState(car.make);
  const [model, setModel] = useState(car.model);
  const [year, setYear] = useState(car.year);
  const [pricePerDay, setPricePerDay] = useState(car.pricePerDay);
  const [category, setCategory] = useState(car.category);
  const [description, setDescription] = useState(car.description || "");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("make", make);
    formData.append("model", model);
    formData.append("year", year);
    formData.append("pricePerDay", pricePerDay);
    formData.append("category", category);
    formData.append("description", description);
    if (file) formData.append("image", file);

    try {
      await axios.put(`/api/cars/${car._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Car updated successfully!");
      refreshCars();
      onClose(); // close the form after update
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded bg-gray-50">
      <h3 className="font-bold mb-2">Edit Car</h3>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Car Name"
          className="w-full p-2 border rounded bg-white text-black"
        />
        <input
          type="text"
          value={make}
          onChange={(e) => setMake(e.target.value)}
          placeholder="Make"
          className="w-full p-2 border rounded bg-white text-black"
        />
        <input
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Model"
          className="w-full p-2 border rounded bg-white text-black"
        />
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year"
          className="w-full p-2 border rounded bg-white text-black"
        />
        <input
          type="number"
          value={pricePerDay}
          onChange={(e) => setPricePerDay(e.target.value)}
          placeholder="Price/Day"
          className="w-full p-2 border rounded bg-white text-black"
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="w-full p-2 border rounded bg-white text-black"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 border rounded bg-white text-black"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full p-2 border rounded bg-white text-black"
        />

        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
