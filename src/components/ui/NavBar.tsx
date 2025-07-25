import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getCurrentUser, logout } from "@/lib/auth";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const user = getCurrentUser();
    setIsLoggedIn(!!user);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    navigate("/login");
  };

  const navItems = [
    { name: ("home"), to: "/" },
    { name: ("donate"), to: "/donate" },
    { name: ("request blood"), to: "/request" },
    { name: ("dashboard"), to: "/dashboard" },
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

        <nav className="flex items-center flex-wrap space-x-4 text-sm font-medium relative">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`hover:text-red-600 transition ${
                location.pathname === item.to ? "text-red-600" : "text-gray-700"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {!isLoggedIn ? (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">{("login")}</Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-gray-700 hover:text-blue-600"
              >
                👤 {("account")}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    🧾 {("view_profile")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    🚪 {("logout")}
                  </button>
                </div>
              )}
            </div>
          )}          
        </nav>
      </div>
    </header>
  );
}
