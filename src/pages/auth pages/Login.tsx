"use client";

import React, { useContext, useState } from "react";
import { Button, Input, Label } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { BiLogoGoogle } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { mainLogo } from "../../assets";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { Login } from "../../context/AuthContext/AuthApiCalls";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
  AccessFailure,
  AccessSuccess,
} from "../../context/AuthContext/AuthActions";
import { URL } from "../../lib/constants";

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
    description,
    logInButton,
    logInWithGoogleButton,
    image,
    signUpText,
    signUpLink,
  } = {
    ...Login7Defaults,
    ...props,
  } as Props;

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    Login({ email, password }, dispatch, navigate);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Send the access token (googleToken) to get user info and authenticate
        const res = await axios.post(`${URL}/auth/google-sign-in`, {
          googleToken: tokenResponse.access_token,
        });

        dispatch(AccessSuccess(res.data));
        navigate("/");
      } catch (error) {
        dispatch(AccessFailure());
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
    },
  });

  return (
    <section className="bg-background-light">
      <div className="relative grid min-h-screen grid-cols-1 items-stretch justify-center overflow-auto lg:grid-cols-2">
        <div className="absolute left-0 right-0 top-0 z-10 flex h-16 w-full items-center justify-center px-[5%] md:h-18 lg:justify-between">
          <a href={logo.url}>
            <img src={logo.src} alt={logo.alt} className="w-full h-[25px]" />
          </a>
        </div>
        <div className="relative mx-[5vw] flex items-center justify-center pb-16 pt-20 md:pb-20 md:pt-24 lg:py-20">
          <div className="container max-w-sm">
            <div className="container mb-6 max-w-lg text-center md:mb-8">
              <h1 className="mb-5 text-5xl font-bold md:mb-1 md:text-7xl lg:text-8xl bricolage-grotesque">
                {title}
              </h1>
              <p className="md:text-md">{description}</p>
            </div>
            <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
              <div className="grid w-full items-center">
                <Label htmlFor="email" className="mb-2">
                  Email*
                </Label>
                <Input
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
                  Password*
                </Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-neutral-300 rounded"
                />
              </div>
              <div className="grid-col-1 grid gap-4">
                <Button
                  variant={logInButton.variant}
                  size={logInButton.size}
                  iconLeft={logInButton.iconLeft}
                  iconRight={logInButton.iconRight}
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
              className="bg-gray-300 hover:bg-gray-400 text-black rounded flex items-center gap-x-3 w-full mt-3"
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
  description: "Lorem ipsum dolor sit amet adipiscing elit.",
  logInButton: {
    title: "Log in",
  },
  logInWithGoogleButton: {
    variant: "secondary",
    title: "Log in with Google",
    iconLeft: <BiLogoGoogle className="size-6" />,
  },
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Placeholder image",
  },
  signUpText: "Don't have an account?",
  signUpLink: {
    text: "Sign up",
    url: "/register/signUp",
  },
};
