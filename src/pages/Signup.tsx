import { useState } from "react";
import { registerUser } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(email, password);
      alert("✅ Signup successful. Complete your profile.");
      navigate("/register");
    } catch (error: any) {
      console.error(error);
      alert("❌ " + (error.message || "Signup failed"));
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-bloodRed mb-6">Create Account</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="bg-bloodRed text-white w-full">
          Sign Up
        </Button>
      </form>
    </div>
  );
}
