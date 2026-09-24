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
    transmission: "",   
    seats: "",
    description: "",
    isPopular: false, 
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
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

      await axios.post("https://cra-backend-production-eebb.up.railway.app/api/cars", data, {
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
        transmission: "",   
        seats: "",
        description: "",
        isPopular: false,
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
      className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200"
    >
      <h3 className="text-xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
        ➕ Add New Car
      </h3>
      <div className="grid grid-cols-2 gap-6">
        {/* Inputs */}
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Car Name" required className="border p-3 rounded-lg text-black focus:ring-2 focus:ring-indigo-500" />
        <input name="make" value={formData.make} onChange={handleChange} placeholder="Make" required className="border p-3 rounded-lg text-black focus:ring-2 focus:ring-indigo-500" />
        <input name="model" value={formData.model} onChange={handleChange} placeholder="Model" required className="border p-3 rounded-lg text-black focus:ring-2 focus:ring-indigo-500" />
        <input name="year" value={formData.year} onChange={handleChange} placeholder="Year" type="number" required className="border p-3 rounded-lg text-black focus:ring-2 focus:ring-indigo-500" />
        <input name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} placeholder="Price/Day" type="number" required className="border p-3 rounded-lg text-black focus:ring-2 focus:ring-indigo-500" />
        <input name="seats" value={formData.seats} onChange={handleChange} placeholder="No. of Seats" type="number" required className="border p-3 rounded-lg text-black focus:ring-2 focus:ring-indigo-500" />

        {/* Category dropdown */}
        <select name="category" value={formData.category} onChange={handleChange} required className="border p-3 rounded-lg text-black focus:ring-2 focus:ring-indigo-500">
          <option value="" disabled>Select Category</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Sedan">Sedan</option>
          <option value="Luxury">Luxury</option>
          <option value="SUV">SUV</option>
          <option value="MPV">MPV</option>
          <option value="Electric">Electric</option>
          <option value="Budget">Budget</option>
        </select>

        {/* Fuel Type dropdown */}
        <select name="fuelType" value={formData.fuelType} onChange={handleChange} required className="border p-3 rounded-lg text-black focus:ring-2 focus:ring-indigo-500">
          <option value="" disabled>Select Fuel Type</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        {/* Transmission dropdown ✅ */}
        <select name="transmission" value={formData.transmission} onChange={handleChange} required className="border p-3 rounded-lg text-black focus:ring-2 focus:ring-indigo-500">
          <option value="" disabled>Select Transmission</option>
          <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option>
        </select>

        {/* Description */}
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="border p-3 rounded-lg col-span-2 text-black focus:ring-2 focus:ring-indigo-500" rows={3} />

        {/* File upload */}
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="border p-3 rounded-lg col-span-2 text-black focus:ring-2 focus:ring-indigo-500" />

        {/* Popular checkbox */}
        <div className="col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            name="isPopular"
            checked={formData.isPopular}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600"
          />
          <label className="text-gray-700 font-medium">Mark as Popular</label>
        </div>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className={`mt-6 w-full px-4 py-3 rounded-lg font-semibold text-white transition ${
          uploading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {uploading ? "Uploading..." : "Add Car"}
      </button>
    </form>
  );
}
