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
    description: car.description || "",
    image: car.image || "", // plain string
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadImage = async () => {
    if (!file) return null;
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "your_upload_preset");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
        data
      );
      setUploading(false);
      return res.data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      setUploading(false);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image;
      if (file) {
        imageUrl = await uploadImage();
      }

      await axios.put(
        `/api/cars/${car._id}`,
        { ...formData, image: imageUrl }, // always string
        { headers: { Authorization: `Bearer ${token}` } }
      );

      refreshCars();
      onClose();
    } catch (err) {
      console.error("Failed to update car:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-black">✏️ Edit Car</h3>
      <div className="grid grid-cols-2 gap-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Car Name" className="border p-2 rounded text-black" />
        <input name="make" value={formData.make} onChange={handleChange} placeholder="Make" className="border p-2 rounded text-black" />
        <input name="model" value={formData.model} onChange={handleChange} placeholder="Model" className="border p-2 rounded text-black" />
        <input name="year" value={formData.year} onChange={handleChange} placeholder="Year" className="border p-2 rounded text-black" />
        <input name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} placeholder="Price/Day" className="border p-2 rounded text-black" />

        {/* Category dropdown */}
        <select name="category" value={formData.category} onChange={handleChange} className="border p-2 rounded text-black">
          <option value="">Select Category</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Sedan">Sedan</option>
          <option value="Luxury">Luxury</option>
          <option value="SUV">SUV</option>
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

        {/* File upload for Cloudinary */}
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="border p-2 rounded col-span-2 text-black" />
      </div>
            <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={uploading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {uploading ? "Uploading..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

