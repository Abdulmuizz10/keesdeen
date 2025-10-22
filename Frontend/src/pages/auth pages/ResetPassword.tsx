import React, { useState } from "react";
import { Button, Input, Label } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { Link, useNavigate } from "react-router-dom";
import { mainLogo } from "../../assets";
import { Eye, EyeOff } from "lucide-react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { toast } from "sonner";
import { URL } from "../../lib/constants";
import Spinner from "../../components/Spinner";

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
  image: ImageProps;
};

export type Signup7Props = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const ResetPassword: React.FC = (props: Signup7Props) => {
  const { logo, title, subTitle, signUpButton } = {
    ...Signup7Defaults,
    ...props,
  } as Props;

  const { token } = useParams();
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [preference, setPreference] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
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
        toast.success("Password reset successfully! Redirecting to sign in...");
        setTimeout(() => navigate("/auth/login"), 2000);
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
    <section className="bg-background-light">
      {loading && (
        <div className="fixed inset-0 h-screen w-screen flex items-center justify-center bg-black/50 z-50">
          <Spinner />
        </div>
      )}
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="absolute left-0 right-0 top-0 z-10 flex h-16 w-full items-center justify-center px-[5%] md:h-18 lg:justify-between">
          <Link to={logo.url}>
            <img src={logo.src} alt={logo.alt} className="w-[150px] h-[30px]" />
          </Link>
        </div>
        <div className="max-w-sm w-full mx-5">
          <div className="mb-6 text-center">
            <h1 className="mb-5 text-4xl font-bold md:mb-1">{title}</h1>
            <p className="mb-5 text-base">{subTitle}</p>
          </div>
          <form
            className="grid grid-cols-1 gap-4 poppins"
            onSubmit={handleSubmit}
          >
            <div className="grid w-full items-center">
              <Label htmlFor="password" className="mb-2 text-neutral-700">
                New Password
              </Label>
              {/* <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="border-neutral-300 rounded bg-white"
              /> */}

              <div className="flex relative">
                <Input
                  placeholder="New Password"
                  type={preference ? "password" : "text"}
                  id="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

            <div className="grid w-full items-center">
              <Label htmlFor="password" className="mb-2 text-neutral-700">
                Confirm Password
              </Label>
              <div className="flex relative">
                <Input
                  placeholder="Confirm Password"
                  type={preference ? "password" : "text"}
                  id="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
  subTitle: "Set and confirm your new password!",
  signUpButton: {
    title: "Reset password",
  },
};
