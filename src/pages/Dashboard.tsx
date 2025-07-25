import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const user = getCurrentUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }

      // ✅ Fetch user requests
      const requestSnap = await getDocs(
        query(collection(db, "requests"), where("userId", "==", user.uid))
      );
      setRequests(requestSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      // ✅ Fetch user donations
      const donationSnap = await getDocs(
        query(collection(db, "donations"), where("userId", "==", user.uid))
      );
      setDonations(donationSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleMarkFulfilled = async (id: string) => {
    await updateDoc(doc(db, "requests", id), {
      fulfilled: true,
    });

    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, fulfilled: true } : r))
    );
  };

  if (loading) return <div className="text-center py-10">Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
        Welcome, {profile?.name || "Donor"}
      </h1>

      {/* ✅ Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
        <div className="bg-red-100 border border-red-200 p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold text-red-700">Blood Group</h2>
          <p className="text-3xl font-bold">{profile?.bloodGroup || "--"}</p>
        </div>
        <div className="bg-blue-100 border border-blue-200 p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold text-blue-700">Total Donations</h2>
          <p className="text-3xl font-bold">{donations.length}</p>
        </div>
        <div className="bg-green-100 border border-green-200 p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold text-green-700">Your Requests</h2>
          <p className="text-3xl font-bold">{requests.length}</p>
        </div>
      </div>

      {/* ✅ Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
        <div className="p-6 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-2">🩸 Donate Now</h2>
          <p className="text-sm mb-4">
            Browse current requests and save a life in your locality.
          </p>
          <Button
            onClick={() => navigate("/donate")}
            className="bg-white text-red-700 hover:bg-gray-100 w-full"
          >
            View Requests
          </Button>
        </div>

        <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-2">📥 Request Blood</h2>
          <p className="text-sm mb-4">
            Need urgent help? Post a verified blood request now.
          </p>
          <Button
            onClick={() => navigate("/request")}
            className="bg-white text-blue-700 hover:bg-gray-100 w-full"
          >
            Post Request
          </Button>
        </div>
      </div>

      {/* ✅ Request History */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-red-600">📝 Your Blood Requests</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.length === 0 ? (
            <p className="text-gray-500">No blood requests made yet.</p>
          ) : (
            requests.map((req) => (
              <Card key={req.id} className="p-4 border relative">
                <p><strong>Name:</strong> {req.name}</p>
                <p><strong>Blood Group:</strong> {req.bloodGroup}</p>
                <p><strong>Urgency:</strong> {req.urgency}</p>
                <p><strong>Hospital:</strong> {req.hospital}</p>
                <p><strong>Location:</strong> {req.location}</p>
                <p><strong>Date:</strong> {req.date}</p>
                <p><strong>Status:</strong>{" "}
                  {req.fulfilled ? (
                    <span className="text-green-600 font-semibold">Fulfilled</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">Pending</span>
                  )}
                </p>

                {!req.fulfilled && (
                  <Button
                    className="mt-3 bg-green-600 text-white hover:bg-green-700 w-full"
                    onClick={() => handleMarkFulfilled(req.id)}
                  >
                    ✅ Mark as Fulfilled
                  </Button>
                )}
              </Card>
            ))
          )}
        </div>
      </div>

      {/* ✅ Donation History */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-green-600">❤️ Your Donations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {donations.length === 0 ? (
            <p className="text-gray-500">No donations recorded yet.</p>
          ) : (
            donations.map((donation) => (
              <Card key={donation.id} className="p-4 border">
                <p><strong>Recipient:</strong> {donation.recipientName}</p>
                <p><strong>Blood Group:</strong> {donation.bloodGroup}</p>
                <p><strong>Hospital:</strong> {donation.hospital}</p>
                <p>
                  <strong>Date:</strong>{" "}
                  {donation.createdAt?.seconds
                    ? new Date(donation.createdAt.seconds * 1000).toLocaleDateString()
                    : "--"}
                </p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
