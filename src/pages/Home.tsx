import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20 px-4 bg-gradient-to-b from-red-50 to-blue-50">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
          Save Lives Through Blood Donation
        </h1>
        <p className="text-lg text-gray-700 mt-4 max-w-2xl mx-auto">
          Join our community of donors and recipients. Help someone in need today.
        </p>

        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/donate"
            className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-red-700 transition"
          >
            Donate Now
          </Link>
          <Link
            to="/request"
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-blue-700 transition"
          >
            Request Blood
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 text-center bg-white">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Our Impact Across India
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div>
            <p className="text-3xl font-bold text-red-600">blooming</p>
            <p className="text-sm text-gray-600">Registered Donors</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">10s+ of</p>
            <p className="text-sm text-gray-600">Requests Fulfilled</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-red-600">2H</p>
            <p className="text-sm text-gray-600">Average Response Time</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">all</p>
            <p className="text-sm text-gray-600">Cities Served</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-red-50">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">
          Why Choose Jeevan-Rakshak?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white shadow-md p-6 rounded-xl text-center">
            <h3 className="text-lg font-bold text-red-600">Direct Donor Connection</h3>
            <p className="text-sm text-gray-700 mt-2">
              Reach verified blood donors directly in your locality with one click.
            </p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-xl text-center">
            <h3 className="text-lg font-bold text-red-600">Safe & Verified Requests</h3>
            <p className="text-sm text-gray-700 mt-2">
              All requests are reviewed for authenticity to ensure genuine need.
            </p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-xl text-center">
            <h3 className="text-lg font-bold text-red-600">Real-Time Notifications</h3>
            <p className="text-sm text-gray-700 mt-2">
              Donors are notified instantly when a nearby request matches their blood group.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
