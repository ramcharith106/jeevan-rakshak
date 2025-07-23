import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Request {
  id: string;
  name: string;
  bloodGroup: string;
  hospital: string;
  urgency: string;
  date: string;
  phone: string;
  location: string;
}

export default function Donate() {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const snapshot = await getDocs(collection(db, "requests"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Request[];
      setRequests(data);
    };

    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
          Active Blood Requests
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Filter and respond to live blood requests around you.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"].map((group) => (
            <span
              key={group}
              className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-red-100 cursor-pointer"
            >
              {group}
            </span>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <Card key={req.id} className="p-5 shadow-sm rounded-xl border hover:shadow-md">
              <h3 className="text-xl font-semibold text-bloodRed mb-2">{req.name}</h3>
              <p className="text-sm text-gray-600 mb-1">🩸 Blood Group: <strong>{req.bloodGroup}</strong></p>
              <p className="text-sm text-gray-600 mb-1">🏥 Hospital: {req.hospital}</p>
              <p className="text-sm text-gray-600 mb-1">📍 Location: {req.location}</p>
              <p className="text-sm text-gray-600 mb-1">⚠️ Urgency: <span className={`font-semibold ${req.urgency === "Critical" ? "text-red-600" : req.urgency === "Urgent" ? "text-yellow-600" : "text-blue-600"}`}>{req.urgency}</span></p>
              <p className="text-sm text-gray-600 mb-4">📅 Needed By: {req.date}</p>

              <a href={`tel:${req.phone}`}>
                <Button className="w-full bg-red-600 text-white hover:bg-red-700">
                  📞 Accept & Call
                </Button>
              </a>
            </Card>
          ))}

          {requests.length === 0 && (
            <p className="col-span-full text-center text-gray-500 mt-10">No active blood requests found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
