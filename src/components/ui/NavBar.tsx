import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { logout } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, UserCircle, ShieldCheck } from "lucide-react";
import { NotificationBell } from "./NotificationBell";

const ADMIN_EMAIL = "allurucharith@gmail.com";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Home", to: "/" },
    { name: "Dashboard", to: "/dashboard" },
    { name: "Donate", to: "/donate" },
    { name: "Find Donors", to: "/find-donors" },
    { name: "Request Blood", to: "/request" },
    { name: "Camps & Banks", to: "/camps-and-banks" },
    { name: "Leaderboard", to: "/leaderboard" },
  ];
  
  const loggedOutNavItems = [
    { name: "Home", to: "/" },
    { name: "Camps & Banks", to: "/camps-and-banks" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600"
        >
          Jeevan-Rakshak
        </Link>

        <nav className="flex items-center">
          {currentUser ? (
            // --- Logged-In View: Sidebar ---
            <div className="flex items-center gap-2">
              <NotificationBell />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[280px] sm:w-[320px]">
                  <div className="flex flex-col h-full">
                    <div className="border-b pb-4 mb-4">
                      <p className="font-semibold">{currentUser.displayName || currentUser.email}</p>
                      <p className="text-sm text-gray-500">Welcome back!</p>
                    </div>
                    <div className="flex flex-col gap-1 flex-grow">
                      {navItems.map((item) => (
                        <SheetClose asChild key={item.to}>
                          <Link
                            to={item.to}
                            className={`block px-3 py-2 rounded-md text-base font-medium transition ${
                              location.pathname === item.to
                                ? "bg-red-100 text-red-700"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {item.name}
                          </Link>
                        </SheetClose>
                      ))}
                      {currentUser.email === ADMIN_EMAIL && (
                        <SheetClose asChild>
                          <Link
                            to="/admin"
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-bold transition ${
                              location.pathname === "/admin"
                                ? "bg-red-100 text-red-700"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <ShieldCheck size={18} /> Admin Panel
                          </Link>
                        </SheetClose>
                      )}
                    </div>
                    <div className="mt-auto border-t pt-4">
                      <SheetClose asChild>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          <UserCircle size={18} /> View Profile
                        </Link>
                      </SheetClose>
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start mt-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <LogOut size={18} className="mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            // --- Logged-Out View: Horizontal Nav ---
            <div className="flex items-center space-x-4 text-sm font-medium">
                {loggedOutNavItems.map((item) => (
                    <Link
                    key={item.to}
                    to={item.to}
                    className={`hover:text-red-600 transition capitalize ${
                        location.pathname === item.to ? "text-red-600" : "text-gray-700"
                    }`}
                    >
                    {item.name}
                    </Link>
                ))}
                 <Button asChild>
                    <Link to="/login">Login / Register</Link>
                 </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}