import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { acceptRequest, fetchOpenRequests, updateUserLastCheckedNotifications } from "@/lib/firestore";
import { SuccessAnimation } from "@/components/ui/SuccessAnimation";
import { Confetti } from "@/components/ui/Confetti";

interface Request {
  id: string;
  name: string;
  bloodGroup: string;
  hospital: string;
  urgency: string;
  date: string;
  phone: string;
  location: string;
  status?: "open" | "pending_fulfillment" | "fulfilled";
}

export default function Donate() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadOpenRequests = async () => {
      if (!currentUser) {
        navigate("/login", {
          state: { redirectTo: location.pathname },
        });
        return;
      }
      
      const openRequestsData = await fetchOpenRequests();
      setRequests(openRequestsData as Request[]);
      
      // When the user visits this page, update their timestamp to clear the notification
      await updateUserLastCheckedNotifications(currentUser.uid);
    };

    if (currentUser) {
      loadOpenRequests();
    }
  }, [currentUser, navigate, location.pathname]);

  const handleAcceptDonation = async (req: Request) => {
    if (!currentUser) {
      alert("You must be logged in to accept a request.");
      return;
    }

    try {
        await acceptRequest(req, currentUser);
        
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setRequests((prev) => prev.filter((r) => r.id !== req.id));
            window.location.href = `tel:${req.phone}`;
        }, 2000); // Show animation for 2 seconds

    } catch (error) {
        console.error("Failed to accept request:", error);
        alert("There was an error while accepting this request.");
    }
  };

  const filteredRequests = requests.filter((req) =>
    selectedGroup ? req.bloodGroup === selectedGroup : true
  );


  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <SuccessAnimation show={showSuccess} />
      <Confetti show={showSuccess} />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
          Active Blood Requests
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Find an open request and offer to donate.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 mt-10">
              No open blood requests match your filters.
            </p>
          ) : (
            filteredRequests.map((req) => (
              <Card
                key={req.id}
                className="p-5 shadow-sm rounded-xl border hover:shadow-md flex flex-col"
              >
                <div className="flex-grow">
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
                </div>
                <Button
                  onClick={() => handleAcceptDonation(req)}
                  className="w-full bg-red-600 text-white hover:bg-red-700 mt-auto"
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