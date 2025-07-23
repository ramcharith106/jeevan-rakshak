import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

export default function GoogleLoginButton() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        // New user — navigate to onboarding
        navigate("/onboarding");
      } else {
        // Existing user
        navigate("/dashboard");
      }
    } catch (err) {
      alert("Login failed.");
      console.error(err);
    }
  };

  return (
    <Button
      onClick={handleLogin}
      className="bg-blue-600 hover:bg-blue-700 text-white w-full"
    >
      🔐 Sign in with Google
    </Button>
  );
}
