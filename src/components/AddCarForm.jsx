import { useState } from "react";
import axios from "axios";

export default function AddCarForm({ token, refreshCars }) {
  const [name, setName] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!file) {
      setErrorMessage("❌ Please select an image before uploading.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("make", make);
    formData.append("model", model);
    formData.append("year", year);
    formData.append("pricePerDay", pricePerDay);
    formData.append("available", true);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("image", file);

    try {
      
      await axios.post("/api/cars", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage("✅ Car added successfully!");
      refreshCars();

      // Reset form
      setName("");
      setMake("");
      setModel("");
      setYear("");
      setPricePerDay("");
      setCategory("");
      setDescription("");
      setFile(null);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Car Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded bg-white text-black" />
        <input type="text" placeholder="Make" value={make} onChange={(e) => setMake(e.target.value)} className="w-full p-2 border rounded bg-white text-black" />
        <input type="text" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} className="w-full p-2 border rounded bg-white text-black" />
        <input type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} className="w-full p-2 border rounded bg-white text-black" />
        <input type="number" placeholder="Price/Day" value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} className="w-full p-2 border rounded bg-white text-black" />
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded bg-white text-black" />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded bg-white text-black" />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full p-2 border rounded bg-white text-black" />

        <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
          {loading ? "Uploading..." : "Add Car"}
        </button>
      </form>

      {successMessage && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded flex justify-between items-center">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage("")} className="ml-2 text-green-700 font-bold">×</button>
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded flex justify-between items-center">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage("")} className="ml-2 text-red-700 font-bold">×</button>
        </div>
      )}
    </div>
  );
}



