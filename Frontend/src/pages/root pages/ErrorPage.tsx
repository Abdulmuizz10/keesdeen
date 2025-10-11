import React from "react";
import { Link } from "react-router-dom";

const ErrorPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          Oops! Page not found.
        </h2>
        <p className="text-gray-600 mt-2">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-brand-neutral poppins text-white px-6 py-3 rounded-lg text-lg font-medium transition hover:bg-brand-neutral/90"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
