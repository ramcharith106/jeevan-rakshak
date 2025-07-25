import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getCurrentUser } from "@/lib/auth";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ added

export default function RequestBlood() {
  const [form, setForm] = useState({
    name: "",
    relationship: "",
    bloodGroup: "",
    units: "",
    hospital: "",
    location: "",
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
    const user = getCurrentUser();
    if (!user) {
      navigate("/login", {
        state: { redirectTo: location.pathname },
      });
    }
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const user = getCurrentUser(); // ✅ Get the logged-in user
    if (!user) {
      alert("Please login before submitting a request.");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "requests"), {
        ...form,
        userId: user.uid,
        createdAt: Timestamp.now(),
      });
      setSubmitted(true);
    } catch (err) {
      alert("Error submitting request.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                className="border rounded-md p-2 text-sm text-gray-700"
                required
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              <Input name="units" placeholder="Units Needed" required type="number" value={form.units} onChange={handleChange} />
              <Input name="hospital" placeholder="Hospital Name" required value={form.hospital} onChange={handleChange} />
              <Input name="location" placeholder="Hospital Location" required value={form.location} onChange={handleChange} />
              <select
                name="urgency"
                value={form.urgency}
                onChange={handleChange}
                className="border rounded-md p-2 text-sm text-gray-700"
              >
                <option value="Critical">Critical</option>
                <option value="Urgent">Urgent</option>
                <option value="Normal">Normal</option>
              </select>
              <Input name="date" type="date" placeholder="Needed Date" required value={form.date} onChange={handleChange} />
              <Input name="phone" type="tel" placeholder="Contact Number" required value={form.phone} onChange={handleChange} />
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
