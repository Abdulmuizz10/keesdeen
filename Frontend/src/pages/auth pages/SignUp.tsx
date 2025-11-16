import React, { useContext, useEffect, useState } from "react";
import { BiLogoGoogle } from "react-icons/bi";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Images, mainLogo } from "../../assets";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { SignUpAccount } from "../../context/AuthContext/AuthApiCalls";
import { useGoogleLogin } from "@react-oauth/google";
import Axios from "axios";
import {
  AccessFailure,
  AccessSuccess,
} from "../../context/AuthContext/AuthActions";
import { toast } from "sonner";
import Spinner from "../../components/Spinner";
import { URL } from "../../lib/constants";
import { useShop } from "@/context/ShopContext";

const SignUp: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { cartItems } = useShop();
  const [cartData, setCartData] = useState<any[]>([]);

  useEffect(() => {
    const tempData: any[] = [];
    for (const itemId in cartItems) {
      const item = cartItems[itemId];
      for (const variantKey in item.variants) {
        const quantity = item.variants[variantKey];
        if (quantity > 0) {
          const [size, color] = variantKey.split("-");
          tempData.push({
            id: itemId,
            name: item.name,
            price: item.price,
            image: item.image,
            size,
            color,
            quantity,
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    SignUpAccount(
      { firstName, lastName, email, password },
      dispatch,
      navigate,
      cartData,
      setLoading
    );
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const res = await Axios.post(
          `${URL}/auth/google-sign-in`,
          {
            googleToken: tokenResponse.access_token,
          },
          { withCredentials: true, validateStatus: (status) => status < 600 }
        );
        if (res.status === 200) {
          dispatch(AccessSuccess(res.data));
          navigate("/cart");
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
                Create Account
              </h1>
              <p className="text-sm text-gray-500">
                Join our community to start shopping
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* First Name Field */}
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  required
                  className="w-full border border-gray-300 bg-white px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>

              {/* Last Name Field */}
              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  required
                  className="w-full border border-gray-300 bg-white px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>

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

              {/* Sign Up Button */}
              <button
                type="submit"
                className="w-full border border-gray-900 bg-gray-900 py-4 text-sm uppercase tracking-widest text-white transition-colors hover:bg-gray-800"
              >
                Sign Up
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

            {/* Google Sign Up Button */}
            <button
              onClick={() => googleLogin()}
              className="flex w-full items-center justify-center gap-3 border border-gray-300 bg-white py-4 text-sm uppercase tracking-widest text-gray-900 transition-colors hover:bg-gray-50"
            >
              <BiLogoGoogle className="text-xl" />
              Continue with Google
            </button>

            {/* Sign In Link */}
            <div className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/auth/sign_in"
                className="text-gray-900 underline transition-colors hover:text-gray-600"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="hidden bg-gray-50 lg:block">
          <img
            src={Images.animated_2}
            alt="Sign up illustration"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default SignUp;
