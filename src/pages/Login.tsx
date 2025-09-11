import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser, registerUser, signInWithGoogle } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    phone: "",
    aadhaar: "",
    address: "",
    city: "",
    state: "",
    dob: "",
    weight: "",
    bloodGroup: "",
    healthInfo: "",
    emergencyContact1: "",
    emergencyContact2: "",
  });
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isRegistering) {
      setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setRegisterForm({ ...registerForm, [name]: value });
  };


  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await loginUser(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError("❌ Invalid email or password.");
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await registerUser(registerForm);
      navigate("/dashboard");
    } catch (err) {
      setError("❌ Registration failed. User may already exist.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { isNewUser } = await signInWithGoogle();
      if (isNewUser) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("❌ Google login failed.");
      console.error(err);
    }
  };

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", 
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", 
    "West Bengal"
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="max-w-md w-full p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
          🔐 {isRegistering ? "Register" : "Login"} to Jeevan-Rakshak
        </h2>

        {error && <div className="text-red-600 text-sm mt-4 text-center">{error}</div>}

        {isRegistering ? (
          <form onSubmit={handleRegister} className="mt-6 grid gap-4">
            <Input name="email" type="email" placeholder="Email" required value={registerForm.email} onChange={handleChange} />
            <Input name="password" type="password" placeholder="Password (min 6 chars)" required value={registerForm.password} onChange={handleChange} />
            <Input name="phone" placeholder="Phone Number" required value={registerForm.phone} onChange={handleChange} />
            <Input name="aadhaar" placeholder="Aadhaar Number" required value={registerForm.aadhaar} onChange={handleChange} />
            <Input name="address" placeholder="Full Address" required value={registerForm.address} onChange={handleChange} />
            <Input name="city" placeholder="City" required value={registerForm.city} onChange={handleChange} />
            <Select onValueChange={(value) => handleSelectChange("state", value)} value={registerForm.state} required>
                <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                <SelectContent>
                    {indianStates.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}
                </SelectContent>
            </Select>
            <Input name="dob" type="date" placeholder="Date of Birth" required value={registerForm.dob} onChange={handleChange} />
            <Input name="weight" type="number" placeholder="Weight (kg)" required value={registerForm.weight} onChange={handleChange} />

            <Select onValueChange={(value) => handleSelectChange("bloodGroup", value)} value={registerForm.bloodGroup} required>
                <SelectTrigger><SelectValue placeholder="Select Blood Group" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
            </Select>

            <Input name="healthInfo" placeholder="Allergies or Health Conditions" value={registerForm.healthInfo} onChange={handleChange} />
            <Input name="emergencyContact1" placeholder="Emergency Contact 1 (Name & Phone)" required value={registerForm.emergencyContact1} onChange={handleChange} />
            <Input name="emergencyContact2" placeholder="Emergency Contact 2 (Name & Phone)" value={registerForm.emergencyContact2} onChange={handleChange} />

            <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
              Register
            </Button>
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