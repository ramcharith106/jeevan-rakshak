import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchUserDashboardData,
  updateUserAvailability,
  markRequestAsFulfilled,
  logExternalDonation,
} from "@/lib/firestore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SuccessAnimation } from "@/components/ui/SuccessAnimation";
import { Confetti } from "@/components/ui/Confetti";
import { NotificationManager } from "@/components/ui/NotificationManager";


// New component for the external donation form
const LogExternalDonationForm = ({ onSave }: { onSave: () => void }) => {
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({ date: '', location: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentUser || !formData.date || !formData.location) {
            alert("Please fill in all fields.");
            return;
        }
        setLoading(true);
        try {
            await logExternalDonation(formData, currentUser);
            setFormData({ date: '', location: '' }); // Reset form
            onSave(); // This will close the dialog and refresh data
        } catch (error) {
            console.error("Failed to log external donation", error);
            alert("There was an error saving your donation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">Date</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Location</Label>
                <Input id="location" name="location" placeholder="e.g., City Hospital Blood Bank" value={formData.location} onChange={handleChange} className="col-span-3" required />
            </div>
             <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Donation"}</Button>
            </DialogFooter>
        </form>
    );
};


export default function Dashboard() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isLogDonationOpen, setIsLogDonationOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
  
    const { profile, requests, donations } = await fetchUserDashboardData(currentUser.uid);
    setProfile(profile);
    setRequests(requests);
    setDonations(donations);
    if (profile) {
      setIsAvailable(profile.availability !== false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if(currentUser) {
        setLoading(true);
        loadData();
    }
  }, [currentUser, navigate]);

  const handleMarkFulfilledClick = async (request: any) => {
    await markRequestAsFulfilled(request);
    setShowSuccess(true);
    setTimeout(() => {
        setShowSuccess(false);
        loadData();
    }, 2000);
  };
  
  const handleAvailabilityChange = async (checked: boolean) => {
    if (!currentUser) return;
    setIsAvailable(checked);
    await updateUserAvailability(currentUser.uid, checked);
  };
  
  const onDonationSave = () => {
      setIsLogDonationOpen(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        loadData();
      }, 2000)
  }

  if (loading) return <div className="text-center py-10">Loading dashboard...</div>;
  
  const getStatusComponent = (status: string) => {
    switch (status) {
      case "open":
        return <span className="font-semibold text-blue-600">Open</span>;
      case "pending_fulfillment":
        return <span className="font-semibold text-yellow-600">Pending Confirmation</span>;
      case "fulfilled":
        return <span className="font-semibold text-green-600">Fulfilled</span>;
      default:
        return <span className="font-semibold text-gray-500">Unknown</span>
    }
  }


  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <SuccessAnimation show={showSuccess} />
      <Confetti show={showSuccess} />
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
          Welcome, {profile?.name || currentUser?.displayName || "Donor"}
        </h1>
        <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg border">
          <Switch id="availability-mode" checked={isAvailable} onCheckedChange={handleAvailabilityChange} />
          <Label htmlFor="availability-mode" className="font-medium">{isAvailable ? "Available for Requests" : "Unavailable for Requests"}</Label>
        </div>
      </div>
      
      {/* Notification Card */}
      <Card className="mb-8 bg-blue-50 border-blue-200">
        <CardHeader>
            <CardTitle>Stay Updated</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-gray-700 mb-4">Enable browser notifications to get instant alerts for new blood requests in your state.</p>
            <NotificationManager />
        </CardContent>
      </Card>


      {/* ✅ Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
        <div className="bg-red-100 border border-red-200 p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold text-red-700">Blood Group</h2>
          <p className="text-3xl font-bold">{profile?.bloodGroup || "--"}</p>
        </div>
        <div className="bg-blue-100 border border-blue-200 p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold text-blue-700">Donations Made</h2>
          <p className="text-3xl font-bold">{profile?.donationCount || 0}</p>
        </div>
        <div className="bg-green-100 border border-green-200 p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold text-green-700">Your Requests</h2>
          <p className="text-3xl font-bold">{requests.length}</p>
        </div>
      </div>

      {/* ✅ Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
        <div className="p-6 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-2">🩸 Donate Now</h2>
          <p className="text-sm mb-4">
            Browse current requests and save a life in your locality.
          </p>
          <Button
            onClick={() => navigate("/donate")}
            className="bg-white text-red-700 hover:bg-gray-100 w-full"
          >
            View Requests
          </Button>
        </div>

        <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-2">📥 Request Blood</h2>
          <p className="text-sm mb-4">
            Need urgent help? Post a verified blood request now.
          </p>
          <Button
            onClick={() => navigate("/request")}
            className="bg-white text-blue-700 hover:bg-gray-100 w-full"
          >
            Post Request
          </Button>
        </div>
      </div>

      {/* ✅ Request History */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-red-600">📝 Your Blood Requests</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.length === 0 ? (
            <p className="text-gray-500">No blood requests made yet.</p>
          ) : (
            requests.map((req) => (
              <Card key={req.id} className="p-4 border relative">
                <p><strong>Patient:</strong> {req.name}</p>
                <p><strong>Blood Group:</strong> {req.bloodGroup}</p>
                <p><strong>Hospital:</strong> {req.hospital}</p>
                <p><strong>Status:</strong>{" "}{getStatusComponent(req.status)}</p>
                {req.status === 'pending_fulfillment' && (
                    <p className="text-sm text-gray-800 bg-yellow-100 p-2 rounded-md mt-2">
                        <strong>Donor:</strong> {req.donorName} has accepted.
                    </p>
                )}

                {req.status !== 'fulfilled' && (
                  <Button
                    className="mt-3 bg-green-600 text-white hover:bg-green-700 w-full"
                    onClick={() => handleMarkFulfilledClick(req)}
                  >
                    ✅ Mark as Fulfilled
                  </Button>
                )}
              </Card>
            ))
          )}
        </div>
      </div>

      {/* ✅ Donation History */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-green-600">❤️ Your Donation History</h2>
            <Dialog open={isLogDonationOpen} onOpenChange={setIsLogDonationOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">Log External Donation</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Log an External Donation</DialogTitle>
                    <DialogDescription>
                        Add a record of a donation you made outside of this platform. This will not affect your leaderboard rank.
                    </DialogDescription>
                    </DialogHeader>
                    <LogExternalDonationForm onSave={onDonationSave} />
                </DialogContent>
            </Dialog>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {donations.length === 0 ? (
            <p className="text-gray-500">No donations recorded yet.</p>
          ) : (
            donations.map((donation) => (
              <Card key={donation.id} className="p-4 border">
                <p>
                    <strong>
                        {donation.type === 'external' ? 'External Donation' : `Recipient: ${donation.recipientName}`}
                    </strong>
                </p>
                <p><strong>Location:</strong> {donation.hospital || donation.location || "N/A"}</p>
                <p>
                  <strong>Date:</strong>{" "}
                  {donation.date || (donation.createdAt?.seconds ? new Date(donation.createdAt.seconds * 1000).toLocaleDateString() : "--")}
                </p>
                <p><strong>Status:</strong>{" "}
                    {donation.status === 'completed' ? (
                        <span className="font-semibold text-green-600">Completed</span>
                    ) : (
                        <span className="font-semibold text-yellow-600">Pending</span>
                    )}
                </p>
                 {donation.type === 'external' && (
                    <p className="text-xs font-semibold text-gray-500 mt-2 p-1 bg-gray-100 rounded-sm inline-block">Self-Reported</p>
                 )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}