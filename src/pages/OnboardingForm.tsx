import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function OnboardingForm() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    phone: "",
    aadhaar: "",
    address: "",
    city: "",
    state: "",
    dob: "",
    weight: "",
    bloodGroup: "",
    healthInfo: "",
    emergencyContact1: "",
    emergencyContact2: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
        alert("User not logged in. Please try signing in again.");
        navigate('/login');
        return;
    };

    await setDoc(doc(db, "users", currentUser.uid), {
      ...form,
      // Ensure name from Google is merged if it exists
      name: currentUser.displayName || "",
    }, { merge: true });

    navigate("/dashboard");
  };

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", 
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", 
    "West Bengal"
  ];

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4 text-center">🔒 Complete Your Donor Profile</h1>
      <p className="text-center text-gray-600 mb-6">
        Welcome! Please provide these additional details to become a registered donor.
      </p>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <Input name="phone" placeholder="+91 Phone Number" required value={form.phone} onChange={handleChange} />
        <Input name="aadhaar" placeholder="Aadhaar Number (XXXX-XXXX-XXXX)" required value={form.aadhaar} onChange={handleChange} />
        <Input name="address" placeholder="Full Address" required value={form.address} onChange={handleChange} />
        <Input name="city" placeholder="City" required value={form.city} onChange={handleChange} />
         <Select onValueChange={(value) => handleSelectChange("state", value)} value={form.state} required>
            <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
            <SelectContent>
                {indianStates.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}
            </SelectContent>
        </Select>
        <Input name="dob" type="date" placeholder="Date of Birth" required value={form.dob} onChange={handleChange} />
        <Input name="weight" placeholder="Weight (kg)" required value={form.weight} onChange={handleChange} />
        <Select onValueChange={(value) => handleSelectChange("bloodGroup", value)} value={form.bloodGroup} required>
            <SelectTrigger><SelectValue placeholder="Select Blood Group" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
        </Select>
        <Input name="healthInfo" placeholder="Allergies or Health Conditions" value={form.healthInfo} onChange={handleChange} />
        <Input name="emergencyContact1" placeholder="Emergency Contact 1" required value={form.emergencyContact1} onChange={handleChange} />
        <Input name="emergencyContact2" placeholder="Emergency Contact 2" value={form.emergencyContact2} onChange={handleChange} />
        <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">✅ Save and Continue</Button>
      </form>
    </div>
  );
}