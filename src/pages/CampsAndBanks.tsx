import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface BloodBank {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
}

interface DonationCamp {
  id: string;
  organizer: string;
  date: string;
  time: string;
  address: string;
}


export default function CampsAndBanks() {
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [donationCamps, setDonationCamps] = useState<DonationCamp[]>([]);
  const [loading, setLoading] = useState({ banks: true, camps: true });

  useEffect(() => {
    const fetchBloodBanks = async () => {
      try {
        const q = query(collection(db, "blood_banks"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const banksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as BloodBank));
        setBloodBanks(banksData);
      } catch (error) {
        console.error("Error fetching blood banks:", error);
      } finally {
        setLoading(prev => ({ ...prev, banks: false }));
      }
    };
    
    const fetchDonationCamps = async () => {
      try {
        const q = query(collection(db, "donation_camps"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const campsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as DonationCamp));
        setDonationCamps(campsData);
      } catch (error) {
        console.error("Error fetching donation camps:", error);
      } finally {
        setLoading(prev => ({ ...prev, camps: false }));
      }
    };

    fetchBloodBanks();
    fetchDonationCamps();
  }, []);


  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
          Camps & Blood Banks
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Find official blood banks and upcoming donation camps near you.
        </p>

        <Tabs defaultValue="camps" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="camps">Donation Camps</TabsTrigger>
            <TabsTrigger value="banks">Blood Banks</TabsTrigger>
          </TabsList>
          <TabsContent value="camps" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading.camps ? (
                 <p className="col-span-full text-center">Loading camps...</p>
              ) : donationCamps.length > 0 ? (
                donationCamps.map((camp) => (
                  <Card key={camp.id}>
                    <CardHeader>
                      <CardTitle>{camp.organizer}</CardTitle>
                      <CardDescription>{camp.address}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-2 text-sm">
                      <p><strong>Date:</strong> {new Date(camp.date).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {camp.time}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">View on Map</Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <p className="col-span-full text-center">No upcoming camps have been added yet.</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="banks" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {loading.banks ? (
                 <p className="col-span-full text-center">Loading blood banks...</p>
              ) : bloodBanks.length > 0 ? (
                bloodBanks.map((bank) => (
                 <Card key={bank.id}>
                 <CardHeader>
                   <CardTitle>{bank.name}</CardTitle>
                   <CardDescription>{bank.address}</CardDescription>
                 </CardHeader>
                 <CardContent className="grid gap-2 text-sm">
                   <p><strong>Hours:</strong> {bank.hours}</p>
                 </CardContent>
                 <CardFooter>
                   <a href={`tel:${bank.phone}`} className="w-full">
                     <Button className="w-full">Call Now</Button>
                   </a>
                 </CardFooter>
               </Card>
              ))
               ) : (
                <p className="col-span-full text-center">No blood banks have been added yet.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}