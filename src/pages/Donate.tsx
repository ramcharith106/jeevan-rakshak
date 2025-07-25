import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { useNavigate, useLocation } from "react-router-dom";

interface Request {
  id: string;
  name: string;
  bloodGroup: string;
  hospital: string;
  urgency: string;
  date: string;
  phone: string;
  location: string;
  fulfilled?: boolean;
}

export default function Donate() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null); // ✅
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const user = getCurrentUser();
      if (!user) {
        navigate("/login", {
          state: { redirectTo: location.pathname },
        });
        return;
      }

      const snapshot = await getDocs(collection(db, "requests"));
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Request))
        .filter((req) => !req.fulfilled);
      setRequests(data);
    };

    checkAuthAndFetch();
  }, []);

  const handleAcceptDonation = async (req: Request) => {
    const user = getCurrentUser();
    if (!user) {
      alert("You must be logged in to accept a request.");
      return;
    }

    await addDoc(collection(db, "donations"), {
      userId: user.uid,
      donorName: user.displayName || user.email || "Anonymous",
      bloodGroup: req.bloodGroup,
      recipientName: req.name,
      hospital: req.hospital,
      requestId: req.id,
      createdAt: new Date(),
    });

    await updateDoc(doc(db, "requests", req.id), {
      fulfilled: true,
    });

    setRequests((prev) => prev.filter((r) => r.id !== req.id));
    alert("✅ Donation recorded successfully!");
    window.location.href = `tel:${req.phone}`;
  };

  // ✅ Filtered list based on selected group
  const filteredRequests = selectedGroup
    ? requests.filter((req) => req.bloodGroup === selectedGroup)
    : requests;

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
          Active Blood Requests
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Filter and respond to live blood requests around you.
        </p>

        {/* ✅ Blood Group Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"].map((group) => (
            <span
              key={group}
              onClick={() =>
                setSelectedGroup((prev) => (prev === group ? null : group))
              }
              className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer border ${
                selectedGroup === group
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-gray-100 text-gray-700 hover:bg-red-100"
              }`}
            >
              {group}
            </span>
          ))}
        </div>

        {/* ✅ Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 mt-10">
              No blood requests found for selected filter.
            </p>
          ) : (
            filteredRequests.map((req) => (
              <Card
                key={req.id}
                className="p-5 shadow-sm rounded-xl border hover:shadow-md"
              >
                <h3 className="text-xl font-semibold text-bloodRed mb-2">
                  {req.name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  🩸 Blood Group: <strong>{req.bloodGroup}</strong>
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  🏥 Hospital: {req.hospital}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  📍 Location: {req.location}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  ⚠️ Urgency:{" "}
                  <span
                    className={`font-semibold ${
                      req.urgency === "Critical"
                        ? "text-red-600"
                        : req.urgency === "Urgent"
                        ? "text-yellow-600"
                        : "text-blue-600"
                    }`}
                  >
                    {req.urgency}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  📅 Needed By: {req.date}
                </p>

                <Button
                  onClick={() => handleAcceptDonation(req)}
                  className="w-full bg-red-600 text-white hover:bg-red-700"
                >
                  📞 Accept & Call
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
