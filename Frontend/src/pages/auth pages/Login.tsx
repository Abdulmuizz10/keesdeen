"use client";

import React, { useContext, useState } from "react";
import { Button, Input, Label } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { BiLogoGoogle } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { Images, mainLogo } from "../../assets";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { Login } from "../../context/AuthContext/AuthApiCalls";
import { useGoogleLogin } from "@react-oauth/google";
import {
  AccessFailure,
  AccessSuccess,
} from "../../context/AuthContext/AuthActions";
import { URL } from "../../lib/constants";
import Axios from "axios";
import { toast } from "react-toastify";
import { useShop } from "../../context/ShopContext";
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
  logInButton: ButtonProps;
  logInWithGoogleButton: ButtonProps;
  image: ImageProps;
  signUpText: string;
  signUpLink: {
    text: string;
    url: string;
  };
};

export type Login7Props = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const Login7: React.FC = (props: Login7Props) => {
  const {
    logo,
    title,
    logInButton,
    logInWithGoogleButton,
    image,
    signUpText,
    signUpLink,
  } = {
    ...Login7Defaults,
    ...props,
  } as Props;

  const { guestEmail, setGuestEmail } = useShop();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    Login(
      { email, password },
      dispatch,
      navigate,
      guestEmail,
      setGuestEmail,
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
            navigate("/");
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
      <div className="relative grid min-h-screen grid-cols-1 items-stretch justify-center overflow-auto lg:grid-cols-2">
        <div className="absolute left-0 right-0 top-0 z-10 flex h-16 w-full items-center justify-center px-[5%] md:h-18 lg:justify-between">
          <Link to={logo.url}>
            <img src={logo.src} alt={logo.alt} className="w-[150px] h-[30px]" />
          </Link>
        </div>
        <div className="relative mx-[5vw] flex items-center justify-center pb-16 pt-20 md:pb-20 md:pt-24 lg:py-20">
          <div className="container max-w-sm">
            <div className="container mb-6 max-w-lg text-center md:mb-8">
              <h1 className="mb-5 text-5xl font-bold md:mb-1 text-gradient">
                {title}
              </h1>
            </div>
            <form
              className="grid grid-cols-1 gap-6 poppins"
              onSubmit={handleSubmit}
            >
              <div className="grid w-full items-center">
                <Label htmlFor="email" className="mb-2">
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
                <Label htmlFor="password" className="mb-2">
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

              <Link to="/auth/forget_password" className="text-end">
                <p className=" text-text-success cursor-pointer">
                  Forget password?
                </p>
              </Link>

              <div className="grid-col-1 grid gap-4">
                <Button
                  variant={logInButton.variant}
                  size={logInButton.size}
                  iconLeft={logInButton.iconLeft}
                  iconRight={logInButton.iconRight}
                  className="poppins"
                >
                  {logInButton.title}
                </Button>
              </div>
            </form>
            <Button
              variant={logInWithGoogleButton.variant}
              size={logInWithGoogleButton.size}
              iconLeft={logInWithGoogleButton.iconLeft}
              iconRight={logInWithGoogleButton.iconRight}
              className="bg-gray-300 hover:bg-gray-400 text-black rounded flex items-center gap-x-3 w-full mt-3 poppins"
              onClick={() => googleLogin()}
            >
              {logInWithGoogleButton.title}
            </Button>
            <div className="mt-5 inline-flex w-full items-center justify-center gap-x-1 text-center md:mt-6">
              <p>{signUpText}</p>
              <Link to={signUpLink.url} className="underline text-[#04BB6E]">
                {signUpLink.text}
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden bg-background-secondary lg:block">
          <img
            src={image.src}
            alt={image.alt}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export const Login7Defaults: Login7Props = {
  logo: {
    url: "/",
    src: mainLogo,
    alt: "Logo text",
  },
  title: "Log in",
  logInButton: {
    title: "Log in",
  },
  logInWithGoogleButton: {
    variant: "secondary",
    title: "Sign in with Google",
    iconLeft: <BiLogoGoogle className="size-6" />,
  },
  // image: {
  //   src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
  //   alt: "Placeholder image",
  // },
  image: {
    src: Images.animated_1,
    alt: "Placeholder image",
  },
  signUpText: "Don't have an account?",
  signUpLink: {
    text: "Sign up",
    url: "/auth/signUp",
  },
};
