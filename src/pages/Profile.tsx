// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "@/lib/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const user = getCurrentUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        setUserData({
          email: user.email,
          name: user.displayName || "No name set",
        });
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!userData) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md p-6 rounded-lg border border-gray-200">
      <h1 className="text-2xl font-bold mb-4 text-center text-red-600">👤 Profile Information</h1>
      <div className="space-y-2 text-sm text-gray-700">
        <p><strong>Email:</strong> {userData.email}</p>
        {userData.name && <p><strong>Name:</strong> {userData.name}</p>}
        {userData.phone && <p><strong>Phone:</strong> {userData.phone}</p>}
        {userData.aadhaar && <p><strong>Aadhaar:</strong> {userData.aadhaar}</p>}
        {userData.address && <p><strong>Address:</strong> {userData.address}</p>}
        {userData.dob && <p><strong>Date of Birth:</strong> {userData.dob}</p>}
        {userData.weight && <p><strong>Weight:</strong> {userData.weight} kg</p>}
        {userData.bloodGroup && <p><strong>Blood Group:</strong> {userData.bloodGroup}</p>}
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
