import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";

export default function HomePage() {
  const [popularCars, setPopularCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPopularCars = async () => {
      try {
        const res = await axios.get("/api/cars?popular=true"); // 👈 backend filter
        setPopularCars(res.data);
      } catch (err) {
        console.error("Failed to fetch popular cars:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularCars();
  }, []);

  // FAQ data
  const faqs = [
    { q: "What is the minimum age required to rent a car?", a: "Minimum age: 21 years. Driving license must be at least 6 months old." },
    { q: "What documents are required to rent a car?", a: "Valid Driving License, Government ID proof (Aadhaar, Passport, PAN), and selfie verification during booking." },
    { q: "Is a security deposit required?", a: "Yes. A refundable security deposit is required. The amount varies by car model and rental type." },
    { q: "Are there any speed limits for rental cars?", a: "Yes. Follow all local traffic laws and posted speed limits. Overspeeding may incur penalties or void insurance coverage." },
    { q: "Can I take the rental car outside the city?", a: "Yes, outstation travel is allowed. Entry taxes or interstate permits will be billed separately." },
    { q: "What is the fuel policy for rental cars?", a: "Two options: Fuel-inclusive plans, or Without fuel (return the car with the same fuel level)." },
    { q: "Is insurance included in the rental price?", a: "Yes, basic insurance is included. Damages due to negligence may not be covered." },
    { q: "What happens if I return the car late?", a: "Late returns incur additional charges based on extra hours used." },
    { q: "Can I extend or cancel my booking?", a: "Extension: Request via app/website. Cancellation: Free within allowed period, otherwise fees apply." },
    { q: "Are there any driving restrictions?", a: "Avoid restricted or unsafe zones. Driving outside India is not permitted." },
    { q: "What should I do in case of a breakdown or accident?", a: "Contact 24x7 support immediately. For accidents, file a police report and take pictures." },
    { q: "How do I return the rental car?", a: "The car will be picked up from your location. Ensure it is clean and fueled as required." },
    { q: "Are tolls and parking included in the rental price?", a: "No. Tolls, parking fees, and interstate taxes must be paid by the customer." },
    { q: "Can I rent a car for just a few hours?", a: "Yes. Hourly, daily, weekly, and monthly rentals are available. Minimum duration is 4 hours." },
    { q: "What types of cars are available?", a: "Hatchbacks, Sedans, SUVs, and limited luxury vehicles are available based on inventory." },
  ];

  const [visibleCount, setVisibleCount] = useState(4);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 4, faqs.length));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 text-center">
        <h1 className="text-4xl font-extrabold mb-4">Welcome to RV Self-Rental Cars</h1>
        <p className="text-lg mb-6">Find the best cars at affordable daily rates</p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          {/* Always show View Cars */}
          <Link
            to="/view-cars"
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
          >
            🚗 View Cars
          </Link>

          {/* Show Login/Register only if NOT logged in */}
          {!token && (
            <>
              <Link
                to="/login"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Popular Cars */}
<main className="p-8">
  <h2 className="text-2xl font-bold text-indigo-700 mb-6">🔥 Popular Cars</h2>
  {loading ? (
    <>
      <Spinner />
      <div className="text-gray-600">Loading...</div>
      <p className="text-gray-600">Loading popular cars...</p>
    </>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {popularCars.map((car) => (
        <Link
          key={car._id}
          to={`/view-cars?carId=${car._id}`} // ✅ redirect with carId
          className="bg-white rounded-xl shadow-md border hover:shadow-lg transition flex h-56 cursor-pointer"
        >
          {/* Left side: Image */}
          <div className="w-1/2 h-full">
            <img
              src={car.image?.url || "/images/placeholder.png"}
              alt={car.name}
              className="w-full h-full object-cover rounded-l-xl"
            />
          </div>

          {/* Right side: Details */}
          <div className="w-1/2 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {car.name}
              </h3>
              <p className="text-gray-600 font-medium">
                {car.make} {car.model}
              </p>
              <div className="mt-2 space-y-1 text-sm text-gray-700">
                <p><span className="font-semibold">Fuel:</span> {car.fuelType}</p>
                <p><span className="font-semibold">Transmission:</span> {car.transmission}</p>
                <p><span className="font-semibold">Seats:</span> {car.seats}</p>
              </div>
            </div>
            <p className="mt-3 text-blue-600 font-bold text-lg">
              ₹{car.pricePerDay.toLocaleString()} / day
            </p>
          </div>
        </Link>
      ))}
    </div>
  )}
</main>


      {/* Featured Destinations */}
      <section className="bg-gray-50 py-10 px-8">
  <h2 className="text-2xl font-bold text-indigo-700 mb-6">🌍 Featured Destinations</h2>
  <div className="grid md:grid-cols-3 gap-6">
    {/* Destination 1 */}
    <Link
      to="/view-cars?destination=ooty"
      className="bg-white shadow-md rounded-lg p-6 border text-center cursor-pointer hover:shadow-lg transition"
    >
      <img
        src="https://res-console.cloudinary.com/naqamlzv/thumbnails/transform/v1/image/upload/Y19maWxsLGhfMjAwLHdfMjAw/v1/T290eS1DdXJ2ZS1Sb2FkLTE=/template_primary"
        alt="Ooty"
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold">Ooty</h3>
      <p className="text-gray-600 text-sm mt-2">
        A scenic hill station in Tamil Nadu, perfect for weekend getaways.
      </p>
    </Link>

    {/* Destination 2 */}
    <Link
      to="/view-cars?destination=pondicherry"
      className="bg-white shadow-md rounded-lg p-6 border text-center cursor-pointer hover:shadow-lg transition"
    >
      <img
        src="https://res-console.cloudinary.com/naqamlzv/thumbnails/transform/v1/image/upload/Y19maWxsLGhfMjAwLHdfMjAw/v1/U2NlbmljLWRyaXZlLWFsb25nLUVhc3QtQ29hc3QtUm9hZC0xLTEwMjR4Njgz/template_primary"
        alt="Pondicherry"
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold">Pondicherry</h3>
      <p className="text-gray-600 text-sm mt-2">
        Coastal charm with French architecture and serene beaches.
      </p>
    </Link>

    {/* Destination 3 */}
    <Link
      to="/view-cars?destination=kerala"
      className="bg-white shadow-md rounded-lg p-6 border text-center cursor-pointer hover:shadow-lg transition"
    >
      <img
        src="https://res-console.cloudinary.com/naqamlzv/thumbnails/transform/v1/image/upload/Y19maWxsLGhfMjAwLHdfMjAw/v1/SU1HXzIwMjMwNjI0XzAwMTcwMy03Njh4MTAyNA==/template_primary"
        alt="munnar gap road"
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold">Munnar Gap Road</h3>
      <p className="text-gray-600 text-sm mt-2">
        Scenic drives through the hills of Munnar — a perfect getaway.
      </p>
    </Link>
  </div>
</section>


      {/* Why Choose Us Section */}
      <section className="bg-white py-10 px-8">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">🚗 Why Choose RV Cars?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6 border"><h3 className="text-lg font-semibold">Home delivery & return</h3><p className="text-gray-600">Doorstep delivery, at your preferred location and time.</p></div>
                    <div className="bg-white shadow-md rounded-lg p-6 border">
            <h3 className="text-lg font-semibold">Well maintained cars</h3>
            <p className="text-gray-600">Serviced regularly; inspection done before each trip.</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 border">
            <h3 className="text-lg font-semibold">Flexible pricing plans</h3>
            <p className="text-gray-600">Choose Your Drive: Fixed KM or Unlimited KM.</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 border">
            <h3 className="text-lg font-semibold">24x7 support</h3>
            <p className="text-gray-600">Round-the-clock assistance whenever you need help.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
<section className="bg-gray-50 py-10 px-8">
  <h2 className="text-2xl font-bold text-indigo-700 mb-6">❓ FAQs</h2>
  <div className="bg-white shadow-md rounded-lg p-6 border space-y-6">
    {faqs.slice(0, visibleCount).map((faq, idx) => (
      <div key={idx}>
        <h3 className="text-lg font-semibold">{faq.q}</h3>
        <p className="text-gray-600 mt-2">{faq.a}</p>
      </div>
    ))}
  </div>

  {/* Buttons */}
  <div className="flex gap-4 mt-6">
    {visibleCount < faqs.length && (
      <button
        onClick={handleLoadMore}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
      >
        Load More
      </button>
    )}
    {visibleCount > 4 && (
      <button
        onClick={() => setVisibleCount(4)}
        className="bg-gray-200 text-indigo-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
      >
        Load Less
      </button>
    )}
  </div>
</section>

{/* About Us Section */}
<section className="relative bg-gradient-to-r from-gray-50 to-gray-100 py-12 px-8 border-t overflow-hidden">
  {/* Background watermark */}
  <div className="absolute inset-0 flex justify-center items-center opacity-5 pointer-events-none">
    <span className="text-9xl">🚗</span>
  </div>

  <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2 relative z-10">
    <span>ℹ️ About Us</span>
    <span className="text-gray-500">🚘</span>
  </h2>

  <div className="bg-white shadow-lg rounded-xl p-8 relative z-10">
    <p className="text-gray-700 leading-relaxed">
      RV Cars is a trusted car rental service provider offering flexible rental plans — hourly, daily, weekly, and monthly. 
      We maintain a diverse fleet of hatchbacks, sedans, and SUVs, giving you the freedom to choose from unlimited km and fuel-inclusive plans. 
      With thousands of happy customers, we pride ourselves on delivering convenience, reliability, and satisfaction every trip.
    </p>
    <p className="text-gray-500 mt-6 text-sm text-center">
      🚗 Drive with confidence • © 2026 RV Cars. All rights reserved.
    </p>
  </div>
</section>
</div>
  );
}
