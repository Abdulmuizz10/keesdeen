import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { mainLogo } from "../../assets";
import { Eye, EyeOff } from "lucide-react";
import Axios from "axios";
import { toast } from "sonner";
import { URL } from "../../lib/constants";
import Spinner from "../../components/Spinner";

const ResetPassword: React.FC = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await Axios.post(
        `${URL}/auth/reset-password/${token}`,
        { newPassword },
        { validateStatus: (status) => status < 600 }
      );

      if (response.status === 200) {
        toast.success("Password reset successfully!");
        setTimeout(() => navigate("/auth/sign_in"), 2000);
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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
            Reset Password
          </h1>
          <p className="text-sm text-gray-500">Enter your new password below</p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* New Password Field */}
          <div>
            <label
              htmlFor="newPassword"
              className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full border border-gray-300 bg-white px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3 text-gray-400 transition-colors hover:text-gray-900"
              >
                {showNewPassword ? (
                  <EyeOff size={20} strokeWidth={1.5} />
                ) : (
                  <Eye size={20} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="w-full border border-gray-300 bg-white px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 transition-colors hover:text-gray-900"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} strokeWidth={1.5} />
                ) : (
                  <Eye size={20} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full border border-gray-900 bg-gray-900 py-4 text-sm uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* Back to Sign In Link */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Remember your password?{" "}
          <Link
            to="/auth/sign_in"
            className="text-gray-900 underline transition-colors hover:text-gray-600"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
