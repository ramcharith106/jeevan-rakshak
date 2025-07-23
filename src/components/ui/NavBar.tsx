import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NavBar() {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const navItems = [
    { name: t("home"), to: "/" },
    { name: t("donate"), to: "/donate" },
    { name: t("request_blood"), to: "/request" },
    { name: t("dashboard"), to: "/dashboard" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600"
        >
          Jeevan-Rakshak
        </Link>

        {/* Navigation */}
        <nav className="flex items-center flex-wrap space-x-4 text-sm font-medium">
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
          <Link to="/login" className="text-gray-600 hover:text-blue-600">{t("login")}</Link>
          <Link to="/signup" className="text-gray-600 hover:text-blue-600">{t("signup")}</Link>

          {/* Language Toggle */}
          <select
            className="ml-2 px-2 py-1 border border-gray-300 rounded text-xs text-gray-700"
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="en">🌐 English</option>
            <option value="hi">🇮🇳 हिन्दी</option>
            <option value="te">🇮🇳 తెలుగు</option>
          </select>
        </nav>
      </div>
    </header>
  );
}
