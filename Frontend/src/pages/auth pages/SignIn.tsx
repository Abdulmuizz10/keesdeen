import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { BiLogoGoogle } from "react-icons/bi";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { mainLogo } from "../../assets";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { SignInAccount } from "../../context/AuthContext/AuthApiCalls";
import { useGoogleLogin } from "@react-oauth/google";
import {
  AccessFailure,
  AccessSuccess,
} from "../../context/AuthContext/AuthActions";
import { toast } from "sonner";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { URL } from "@/lib/constants";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    SignInAccount({ email, password }, dispatch, navigate, setLoading);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${URL}/auth/google-sign-in`,
          {
            googleToken: tokenResponse.access_token,
          },
          {
            validateStatus: (status) => status < 600,
          }
        );
        if (res.status === 200) {
          dispatch(AccessSuccess(res.data));
          navigate("/");
          setLoading(false);
        } else {
          dispatch(AccessFailure());
          setLoading(false);
          toast.error(res.data.message || "Something went wrong!");
        }
      } catch (error) {
        dispatch(AccessFailure());
        setLoading(false);
        toast.error("An unexpected error occurred. Please try again.");
      }
    },
    onError: () => {
      setLoading(false);
      toast.error("Google login error!");
    },
  });

  return (
    <section className="relative bg-white">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/50">
          <Spinner />
        </div>
      )}

      <div className="relative grid min-h-screen grid-cols-1 items-stretch lg:grid-cols-2">
        {/* Header Logo */}
        <div className="absolute left-0 right-0 top-0 z-10 flex h-16 w-full items-center justify-center px-8 md:h-20 lg:justify-between">
          <Link to="/">
            <img src={mainLogo} alt="Logo" className="h-8 w-auto" />
          </Link>
        </div>

        {/* Form Section */}
        <div className="relative flex items-center justify-center px-8 pb-16 pt-24 md:pb-20 md:pt-32 lg:py-20">
          <div className="w-full max-w-sm">
            {/* Header */}
            <div className="mb-12 text-center">
              <h1 className="mb-3 text-2xl font-light tracking-tight md:text-3xl">
                Welcome Back
              </h1>
              <p className="text-sm text-gray-500">
                Sign in to your account to continue
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

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full border border-gray-300 bg-white px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 transition-colors hover:text-gray-900"
                  >
                    {showPassword ? (
                      <EyeOff size={20} strokeWidth={1.5} />
                    ) : (
                      <Eye size={20} strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  to="/auth/forget_password"
                  className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full border border-gray-900 bg-gray-900 py-4 text-sm uppercase tracking-widest text-white transition-colors hover:bg-gray-800"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs uppercase tracking-widest text-gray-400">
                Or
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={() => googleLogin()}
              className="flex w-full items-center justify-center gap-3 border border-gray-300 bg-white py-4 text-sm uppercase tracking-widest text-gray-900 transition-colors hover:bg-gray-50"
            >
              <BiLogoGoogle className="text-xl" />
              Continue with Google
            </button>

            {/* Sign Up Link */}
            <div className="mt-8 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/auth/sign_up"
                className="text-gray-900 underline transition-colors hover:text-gray-600"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* Animated Image Section */}
        <div className="hidden bg-gray-50 lg:block relative overflow-hidden">
          <div className="h-full w-full flex items-center justify-center">
            <motion.img
              src={mainLogo}
              alt="logo"
              className="w-auto h-20"
              initial={{ y: 0, opacity: 0 }}
              animate={{
                y: [500, -20, 0],
                opacity: 1,
              }}
              transition={{
                duration: 1.2,
                times: [0, 0.6, 1],
                ease: [0.43, 0.13, 0.23, 0.96],
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
