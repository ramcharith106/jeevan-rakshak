import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Request from "./pages/RequestBlood";
import Donate from "./pages/Donate";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Navbar from "./components/ui/NavBar";
import Footer from "./components/ui/Footer";
import Profile from "@/pages/Profile";
import FindDonors from "@/pages/FindDonors";
import OnboardingForm from "./pages/OnboardingForm";
import CampsAndBanks from "./pages/CampsAndBanks";
import Leaderboard from "./pages/Leaderboard";
import Admin from "./pages/Admin";
import Learn from "./pages/Learn";
import { Toaster } from "@/components/ui/toaster"; // Import the Toaster

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<OnboardingForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/request" element={<Request />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/find-donors" element={<FindDonors />} />
          <Route path="/camps-and-banks" element={<CampsAndBanks />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      <Toaster /> {/* Add the Toaster component here */}
    </div>
  );
}

export default App;