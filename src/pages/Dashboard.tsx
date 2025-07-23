import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
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
      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) return <div className="text-center py-10">Loading dashboard...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
        Welcome, {profile?.name || "Donor"}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
        <div className="bg-red-100 border border-red-200 p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold text-red-700">Blood Group</h2>
          <p className="text-3xl font-bold">{profile?.bloodGroup || "--"}</p>
        </div>

        <div className="bg-blue-100 border border-blue-200 p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold text-blue-700">Total Donations</h2>
          <p className="text-3xl font-bold">--</p> {/* Replace with real count */}
        </div>

        <div className="bg-green-100 border border-green-200 p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold text-green-700">Next Eligible</h2>
          <p className="text-3xl font-bold">--</p> {/* Replace with real date */}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
        <div className="p-6 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-2">🩸 Donate Now</h2>
          <p className="text-sm mb-4">Browse current requests and save a life in your locality.</p>
          <Button onClick={() => navigate("/donate")} className="bg-white text-red-700 hover:bg-gray-100 w-full">
            View Requests
          </Button>
        </div>

        <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-2">📥 Request Blood</h2>
          <p className="text-sm mb-4">Need urgent help? Post a verified blood request now.</p>
          <Button onClick={() => navigate("/request")} className="bg-white text-blue-700 hover:bg-gray-100 w-full">
            Post Request
          </Button>
        </div>
      </div>
    </div>
  );
}
