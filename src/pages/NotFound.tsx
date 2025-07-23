import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 text-center">
      <div>
        <h1 className="text-6xl font-bold text-bloodRed mb-4">404</h1>
        <p className="text-lg text-gray-700 mb-6">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link to="/">
          <Button className="bg-bloodRed hover:bg-red-700 text-white px-6 py-2 text-md">
            Go to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
