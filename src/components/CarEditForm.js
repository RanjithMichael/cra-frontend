import { useState } from "react";
import axios from "axios";

export default function CarEditForm({ car, token, refreshCars, onClose }) {
  const [formData, setFormData] = useState({
    name: car.name || "",
    make: car.make || "",
    model: car.model || "",
    year: car.year || "",
    pricePerDay: car.pricePerDay || "",
    category: car.category || "",
    fuelType: car.fuelType || "",
    description: car.description || "",
    available: car.available ?? true,
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (file) {
        data.append("image", file);
      }

      await axios.put(`/api/cars/${car._id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      refreshCars();
      onClose();
    } catch (err) {
      console.error("Failed to update car:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
    >
      <h3 className="text-xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
        ✏️ Edit Car
      </h3>
      <div className="grid grid-cols-2 gap-6">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Car Name"
          required
          className="border p-3 rounded-lg text-black focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="make"
          value={formData.make}
          onChange={handleChange}
          placeholder="Make"
          required
          className="border p-3 rounded-lg text-black focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="model"
          value={formData.model}
          onChange={handleChange}
          placeholder="Model"
          required
          className="border p-3 rounded-lg text-black focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="Year"
          type="number"
          required
          className="border p-3 rounded-lg text-black focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="pricePerDay"
          value={formData.pricePerDay}
          onChange={handleChange}
          placeholder="Price/Day"
          type="number"
          required
          className="border p-3 rounded-lg text-black focus:ring-2 focus:ring-indigo-500"
        />

        {/* Category dropdown */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="border p-3 rounded-lg text-black focus:ring-2 focus:ring-indigo-500"
        >
          <option value="" disabled>
            Select Category
          </option>
          <option value="Hatchback">Hatchback</option>
          <option value="Sedan">Sedan</option>
          <option value="Luxury">Luxury</option>
          <option value="SUV">SUV</option>
          <option value="MPV">MPV</option>
          <option value="Electric">Electric</option>
          <option value="Budget">Budget</option>
        </select>

        {/* Fuel Type dropdown */}
        <select
          name="fuelType"
          value={formData.fuelType}
          onChange={handleChange}
          required
          className="border p-3 rounded-lg text-black focus:ring-2 focus:ring-indigo-500"
        >
          <option value="" disabled>
            Select Fuel Type
          </option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
          <option value="CNG">CNG</option>
        </select>

        {/* Description */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-3 rounded-lg col-span-2 text-black focus:ring-2 focus:ring-indigo-500"
          rows={3}
        />

        {/* File upload */}
        <input
          type="file"
          onChange={handleFileChange}
          className="border p-3 rounded-lg col-span-2 text-black focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mt-6 flex gap-4 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={uploading}
          className={`px-5 py-2 rounded-lg font-semibold text-white transition ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {uploading ? "Uploading..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

