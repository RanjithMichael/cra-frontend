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
    description: "",
    image: "",
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Upload image to Cloudinary
  const uploadImage = async () => {
    if (!file) return null;
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "your_upload_preset"); // replace with your Cloudinary preset

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", // replace with your Cloudinary cloud name
        data
      );
      setUploading(false);
      return res.data.secure_url; // plain string
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

      await axios.post(
        "/api/cars",
        { ...formData, image: imageUrl }, // image is always a string
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFormData({
        name: "",
        make: "",
        model: "",
        year: "",
        pricePerDay: "",
        category: "",
        description: "",
        image: "",
      });
      setFile(null);
      refreshCars();
    } catch (err) {
      console.error("Failed to add car:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4 text-black">➕ Add New Car</h3>
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

        {/* Optional manual image URL */}
        <input
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Image URL (optional)"
          className="border p-2 rounded col-span-2 text-black"
        />

        {/* File upload for Cloudinary */}
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="border p-2 rounded col-span-2 text-black" />
      </div>
      <button type="submit" disabled={uploading} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {uploading ? "Uploading..." : "Add Car"}
      </button>
    </form>
  );
}
