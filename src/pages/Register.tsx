import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import MapModal from "@/components/MapModal";

export default function Register() {
  const navigate = useNavigate();

  const [mapOpen, setMapOpen] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    aadhaar: "",
    city: "",
    address: "",
    bloodGroup: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = (address: string) => {
    setForm((prev) => ({ ...prev, address }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return setError("❌ Passwords do not match.");
    }
    try {
      await registerUser(form.email, form.password);
      navigate("/onboarding"); // Continue to detailed onboarding
    } catch (err) {
      setError("❌ Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-lg w-full p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600 mb-6">
          📝 Create Account
        </h2>

        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <Input name="fullName" placeholder="Full Name" required value={form.fullName} onChange={handleChange} />
          <Input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} />
          <Input name="phone" placeholder="+91 Phone Number" required value={form.phone} onChange={handleChange} />
          <Input name="aadhaar" placeholder="Aadhaar Number (XXXX‑XXXX‑XXXX)" required value={form.aadhaar} onChange={handleChange} />
          <Input name="city" placeholder="City" required value={form.city} onChange={handleChange} />

          {/* Address with Map selector */}
          <div className="flex flex-col gap-1">
            <Input name="address" placeholder="Address" required value={form.address} onChange={handleChange} />
            <button
              type="button"
              onClick={() => setMapOpen(true)}
              className="text-sm text-blue-600 underline hover:text-blue-800 self-start"
            >
              📍 Select on Map
            </button>
          </div>

          {/* Blood group dropdown */}
          <select
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
            required
            className="border rounded-md p-2 text-sm text-gray-700"
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>

          {/* Passwords */}
          <Input name="password" type="password" placeholder="Password" required value={form.password} onChange={handleChange} />
          <Input name="confirmPassword" type="password" placeholder="Confirm Password" required value={form.confirmPassword} onChange={handleChange} />

          <Button type="submit" className="bg-red-600 text-white hover:bg-red-700 w-full">
            Register
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">Login</a>
          </p>
        </form>
      </div>

      {/* Map Picker Modal */}
      <MapModal
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        onSelect={({ lat, lng }) => {
        setForm({ ...form, location: `Lat: ${lat}, Lng: ${lng}` });
        setMapOpen(false);
     }}
   />

    </div>
  );
}
