import { useEffect, useState } from "react";
import { logout } from "@/lib/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        // Fallback for user data not found in Firestore
        setUserData({
          email: currentUser.email,
          name: currentUser.displayName || "No name set",
        });
      }
      setLoading(false);
    };

    if (currentUser) {
        fetchUser();
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md p-6 rounded-lg border border-gray-200">
      <h1 className="text-2xl font-bold mb-4 text-center text-red-600">👤 Profile Information</h1>
      <div className="space-y-2 text-sm text-gray-700">
        <p><strong>Email:</strong> {userData.email}</p>
        {userData.name && <p><strong>Name:</strong> {userData.name}</p>}
        {userData.bloodGroup && <p><strong>Blood Group:</strong> {userData.bloodGroup}</p>}
        {userData.donationCount > 0 && <p><strong>Total Donations:</strong> <span className="font-bold text-lg text-blue-600">{userData.donationCount}</span></p>}
        {userData.phone && <p><strong>Phone:</strong> {userData.phone}</p>}
        {userData.aadhaar && <p><strong>Aadhaar:</strong> {userData.aadhaar}</p>}
        {userData.address && <p><strong>Address:</strong> {userData.address}</p>}
        {userData.city && <p><strong>City:</strong> {userData.city}</p>}
        {userData.state && <p><strong>State:</strong> {userData.state}</p>}
        {userData.dob && <p><strong>Date of Birth:</strong> {userData.dob}</p>}
        {userData.weight && <p><strong>Weight:</strong> {userData.weight} kg</p>}
        {userData.healthInfo && <p><strong>Health Info:</strong> {userData.healthInfo}</p>}
        {userData.emergencyContact1 && (
          <p><strong>Emergency Contact 1:</strong> {userData.emergencyContact1}</p>
        )}
        {userData.emergencyContact2 && (
          <p><strong>Emergency Contact 2:</strong> {userData.emergencyContact2}</p>
        )}
      </div>

      <Button
        onClick={handleLogout}
        className="mt-6 bg-red-600 hover:bg-red-700 text-white w-full"
      >
        🚪 Sign Out
      </Button>
    </div>
  );
}