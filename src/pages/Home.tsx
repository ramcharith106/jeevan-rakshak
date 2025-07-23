import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20 px-4 bg-gradient-to-b from-red-50 to-blue-50">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
          {t("home_title")}
        </h1>
        <p className="text-lg text-gray-700 mt-4 max-w-2xl mx-auto">
          {t("home_subtitle")}
        </p>

        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/donate"
            className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-red-700 transition"
          >
            {t("donate_now")}
          </Link>
          <Link
            to="/request"
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-blue-700 transition"
          >
            {t("request_blood")}
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 text-center bg-white">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">{t("impact_title")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div>
            <p className="text-3xl font-bold text-red-600">50K+</p>
            <p className="text-sm text-gray-600">{t("donors")}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">30K+</p>
            <p className="text-sm text-gray-600">{t("requests_fulfilled")}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-red-600">2H</p>
            <p className="text-sm text-gray-600">{t("avg_response_time")}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">100+</p>
            <p className="text-sm text-gray-600">{t("cities_served")}</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-red-50">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">{t("why_us")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {["connect", "safe", "real_time"].map((feature) => (
            <div key={feature} className="bg-white shadow-md p-6 rounded-xl text-center">
              <h3 className="text-lg font-bold text-red-600">{t(`feature_${feature}_title`)}</h3>
              <p className="text-sm text-gray-700 mt-2">{t(`feature_${feature}_desc`)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
