// src/pages/Login.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser, registerUser, signInWithGoogle } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ email: "", password: "", phone: "", aadhaar: "", address: "" });
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleChange = (e: any) => {
    if (isRegistering) {
      setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleEmailLogin = async (e: any) => {
    e.preventDefault();
    try {
      await loginUser(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError("❌ Invalid email or password.");
    }
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    try {
      await registerUser(registerForm);
      navigate("/dashboard");
    } catch (err) {
      setError("❌ Registration failed. Aadhaar may already exist.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError("❌ Google login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
          🔐 {isRegistering ? "Register" : "Login"} to Jeevan-Rakshak
        </h2>

        {error && <div className="text-red-600 text-sm mt-4">{error}</div>}

        {isRegistering ? (
          <form onSubmit={handleRegister} className="mt-6 grid gap-4">
            <Input name="email" type="email" placeholder="Email" required value={registerForm.email} onChange={handleChange} />
            <Input name="password" type="password" placeholder="Password" required value={registerForm.password} onChange={handleChange} />
            <Input name="phone" placeholder="Phone Number" required value={registerForm.phone} onChange={handleChange} />
            <Input name="aadhaar" placeholder="Aadhaar Number" required value={registerForm.aadhaar} onChange={handleChange} />
            <Input name="address" placeholder="Address" required value={registerForm.address} onChange={handleChange} />
            <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">Register</Button>
          </form>
        ) : (
          <>
            <form onSubmit={handleEmailLogin} className="mt-6 grid gap-4">
              <Input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} />
              <Input name="password" type="password" placeholder="Password" required value={form.password} onChange={handleChange} />
              <Button type="submit" className="bg-red-600 text-white hover:bg-red-700">Login</Button>
            </form>

            <div className="my-4 text-center text-gray-400">or</div>

            <Button onClick={handleGoogleLogin} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
              🟢 Sign in with Google
            </Button>
          </>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          {isRegistering ? (
            <>Already have an account? <button onClick={() => setIsRegistering(false)} className="text-blue-600 hover:underline">Login</button></>
          ) : (
            <>Don't have an account? <button onClick={() => setIsRegistering(true)} className="text-blue-600 hover:underline">Register</button></>
          )}
        </p>
      </div>
    </div>
  );
}
