import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mainLogo } from "../../assets";
import { useShop } from "@/context/ShopContext";
import Spinner from "../../components/Spinner";

const Guest: React.FC = () => {
  const [email, setEmail] = useState("");
  const { setGuestEmail } = useShop();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setGuestEmail(email);
    setLoading(false);
    navigate("/guest_check_out");
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-white">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/50">
          <Spinner />
        </div>
      )}

      {/* Header Logo */}
      <div className="absolute left-0 right-0 top-0 z-10 flex h-16 w-full items-center justify-center px-8 md:h-20">
        <Link to="/">
          <img src={mainLogo} alt="Logo" className="h-8 w-auto" />
        </Link>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-sm px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-2xl font-light tracking-tight md:text-3xl">
            Checkout As Guest
          </h1>
          <p className="text-sm text-gray-500">
            Enter your email to checkout as guest
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              required
              className="w-full border border-gray-300 bg-white px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full border border-gray-900 bg-gray-900 py-4 text-sm uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {/* Back to Sign In Link */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Want to sign up instead?{" "}
          <Link
            to="/auth/sign_up"
            className="text-gray-900 underline transition-colors hover:text-gray-600"
          >
            Sign up
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Guest;
