import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Donor {
  id: string;
  name?: string;
  city?: string;
  state?: string;
  donationCount?: number;
}

export default function Leaderboard() {
  const [topDonors, setTopDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopDonors = async () => {
      try {
        const usersRef = collection(db, "users");
        // Query for users with at least one donation, order by donationCount descending, and limit to top 10
        const q = query(
          usersRef,
          where("donationCount", ">", 0),
          orderBy("donationCount", "desc"),
          limit(10)
        );

        const querySnapshot = await getDocs(q);
        const donorsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Donor));
        
        setTopDonors(donorsData);
      } catch (error) {
        console.error("Error fetching top donors:", error);
        // This may fail if the Firestore index is not created yet.
      } finally {
        setLoading(false);
      }
    };

    fetchTopDonors();
  }, []);

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-500">
          🏆 Top Donors
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Celebrating our most dedicated life-savers. Thank you for your contributions!
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
            <CardDescription>
              Showing the top 10 donors based on the number of confirmed donations.
            </CardDescription>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Donations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Loading leaderboard...</TableCell>
                </TableRow>
              ) : topDonors.length > 0 ? (
                topDonors.map((donor, index) => (
                  <TableRow key={donor.id}>
                    <TableCell className="font-medium text-lg">#{index + 1}</TableCell>
                    <TableCell>{donor.name || "Anonymous Donor"}</TableCell>
                    <TableCell>{donor.city}{donor.state ? `, ${donor.state}` : ''}</TableCell>
                    <TableCell className="text-right font-bold text-lg text-blue-600">{donor.donationCount}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No donor data available yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}