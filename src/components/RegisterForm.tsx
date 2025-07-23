import { useForm } from "react-hook-form";
import { useState } from "react";
import { registerUser } from "@/lib/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormData {
  email: string;
  password: string;
  aadhaar: string;
  phone: string;
  address: string;
}

export default function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError("");
      const user = await registerUser(data.email, data.password);
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: data.email,
        phone: data.phone,
        aadhaar: data.aadhaar,
        address: data.address,
        createdAt: new Date(),
      });
      reset();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Email" type="email" {...register("email")} required />
      <Input placeholder="Password" type="password" {...register("password")} required />
      <Input placeholder="Aadhaar Number" {...register("aadhaar")} required />
      <Input placeholder="Phone Number" {...register("phone")} required />
      <Input placeholder="Address" {...register("address")} required />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button disabled={loading} className="w-full">
        {loading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}
