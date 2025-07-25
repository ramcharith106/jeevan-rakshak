// 1. Register.tsx (new page in src/pages/Register.tsx)

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const user = await registerUser(data.email, data.password);
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: data.email,
        phone: data.phone,
        aadhaar: data.aadhaar,
        dob: data.dob,
        bloodGroup: data.bloodGroup,
        weight: data.weight,
        address: data.address,
        emergencyContact1: data.emergencyContact1,
        emergencyContact2: data.emergencyContact2,
        healthConditions: data.healthConditions,
      });
      navigate("/dashboard");
    } catch (error) {
      alert("Registration failed. Check console.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-4">Blood Donation Registration</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("email", { required: true })} placeholder="Email" className="w-full border p-2" />
        <input {...register("password", { required: true })} placeholder="Password" type="password" className="w-full border p-2" />
        <input {...register("phone", { required: true })} placeholder="Phone Number" className="w-full border p-2" />
        <input {...register("aadhaar", { required: true })} placeholder="Aadhaar Number" className="w-full border p-2" />
        <input {...register("dob", { required: true })} type="date" className="w-full border p-2" />

        <select {...register("bloodGroup", { required: true })} className="w-full border p-2">
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <input {...register("weight", { required: true })} placeholder="Weight in KG" className="w-full border p-2" />
        <textarea {...register("address", { required: true })} placeholder="Full Address" className="w-full border p-2" />
        <input {...register("emergencyContact1", { required: true })} placeholder="Emergency Contact 1" className="w-full border p-2" />
        <input {...register("emergencyContact2", { required: true })} placeholder="Emergency Contact 2" className="w-full border p-2" />
        <textarea {...register("healthConditions")}
          placeholder="Any health conditions (optional)"
          className="w-full border p-2"
        />
        <button type="submit" className="w-full bg-red-500 text-white py-2 rounded">Register</button>
      </form>
    </div>
  );
}
