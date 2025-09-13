import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    if (currentUser) {
      navigate(path);
    } else {
      navigate("/login", { state: { redirectTo: path } });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-red-50 py-20 md:py-32">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('/blood-donation-pattern.svg')" }}
        ></div>
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-4 leading-tight">
            Connect to Save Lives
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Jeevan Rakshak is a real-time platform connecting blood donors with
            recipients instantly. Be a hero, save a life today.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button
              onClick={() => handleNavigation("/request-blood")}
              size="lg"
              className="bg-red-600 text-white hover:bg-red-700 text-lg px-8 py-6 rounded-full shadow-lg"
            >
              🩸 Post a Request
            </Button>
            <Button
              onClick={() => handleNavigation("/donate")}
              size="lg"
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-100 hover:text-red-700 text-lg px-8 py-6 rounded-full shadow-lg"
            >
              ❤️ Find a Donor
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 text-3xl mb-4 mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Request Blood</h3>
              <p className="text-gray-600">
                Create a blood request with patient details. Our system will
                instantly notify all matching donors in your area.
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 text-3xl mb-4 mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Notified</h3>
              <p className="text-gray-600">
                Donors receive a real-time notification about the urgent need
                and can accept the request with a single tap.
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 text-3xl mb-4 mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Save a Life</h3>
              <p className="text-gray-600">
                The donor connects directly with the requester to coordinate the
                donation, making a timely and life-saving impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="text-4xl font-bold text-red-600">10,000+</h4>
              <p className="text-gray-600">Registered Donors</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold text-red-600">5,000+</h4>
              <p className="text-gray-600">Lives Saved</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold text-red-600">Under 10 Mins</h4>
              <p className="text-gray-600">Average Response Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Become a Donor Today
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Your single act of kindness can be a ray of hope for someone in
            need. Register as a donor and join our community of life-savers.
          </p>
          <Button
            onClick={() => navigate("/register")}
            size="lg"
            className="bg-red-600 text-white hover:bg-red-700 text-lg px-10 py-6 rounded-full shadow-lg"
          >
            Join Now
          </Button>
        </div>
      </section>
    </div>
  );
}