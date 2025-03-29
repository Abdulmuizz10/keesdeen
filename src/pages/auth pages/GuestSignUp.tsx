import React, { useContext, useState } from "react";
import { Button, Input, Label } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { BiLogoGoogle } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { mainLogo } from "../../assets";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { SignUp } from "../../context/AuthContext/AuthApiCalls";
import { useGoogleLogin } from "@react-oauth/google";
import Axios from "axios";
import { URL } from "../../lib/constants";

import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogDescription,
} from "@relume_io/relume-ui";

import { useShop } from "../../context/ShopContext";
import {
  AccessFailure,
  AccessSuccess,
} from "../../context/AuthContext/AuthActions";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";

type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type Props = {
  logo: ImageProps;
  title: string;
  description: string;
  signUpButton: ButtonProps;
  signUpWithGoogleButton: ButtonProps;
  checkOutAsGuest: ButtonProps;
  image: ImageProps;
};

export type Signup7Props = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const GuestSignUp: React.FC = (props: Signup7Props) => {
  const {
    logo,
    title,
    description,
    signUpButton,
    signUpWithGoogleButton,
    checkOutAsGuest,
  } = {
    ...Signup7Defaults,
    ...props,
  } as Props;

  const { guestEmail, setGuestEmail } = useShop();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    SignUp(
      { firstName, lastName, email, password },
      dispatch,
      navigate,
      guestEmail,
      setGuestEmail,
      setLoading
    );
  };

  const handleEmailSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate("/check_out");
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        // Send the access token (googleToken) to get user info and authenticate
        const res = await Axios.post(
          `${URL}/auth/google-sign-in`,
          {
            googleToken: tokenResponse.access_token,
          },
          {
            withCredentials: true,
            validateStatus: (status) => status < 600,
          }
        );
        if (res.status === 200) {
          dispatch(AccessSuccess(res.data));
          if (res.data) {
            const user = res.data.id;
            const email = res.data.email;
            const userInfo = { user, email };
            const expect = await Axios.post(
              `${URL}/orders/link-guest/orders`,
              userInfo
            );
            if (expect) {
              if (guestEmail) {
                setGuestEmail("");
              }
            }
            navigate("/check_out");
            setLoading(false);
          }
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
    <section className="bg-background-light relative">
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 h-screen w-screen flex items-center justify-center bg-black/50 z-50">
          <Spinner />
        </div>
      )}
      <div className="relative min-h-screen justify-center">
        <div className="absolute left-0 right-0 top-0 z-10 flex h-16 w-full items-center justify-center px-[5%] md:h-18 lg:justify-between">
          <Link to={logo.url}>
            <img src={logo.src} alt={logo.alt} className="w-[150px] h-[30px]" />
          </Link>
        </div>
        <div className="relative mx-5 flex items-center justify-center pb-16 pt-20 md:pb-20 md:pt-24 lg:py-20">
          <div className="container max-w-sm">
            <div className="mb-6 text-center">
              <h1 className="mb-5 text-5xl font-bold text-neutral-800 md:mb-1 text-gradient">
                {title}
              </h1>
              <p className="text-neutral-600 md:text-md">{description}</p>
            </div>
            <form
              className="grid grid-cols-1 gap-2 poppins"
              onSubmit={handleSubmit}
            >
              <div className="grid w-full items-center">
                <Label htmlFor="name" className="mb-2 text-neutral-700">
                  First name
                </Label>
                <Input
                  placeholder="First name"
                  type="text"
                  id="name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="border-neutral-300 rounded"
                />
              </div>
              <div className="grid w-full items-center">
                <Label htmlFor="name" className="mb-2 text-neutral-700">
                  Last name
                </Label>
                <Input
                  placeholder="Last name"
                  type="text"
                  id="name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="border-neutral-300 rounded"
                />
              </div>
              <div className="grid w-full items-center">
                <Label htmlFor="email" className="mb-2 text-neutral-700">
                  Email
                </Label>
                <Input
                  placeholder="example@gmail.com"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-neutral-300 rounded"
                />
              </div>
              <div className="grid w-full items-center">
                <Label htmlFor="password" className="mb-2 text-neutral-700">
                  Password
                </Label>
                <Input
                  placeholder="password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-neutral-300 rounded"
                />
              </div>

              <Button
                variant={signUpButton.variant}
                size={signUpButton.size}
                iconLeft={signUpButton.iconLeft}
                iconRight={signUpButton.iconRight}
                className="poppins rounded mt-2"
              >
                {signUpButton.title}
              </Button>
            </form>

            <Button
              variant={signUpWithGoogleButton.variant}
              size={signUpWithGoogleButton.size}
              iconLeft={signUpWithGoogleButton.iconLeft}
              iconRight={signUpWithGoogleButton.iconRight}
              className="bg-gray-300 hover:bg-gray-400 text-black rounded flex items-center gap-x-3 w-full mt-3 poppins"
              onClick={() => googleLogin()}
            >
              {signUpWithGoogleButton.title}
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant={checkOutAsGuest.variant}
                  size={checkOutAsGuest.size}
                  className="bg-gray-300 hover:bg-gray-400 text-black rounded flex items-center gap-x-3 w-full mt-3 poppins"
                  onClick={() => {}}
                >
                  {checkOutAsGuest.title}
                </Button>
              </DialogTrigger>
              <DialogPortal>
                <DialogOverlay className="bg-black/50" />
                <DialogContent className="w-full max-w-md bg-white p-10 md:p-12 rounded-md">
                  <DialogHeader>
                    {/* <DialogTitle>Email</DialogTitle> */}
                    <DialogDescription>Enter your email</DialogDescription>
                    <form
                      className="flex flex-col gap-3"
                      onSubmit={handleEmailSubmit}
                    >
                      <Input
                        type="email"
                        placeholder="Email"
                        className="border-neutral-300 rounded poppins w-full"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        required
                      />

                      <Button
                        variant="primary"
                        className="w-full bg-brand-neutral text-text-light px-6 rounded-md poppins border-none"
                      >
                        Submit
                      </Button>
                    </form>
                  </DialogHeader>
                </DialogContent>
              </DialogPortal>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Signup7Defaults: Signup7Props = {
  logo: {
    url: "/",
    src: mainLogo,
    alt: "Logo text",
  },
  title: "Sign up",
  description: "Join us to explore our modest collection.",
  signUpButton: {
    title: "Sign up",
  },
  signUpWithGoogleButton: {
    variant: "secondary",
    title: "Sign in with Google",
    iconLeft: <BiLogoGoogle className="size-6" />,
  },
  checkOutAsGuest: {
    variant: "secondary",
    title: "Checkout As Guest",
  },
};
