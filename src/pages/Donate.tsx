import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { acceptRequest, fetchOpenRequests, updateUserLastCheckedNotifications } from "@/lib/firestore";
import { SuccessAnimation } from "@/components/ui/SuccessAnimation";
import { Confetti } from "@/components/ui/Confetti";

interface Request {
  id: string;
  name: string;
  relationship: string;
  bloodGroup: string;
  units: number;
  hospital: string;
  location: string;
  urgency: string;
  condition: string;
  phone: string;
  date: string;
  userId: string; // Creator of the request
  donorId?: string; // ID of the donor who accepted
  status?: "open" | "pending_fulfillment" | "fulfilled";
}

export default function Donate() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadOpenRequests = async () => {
      if (!currentUser) {
        navigate("/login", { state: { redirectTo: location.pathname } });
        return;
      }
      
      const openRequestsData = await fetchOpenRequests();
      const filteredData = openRequestsData.filter(req => req.userId !== currentUser.uid);
      setRequests(filteredData as Request[]);
      
      await updateUserLastCheckedNotifications(currentUser.uid);
    };

    if (currentUser) {
      loadOpenRequests();
    }
  }, [currentUser, navigate, location.pathname]);

  const handleAcceptDonation = async () => {
    if (!selectedRequest || !currentUser) {
      alert("You must be logged in to accept a request.");
      return;
    }

    try {
        await acceptRequest(selectedRequest, currentUser);
        
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setRequests((prev) =>
              prev.map((r) =>
                r.id === selectedRequest.id
                  ? { ...r, status: "pending_fulfillment", donorId: currentUser.uid }
                  : r
              )
            );
            window.location.href = `tel:${selectedRequest.phone}`;
            setSelectedRequest(null); // Close the dialog
        }, 2000);

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
              onClick={() => setSelectedGroup((prev) => (prev === group ? null : group))}
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
              <Card key={req.id} className="p-5 shadow-sm rounded-xl border hover:shadow-md flex flex-col">
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-bloodRed mb-2">{req.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">🩸 Blood Group: <strong>{req.bloodGroup}</strong></p>
                  <p className="text-sm text-gray-600 mb-1">🏥 Hospital: {req.hospital}</p>
                  <p className="text-sm text-gray-600 mb-1">📍 Location: {req.location}</p>
                  <p className="text-sm text-gray-600 mb-1">
                    ⚠️ Urgency:{" "}
                    <span className={`font-semibold ${
                        req.urgency === "Critical" ? "text-red-600" : req.urgency === "Urgent" ? "text-yellow-600" : "text-blue-600"
                      }`}>{req.urgency}</span>
                  </p>
                  <p className="text-sm text-gray-600 mb-4">📅 Needed By: {req.date}</p>
                </div>
                
                {req.status === "pending_fulfillment" ? (
                  <Button disabled className="w-full bg-yellow-500 text-white mt-auto cursor-not-allowed">
                    {req.donorId === currentUser?.uid ? "✅ You Accepted" : "Pending Fulfillment"}
                  </Button>
                ) : (
                  <Button onClick={() => setSelectedRequest(req)} className="w-full bg-red-600 text-white hover:bg-red-700 mt-auto">
                    View Details & Accept
                  </Button>
                )}
              </Card>
            ))
          )}
        </div>
      </div>

      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Donation for {selectedRequest.name}</DialogTitle>
              <DialogDescription>
                Please review the request details below. By confirming, you commit to donating.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-sm">
              <div className="grid grid-cols-2 items-center gap-4">
                <p className="text-gray-500">Patient</p>
                <p className="font-semibold">{selectedRequest.name} ({selectedRequest.relationship})</p>
              </div>
               <div className="grid grid-cols-2 items-center gap-4">
                <p className="text-gray-500">Blood Group</p>
                <p className="font-semibold text-red-600">{selectedRequest.bloodGroup}</p>
              </div>
               <div className="grid grid-cols-2 items-center gap-4">
                <p className="text-gray-500">Units Needed</p>
                <p className="font-semibold">{selectedRequest.units}</p>
              </div>
              <hr />
              <div className="grid grid-cols-2 items-center gap-4">
                <p className="text-gray-500">Hospital</p>
                <p className="font-semibold">{selectedRequest.hospital}</p>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <p className="text-gray-500">Location</p>
                <p className="font-semibold">{selectedRequest.location}</p>
              </div>
              <hr />
               <div className="grid grid-cols-1 items-center gap-2">
                <p className="text-gray-500">Medical Condition/Note</p>
                <p className="font-semibold p-2 bg-gray-50 rounded-md">
                  {selectedRequest.condition || "No additional notes."}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>Cancel</Button>
              <Button onClick={handleAcceptDonation} className="bg-red-600 hover:bg-red-700 text-white">
                📞 Confirm & Call
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}