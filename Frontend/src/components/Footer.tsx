import { mainLogoWhite } from "../assets";
import { Button, Input } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { FaXTwitter } from "react-icons/fa6";
import { BiLogoFacebookCircle, BiLogoInstagram } from "react-icons/bi";
import { FaTiktok } from "react-icons/fa";
import { Link } from "react-router-dom";
// import CurrencySwitcher from "./CurrencySwitcher";
import { useState } from "react";
import { toast } from "sonner";
import Axios from "axios";
import { URL } from "../lib/constants";

type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type Links = {
  title: string;
  url: string;
  icon?: React.ReactNode;
};

type ColumnLinks = {
  title: string;
  links: Links[];
};

type FooterLink = {
  title: string;
  url: string;
};

type Props = {
  logo: ImageProps;
  newsletterDescription: string;
  inputPlaceholder?: string;
  button: ButtonProps;
  termsAndConditions: string;
  columnLinks: ColumnLinks[];
  footerText: string;
  footerLinks: FooterLink[];
};

export type Footer1Props = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const Footer1 = (props: Footer1Props) => {
  const {
    logo,
    newsletterDescription,
    inputPlaceholder,
    button,
    termsAndConditions,
    columnLinks,
    footerText,
    footerLinks,
  } = {
    ...Footer1Defaults,
    ...props,
  } as Props;

  const [email, setEmail] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await Axios.post(
        `${URL}/subscribers`,
        { email },
        {
          validateStatus: (status) => status < 600,
        }
      );
      if (res.status === 200) {
        toast(res.data.message);
        setEmail("");
      } else {
        toast.error(
          res.data.message || "Something went wrong please try again"
        );
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <footer className="px-[5%] py-12 md:py-18 lg:py-20 bg-brand-neutral text-text-light">
      <div className="container">
        <div className="grid grid-cols-1 gap-x-[8vw] gap-y-12 pb-12 md:gap-y-16 md:pb-18 lg:grid-cols-[0.75fr,1fr] lg:gap-y-4 lg:pb-20">
          <div className="flex flex-col">
            <a href={logo.url} className="mb-5 md:mb-6">
              <img
                src={logo.src}
                alt={logo.alt}
                className="inline-block w-[130px] sm:w-[200px]"
              />
            </a>
            <p className="mb-5 md:mb-6">{newsletterDescription}</p>
            <div className="max-w-md">
              <form
                className="mb-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-[1fr_max-content] md:gap-y-4 text-text-primary poppins"
                onSubmit={handleSubmit}
              >
                <Input
                  placeholder={inputPlaceholder}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button {...button} className="items-center justify-center ">
                  {button.title}
                </Button>
              </form>

              <div dangerouslySetInnerHTML={{ __html: termsAndConditions }} />
              <div className="mt-10">
                {/* <CurrencySwitcher color="black" /> */}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 items-start gap-y-10 sm:grid-cols-3 sm:gap-x-6 md:gap-x-8 md:gap-y-4">
            {columnLinks.map((column, index) => (
              <div
                key={index}
                className="flex flex-col items-start justify-start"
              >
                <h2 className="mb-3 font-semibold md:mb-4">{column.title}</h2>
                <ul>
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex} className="py-2 text-sm">
                      <Link
                        to={link.url}
                        className="flex items-center gap-3 text-text-secondary"
                      >
                        {link.icon && <span>{link.icon}</span>}
                        <span>{link.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="h-px w-full bg-background-primary" />
        <div className="flex flex-col-reverse items-start justify-between pb-4 pt-6 text-sm md:flex-row md:items-center md:pb-0 md:pt-8">
          <p className="mt-6 md:mt-0">{footerText}</p>
          <ul className="grid grid-flow-row grid-cols-[max-content] justify-center gap-x-0 gap-y-4 text-sm md:grid-flow-col md:gap-x-6 md:gap-y-0">
            {footerLinks.map((link, index) => (
              <li key={index} className="underline">
                <a href={link.url}>{link.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export const Footer1Defaults: Footer1Props = {
  logo: {
    url: "/",
    src: mainLogoWhite,
    alt: "Logo image",
  },
  newsletterDescription: "Join our newsletter to stay up to date with us.",
  inputPlaceholder: "Enter your email",
  button: {
    title: "Subscribe",
    variant: "secondary",
    size: "sm",
  },
  termsAndConditions: `
  <p class='text-xs'>
    By subscribing you agree to with our
    <a href='#' class='underline'>Privacy Policy</a>
    and provide consent to receive updates from our company.
  </p>
  `,
  columnLinks: [
    {
      title: "Quick links",
      links: [
        { title: "Home", url: "/" },
        { title: "Shop All", url: "/collections/shop_all" },
        { title: "New In", url: "/collections/new_in" },
        { title: "Active wear", url: "/collections/Active_wear" },
        {
          title: "Fitness Accessories",
          url: "/collections/Fitness_accessories",
        },
      ],
    },
    // {
    //   title: "Default links",
    //   links: [
    //     { title: "Active wear", url: "/collections/Active_wear" },
    //     {
    //       title: "Fitness Accessories",
    //       url: "/collections/Fitness_accessories",
    //     },
    //     { title: "Link Six", url: "/profile" },
    //   ],
    // },
    {
      title: "Follow us",
      links: [
        {
          title: "Facebook",
          url: "#",
          icon: <BiLogoFacebookCircle className="size-6" />,
        },
        {
          title: "Instagram",
          url: "https://www.instagram.com/keesdeen_active?igsh=MWhvcnhqcjZra2ZlZw%3D%3D&utm_source=qr",
          icon: <BiLogoInstagram className="size-6" />,
        },
        {
          title: "X",
          url: "https://x.com/keesdeenactive?s=11",
          icon: <FaXTwitter className="size-6 p-0.5" />,
        },
        {
          title: "Tiktok",
          url: "https://www.tiktok.com/@keesdeen.active?_t=8qrPZMS37vE&_r=1",
          icon: <FaTiktok className="size-6" />,
        },
        // {
        //   title: "Youtube",
        //   url: "#",
        //   icon: <BiLogoYoutube className="size-6" />,
        // },
      ],
    },
  ],
  footerText: "© 2024 Keedeen. All rights reserved.",
  footerLinks: [
    { title: "Privacy Policy", url: "#" },
    { title: "Terms of Service", url: "#" },
  ],
};
