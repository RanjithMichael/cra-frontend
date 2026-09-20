import { useState } from "react";
import axios from "axios";

export default function AddCarForm({ token, refreshCars }) {
  const [formData, setFormData] = useState({
    name: "",
    make: "",
    model: "",
    year: "",
    pricePerDay: "",
    category: "",
    fuelType: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        data.append("image", file); // attach file directly
      }

      await axios.post("/api/cars", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset form
      setFormData({
        name: "",
        make: "",
        model: "",
        year: "",
        pricePerDay: "",
        category: "",
        fuelType: "",
        description: "",
      });
      setFile(null);
      refreshCars();
      alert("✅ Car added successfully!");
    } catch (err) {
      console.error("❌ Failed to add car:", err);
      alert("Failed to add car. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow-md mb-6"
    >
      <h3 className="text-lg font-semibold mb-4 text-black">➕ Add New Car</h3>
      <div className="grid grid-cols-2 gap-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Car Name"
          className="border p-2 rounded text-black"
        />
        <input
          name="make"
          value={formData.make}
          onChange={handleChange}
          placeholder="Make"
          className="border p-2 rounded text-black"
        />
        <input
          name="model"
          value={formData.model}
          onChange={handleChange}
          placeholder="Model"
          className="border p-2 rounded text-black"
        />
        <input
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="Year"
          className="border p-2 rounded text-black"
        />
        <input
          name="pricePerDay"
          value={formData.pricePerDay}
          onChange={handleChange}
          placeholder="Price/Day"
          className="border p-2 rounded text-black"
        />

        {/* Category dropdown */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border p-2 rounded text-black"
        >
          <option value="">Select Category</option>
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
          className="border p-2 rounded text-black"
        >
          <option value="">Select Fuel Type</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        {/* Description */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 rounded col-span-2 text-black"
          rows={3}
        />

        {/* File upload */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded col-span-2 text-black"
        />
      </div>
      <button
        type="submit"
        disabled={uploading}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {uploading ? "Uploading..." : "Add Car"}
      </button>
    </form>
  );
}
