import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { getCurrentUser } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

export default function OnboardingForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    phone: "",
    aadhaar: "",
    address: "",
    city: "",
    age: "",
    weight: "",
    bloodGroup: "",
    emergencyContact: ""
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) return alert("User not logged in");

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      ...form,
      createdAt: Date.now()
    });

    navigate("/dashboard");
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4 text-center">🔒 Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <Input name="phone" placeholder="+91 Phone Number" required value={form.phone} onChange={handleChange} />
        <Input name="aadhaar" placeholder="Aadhaar Number (XXXX-XXXX-XXXX)" required value={form.aadhaar} onChange={handleChange} />
        <Input name="address" placeholder="Full Address" required value={form.address} onChange={handleChange} />
        <Input name="city" placeholder="City" required value={form.city} onChange={handleChange} />
        <Input name="age" placeholder="Age" required value={form.age} onChange={handleChange} />
        <Input name="weight" placeholder="Weight (kg)" required value={form.weight} onChange={handleChange} />
        <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} required className="border p-2 rounded">
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
        <Input name="emergencyContact" placeholder="Emergency Contact" required value={form.emergencyContact} onChange={handleChange} />
        <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">✅ Save and Continue</Button>
      </form>
    </div>
  );
}
