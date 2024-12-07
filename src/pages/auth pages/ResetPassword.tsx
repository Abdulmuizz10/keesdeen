import React, { useState } from "react";
import { Button, Input, Label } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { Link, useNavigate } from "react-router-dom";
import { mainLogo } from "../../assets";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { URL } from "../../lib/constants";
import { toast } from "react-toastify";

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
  image: ImageProps;
};

export type Signup7Props = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const ResetPassword: React.FC = (props: Signup7Props) => {
  const { logo, title, description, signUpButton } = {
    ...Signup7Defaults,
    ...props,
  } as Props;

  const { token } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await Axios.post(
        `${URL}/auth/reset-password/${token}`,
        {
          newPassword,
        },
        {
          validateStatus: (status) => status < 600,
        }
      );

      if (response.status === 200) {
        setSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/auth/login"), 2000);
      } else {
        setError(response.data.message || "Failed to reset password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <section className="bg-background-light">
      <div className="relative min-h-screen justify-center">
        <div className="absolute left-0 right-0 top-0 z-10 flex h-16 w-full items-center justify-center px-[5%] md:h-18 lg:justify-between">
          <Link to={logo.url}>
            <img src={logo.src} alt={logo.alt} className="w-[150px] h-[30px]" />
          </Link>
        </div>
        <div className="relative mx-5 flex items-center justify-center pb-16 pt-20 md:pb-20 md:pt-24 lg:py-20">
          <div className="container max-w-sm">
            <div className="mb-6 text-center">
              <h1 className="mb-5 text-5xl font-bold text-neutral-800 md:mb-1 md:text-7xl lg:text-8xl">
                {title}
              </h1>
              <p className="text-neutral-600 md:text-md">{description}</p>
            </div>
            <form
              className="grid grid-cols-1 gap-4 poppins"
              onSubmit={handleSubmit}
            >
              {error && <p className="text-red-600">{error}</p>}
              {success && <p className="text-green-600">{success}</p>}
              <div className="grid w-full items-center">
                <Label htmlFor="password" className="mb-2 text-neutral-700">
                  New Password
                </Label>
                <Input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="border-neutral-300 rounded"
                />
              </div>

              <div className="grid w-full items-center">
                <Label htmlFor="password" className="mb-2 text-neutral-700">
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="border-neutral-300 rounded"
                />
              </div>

              <Button
                variant={signUpButton.variant}
                size={signUpButton.size}
                iconLeft={signUpButton.iconLeft}
                iconRight={signUpButton.iconRight}
                className="poppins rounded mt-2 bg-brand-neutral text-white"
              >
                {signUpButton.title}
              </Button>
            </form>
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
  title: "Reset Password",
  description: "Confirm and reset your password!",
  signUpButton: {
    title: "Reset password",
  },
};
