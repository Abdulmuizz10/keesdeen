import React, { useState } from "react";
import { Button, Input, Label } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { Link, useNavigate } from "react-router-dom";
import { mainLogo } from "../../assets";
import { toast } from "sonner";
import Axios from "axios";
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

export const ForgetPassword: React.FC = (props: Signup7Props) => {
  const { logo, title, subTitle, signUpButton } = {
    ...Signup7Defaults,
    ...props,
  } as Props;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await Axios.post(
        `${URL}/auth/forget-password`,
        { email },
        {
          validateStatus: (status: any) => status < 600,
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message || "Request successful!");
        navigate("/auth/login");
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
                Enter your email
              </Label>

              <Input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-neutral-300 rounded bg-white"
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
    </section>
  );
};

export const Signup7Defaults: Signup7Props = {
  logo: {
    url: "/",
    src: mainLogo,
    alt: "Logo text",
  },
  title: "Forgot Your Password?",
  subTitle: "Submit your email and get a reset link to reset your password!",
  signUpButton: {
    title: "Submit",
  },
};
