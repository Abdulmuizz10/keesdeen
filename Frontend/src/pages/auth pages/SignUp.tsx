"use client";

import React, { useContext, useState } from "react";
import { Button, Input, Label } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
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

type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type Props = {
  logo: ImageProps;
  title: string;
  subTitle: string;
  description: string;
  signUpButton: ButtonProps;
  signUpWithGoogleButton: ButtonProps;
  image: ImageProps;
  logInText: string;
  logInLink: {
    text: string;
    url: string;
  };
};

export type SignUpProps = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const SignUp: React.FC = (props: SignUpProps) => {
  const {
    logo,
    title,
    subTitle,
    signUpButton,
    signUpWithGoogleButton,
    image,
    logInText,
    logInLink,
  } = {
    ...SignUpDefaults,
    ...props,
  } as Props;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preference, setPreference] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    SignUpAccount(
      { firstName, lastName, email, password },
      dispatch,
      navigate,
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
    <section className="bg-background-light relative">
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 h-screen w-screen flex items-center justify-center bg-black/50 z-50">
          <Spinner />
        </div>
      )}
      <div className="relative grid min-h-screen grid-cols-1 items-stretch justify-center overflow-auto lg:grid-cols-2 overflow-x-hidden">
        <div className="absolute left-0 right-0 top-0 z-10 flex h-16 w-full items-center justify-center px-[5%] md:h-18 lg:justify-between">
          <Link to={logo.url}>
            <img src={logo.src} alt={logo.alt} className="w-[150px] h-[30px]" />
          </Link>
        </div>
        <div className="relative mx-5 flex items-center justify-center pb-16 pt-20 md:pb-20 md:pt-24 lg:py-20">
          <div className="container max-w-sm">
            <div className="mb-6 text-center">
              <h1 className="mb-5 text-4xl font-bold md:mb-1">
                <span>{title}</span>
              </h1>
              <p className="mb-5 text-base text-gradient">{subTitle}</p>
            </div>
            <form
              className="grid grid-cols-1 gap-3 poppins"
              onSubmit={handleSubmit}
            >
              <div className="grid w-full items-center">
                <Label htmlFor="name" className="mb-2 text-neutral-700">
                  First Name
                </Label>
                <Input
                  placeholder="First name"
                  type="text"
                  id="name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="border-neutral-300 rounded bg-white"
                />
              </div>
              <div className="grid w-full items-center">
                <Label htmlFor="name" className="mb-2 text-neutral-700">
                  Last Name
                </Label>
                <Input
                  placeholder="Last name"
                  type="text"
                  id="name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="border-neutral-300 rounded bg-white"
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
                  className="border-neutral-300 rounded bg-white"
                />
              </div>
              <div className="grid w-full items-center">
                <Label htmlFor="password" className="mb-2 text-neutral-700">
                  Password
                </Label>
                <div className="flex relative">
                  <Input
                    placeholder="password"
                    type={preference ? "password" : "text"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-neutral-300 rounded bg-white"
                  />

                  {preference === true ? (
                    <Eye
                      className="absolute top-2.5 right-3.5 cursor-pointer"
                      onClick={() => setPreference(false)}
                    />
                  ) : (
                    <EyeOff
                      className="absolute top-2.5 right-3.5 cursor-pointer"
                      onClick={() => setPreference(true)}
                    />
                  )}
                </div>
              </div>
              <div className="grid-col-1 grid gap-4">
                <Button
                  variant={signUpButton.variant}
                  size={signUpButton.size}
                  iconLeft={signUpButton.iconLeft}
                  iconRight={signUpButton.iconRight}
                  className="poppins"
                >
                  {signUpButton.title}
                </Button>
              </div>
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
            <div className="mt-5 inline-flex w-full items-center justify-center gap-x-1 text-center md:mt-6">
              <p>{logInText}</p>
              <Link to={logInLink.url} className="underline text-[#04BB6E]">
                {logInLink.text}
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden lg:block bg-background-secondary">
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

export const SignUpDefaults: SignUpProps = {
  logo: {
    url: "/",
    src: mainLogo,
    alt: "Logo text",
  },
  title: "Create your Keesdeen account",
  subTitle: "Join our community to start shopping today!",
  signUpButton: {
    title: "Sign up",
  },
  signUpWithGoogleButton: {
    variant: "secondary",
    title: "Continue with Google",
    iconLeft: <BiLogoGoogle className="size-6" />,
  },
  // image: {
  //   src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
  //   alt: "Placeholder image",
  // },
  image: {
    src: Images.animated_2,
    alt: "Placeholder image",
  },
  logInText: "Already have an account?",
  logInLink: {
    text: "Sign in",
    url: "/auth/sign_in",
  },
};
