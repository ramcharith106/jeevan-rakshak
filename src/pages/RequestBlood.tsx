import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RequestBlood() {
  const { currentUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    relationship: "",
    bloodGroup: "",
    units: "",
    hospital: "",
    location: "",
    state: "",
    urgency: "Normal",
    condition: "",
    phone: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", {
        state: { redirectTo: location.pathname },
      });
    }
  }, [currentUser, navigate, location.pathname]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!currentUser) {
      alert("Please login before submitting a request.");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      await addDoc(collection(db, "requests"), {
        ...form,
        units: parseInt(form.units, 10) || 0,
        userId: currentUser.uid,
        createdAt: Timestamp.now(),
        fulfilled: false,
        status: "open",
      });
      setSubmitted(true);
    } catch (err) {
      alert("Error submitting request.");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
          Request Blood
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Fill in the patient's details and urgency. We'll notify nearby donors instantly.
        </p>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg text-center shadow">
            ✅ Your request has been posted. Donors will be in touch soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input name="name" placeholder="Patient Name" required value={form.name} onChange={handleChange} />
              <Input name="relationship" placeholder="Relationship to Requester" required value={form.relationship} onChange={handleChange} />
              <Select onValueChange={(value) => handleSelectChange("bloodGroup", value)} value={form.bloodGroup}>
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
              <Input name="units" placeholder="Units Needed" required type="number" value={form.units} onChange={handleChange} />
              <Input name="hospital" placeholder="Hospital Name" required value={form.hospital} onChange={handleChange} />
              <Input name="phone" type="tel" placeholder="Contact Number" required value={form.phone} onChange={handleChange} />
              <Select onValueChange={(value) => handleSelectChange("urgency", value)} value={form.urgency}>
                  <SelectTrigger><SelectValue placeholder="Urgency" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                  </SelectContent>
              </Select>
              <Input name="date" type="date" placeholder="Needed Date" required value={form.date} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
                <Input name="location" className="sm:col-span-2" placeholder="Hospital Address / City" required value={form.location} onChange={handleChange} />
                <Select onValueChange={(value) => handleSelectChange("state", value)} value={form.state}>
                    <SelectTrigger className="sm:col-span-2"><SelectValue placeholder="Select State" /></SelectTrigger>
                    <SelectContent>
                        {indianStates.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>


            <Textarea
              name="condition"
              placeholder="Medical Condition / Reason"
              value={form.condition}
              onChange={handleChange}
              className="min-h-[100px]"
            />

            <Button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white w-full text-lg"
            >
              {loading ? "Posting..." : "📤 Request Now"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}