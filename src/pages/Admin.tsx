import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Define the admin email address
const ADMIN_EMAIL = "allurucharith@gmail.com";

// Form component for adding a new Blood Bank
const AddBankForm = ({ onBack }: { onBack: () => void }) => {
    const [formData, setFormData] = useState({ name: "", address: "", phone: "", hours: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);
        try {
            await addDoc(collection(db, "blood_banks"), {
                ...formData,
                createdAt: Timestamp.now(),
            });
            setMessage("Successfully added new blood bank!");
            setFormData({ name: "", address: "", phone: "", hours: "" }); // Reset form
        } catch (error) {
            console.error("Error adding blood bank:", error);
            setMessage("Failed to add blood bank.");
        } finally {
            setLoading(false);
        }
    };

    return (
         <Card>
            <CardHeader>
                <CardTitle>New Blood Bank</CardTitle>
                <CardDescription>Enter the details for a new blood bank.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Bank Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="hours">Operating Hours</Label>
                        <Input id="hours" name="hours" value={formData.hours} onChange={handleChange} required />
                    </div>
                    <div className="flex gap-2">
                         <Button type="button" variant="outline" onClick={onBack} className="w-full">Back</Button>
                         <Button type="submit" disabled={loading} className="w-full">{loading ? "Adding..." : "Add Blood Bank"}</Button>
                    </div>
                    {message && <p className="text-sm text-center text-green-600">{message}</p>}
                </form>
            </CardContent>
        </Card>
    );
};

// Form component for adding a new Donation Camp
const AddCampForm = ({ onBack }: { onBack: () => void }) => {
    const [formData, setFormData] = useState({ organizer: "", date: "", time: "", address: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);
        try {
            await addDoc(collection(db, "donation_camps"), {
                ...formData,
                createdAt: Timestamp.now(),
            });
            setMessage("Successfully added new donation camp!");
            setFormData({ organizer: "", date: "", time: "", address: "" }); // Reset form
        } catch (error) {
            console.error("Error adding donation camp:", error);
            setMessage("Failed to add donation camp.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle>New Donation Camp</CardTitle>
                <CardDescription>Enter the details for an upcoming donation camp.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="organizer">Organizer</Label>
                        <Input id="organizer" name="organizer" value={formData.organizer} onChange={handleChange} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="time">Time</Label>
                        <Input id="time" name="time" placeholder="e.g., 10:00 AM - 4:00 PM" value={formData.time} onChange={handleChange} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                    </div>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={onBack} className="w-full">Back</Button>
                        <Button type="submit" disabled={loading} className="w-full">{loading ? "Adding..." : "Add Donation Camp"}</Button>
                    </div>
                    {message && <p className="text-sm text-center text-green-600">{message}</p>}
                </form>
            </CardContent>
        </Card>
    );
};


export default function Admin() {
    const { currentUser, loading } = useAuth();
    const [view, setView] = useState<'camps' | 'banks' | null>(null);
    const navigate = useNavigate();

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    // Security check
    if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center">
                <div>
                    <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
                    <p className="mt-2 text-gray-600">You do not have permission to view this page.</p>
                    <Button onClick={() => navigate('/')} className="mt-4">Go to Home</Button>
                </div>
            </div>
        );
    }
    
    // Render the correct view based on state
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-xl mx-auto">
                 <h1 className="text-4xl font-extrabold text-center mb-2">
                    Admin Panel
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Manage platform data.
                </p>
                
                {!view && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button onClick={() => setView('camps')} className="h-24 text-lg">Add Camps</Button>
                        <Button onClick={() => setView('banks')} className="h-24 text-lg">Add Banks</Button>
                    </div>
                )}

                {view === 'camps' && <AddCampForm onBack={() => setView(null)} />}
                {view === 'banks' && <AddBankForm onBack={() => setView(null)} />}
            </div>
        </div>
    );
}