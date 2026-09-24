import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting login:", { email, password });
    try {
      const res = await axios.post("https://cra-backend-production-eebb.up.railway.app/api/auth/login", {
        email,
        password,
      });
      console.log("Login response:",res.data);

      // Save token + role in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role); // backend should send role

      alert("Login successful!");

      // Redirect based on role
      if (res.data.role === "admin") {
        navigate("/admin/bookings");
      } else {
        navigate("/cars");
      }
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <label htmlFor="email" className="sr-only">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded text-black placeholder-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password" className="sr-only">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded text-black placeholder-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}
