import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Donor {
    id: string;
    name?: string;
    email: string;
    city?: string;
    state?: string;
    bloodGroup?: string;
}

export default function FindDonors() {
    const [filters, setFilters] = useState({ bloodGroup: "", state: "" });
    const [donors, setDonors] = useState<Donor[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleFilterChange = (name: string, value: string) => {
        // If the user selects the "all" option, treat it as clearing the filter by setting state to ""
        const finalValue = value === "all" ? "" : value;
        setFilters(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setSearched(true);
        setDonors([]);

        try {
            // Base query for available donors
            let donorQuery = query(
                collection(db, "users"),
                where("availability", "==", true)
            );

            // Add filters if they exist and are not empty
            if (filters.bloodGroup) {
                donorQuery = query(donorQuery, where("bloodGroup", "==", filters.bloodGroup));
            }
            if (filters.state) {
                donorQuery = query(donorQuery, where("state", "==", filters.state));
            }

            const querySnapshot = await getDocs(donorQuery);
            const donorsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Donor));
            
            setDonors(donorsData);

        } catch (error) {
            console.error("Error searching for donors:", error);
            alert("Could not perform search. You may need to create a composite index in Firestore for this query to work.");
        } finally {
            setLoading(false);
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
        <div className="min-h-screen bg-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600">
                    Find a Donor
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Search for available donors by blood group and state.
                </p>

                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 p-4 border rounded-lg bg-gray-50">
                    <Select onValueChange={(value) => handleFilterChange("bloodGroup", value)} value={filters.bloodGroup}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Select Blood Group" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any Blood Group</SelectItem>
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
                    
                    <Select onValueChange={(value) => handleFilterChange("state", value)} value={filters.state}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">Any State</SelectItem>
                           {indianStates.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}
                        </SelectContent>
                    </Select>


                    <Button type="submit" disabled={loading || (!filters.bloodGroup && !filters.state)} className="w-full sm:w-auto">
                        {loading ? "Searching..." : "Search"}
                    </Button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searched && !loading && donors.length === 0 && (
                        <p className="col-span-full text-center text-gray-500 mt-10">
                            No available donors found matching your criteria.
                        </p>
                    )}
                    {donors.map((donor) => (
                        <Card key={donor.id} className="p-5 shadow-sm rounded-xl border">
                             <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {donor.name || "Anonymous Donor"}
                            </h3>
                             <p className="text-sm text-gray-600 mb-1">
                                🩸 Blood Group: <strong>{donor.bloodGroup}</strong>
                            </p>
                             <p className="text-sm text-gray-600 mb-1">
                                📍 City: {donor.city}
                            </p>
                            <p className="text-sm text-gray-600 mb-4">
                                📍 State: {donor.state}
                            </p>
                            <Button className="w-full bg-green-600 text-white hover:bg-green-700" onClick={() => alert("In a future step, this will send a direct notification.")}>
                                Send Request
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}