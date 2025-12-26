import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-muted/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-muted/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-muted/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <div
          className={`text-center max-w-2xl transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* 404 Text */}
          <div className="relative mb-8">
            <h1 className="text-[180px] md:text-[220px] font-extralight tracking-tighter leading-none text-foreground/5 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-6xl md:text-7xl font-light tracking-tight text-foreground">
                404
              </h2>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-4 mb-12">
            <h3 className="text-2xl md:text-3xl font-light tracking-tight text-foreground">
              Page Not Found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              The page you're looking for doesn't exist or has been moved to a
              new location. Let's get you back on track.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 px-8 py-3  border-gray-900 bg-gray-900 text-white transition-all duration-300 w-full sm:w-auto justify-center"
            >
              <Home className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              <span className="font-medium tracking-wide">Back to Home</span>
            </Link>

            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center gap-2 px-8 py-3 border border-border bg-background dark:text-white hover:bg-muted transition-all duration-300 w-full sm:w-auto justify-center"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium tracking-wide">Go Back</span>
            </button>
          </div>

          {/* Quick Links */}
          <div className="border-t border-border pt-8">
            <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">
              Quick Links
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Link
                to="/collections/shop_all"
                className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search className="h-4 w-4" />
                <span>Browse Products</span>
              </Link>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Get Help</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default ErrorPage;
