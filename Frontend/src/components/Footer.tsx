import React, { useState } from "react";
import { Link } from "react-router-dom";
import { mainLogo } from "../assets";
import { FaXTwitter, FaTiktok } from "react-icons/fa6";
import { BiLogoFacebookCircle, BiLogoInstagram } from "react-icons/bi";
import { toast } from "sonner";
import Axios from "axios";
import { URL } from "../lib/constants";

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
  columnLinks: ColumnLinks[];
  footerLinks: FooterLink[];
};

export type FooterProps = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const Footer = (props: FooterProps) => {
  const { columnLinks, footerLinks } = {
    ...FooterDefaults,
    ...props,
  } as Props;

  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await Axios.post(
        `${URL}/subscribers/subscribe`,
        { email },
        {
          validateStatus: (status) => status < 600,
        }
      );
      if (res.status === 200) {
        toast.success(res.data.message || "Successfully subscribed!");
        setEmail("");
      } else {
        toast.error(
          res.data.message || "Something went wrong, please try again"
        );
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="border-t border-gray-200 mx-auto px-6 lg:px-12 py-12 lg:py-16">
      <div className="">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-12 pb-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16 lg:pb-16">
          {/* Left Section - Logo & Newsletter */}
          <div className="flex flex-col">
            <Link to="/" className="mb-8">
              <img src={mainLogo} alt="Logo" className="h-8 md:h-10 w-auto" />
            </Link>

            <p className="mb-6 text-sm text-gray-600">
              Join our newsletter to stay up to date with us
            </p>

            {/* Newsletter Form */}
            <form
              onSubmit={handleSubmit}
              className="mb-4 flex flex-col sm:flex-row max-w-md gap-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 border border-gray-300 bg-white px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="border border-gray-900 bg-gray-900 px-6 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? "..." : "Subscribe"}
              </button>
            </form>

            <p className="text-xs text-gray-500">
              By subscribing you agree to our{" "}
              <Link to="/privacy_policy" className="underline">
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Right Section - Links Grid */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:gap-12">
            {columnLinks.map((column, index) => (
              <div key={index} className="flex flex-col">
                <h3 className="mb-4 text-sm uppercase tracking-widest">
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={link.url}
                        className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
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

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col-reverse items-start justify-between gap-6 text-sm md:flex-row md:items-center">
            <p className="text-gray-500">
              © {new Date().getFullYear()} Keesdeen. All rights reserved.
            </p>
            <ul className="flex flex-wrap gap-6">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.url}
                    className="text-gray-500 underline transition-colors hover:text-gray-900"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const FooterDefaults: FooterProps = {
  columnLinks: [
    {
      title: "Quick Links",
      links: [
        { title: "Home", url: "/" },
        { title: "Shop All", url: "/collections/shop_all" },
        { title: "New Arrivals", url: "/collections/new_arrivals" },
        { title: "Active Wears", url: "/collections/active_wears" },
        {
          title: "Fitness Accessories",
          url: "/collections/fitness_accessories",
        },
      ],
    },
    {
      title: "Customer Service",
      links: [
        { title: "Contact Us", url: "/contact" },
        { title: "Faqs", url: "/faqs" },
        // { title: "Shipping Info", url: "/shipping_info" },
      ],
    },
    {
      title: "Follow Us",
      links: [
        {
          title: "Facebook",
          url: "#",
          icon: <BiLogoFacebookCircle className="size-5" />,
        },
        {
          title: "Instagram",
          url: "https://www.instagram.com/keesdeen_active",
          icon: <BiLogoInstagram className="size-5" />,
        },
        {
          title: "Twitter",
          url: "https://x.com/keesdeenactive",
          icon: <FaXTwitter className="size-5" />,
        },
        {
          title: "TikTok",
          url: "https://www.tiktok.com/@keesdeen.active",
          icon: <FaTiktok className="size-5" />,
        },
      ],
    },
  ],
  footerLinks: [
    { title: "Privacy Policy", url: "/privacy_policy" },
    { title: "Terms of Service", url: "/terms_of_service" },
  ],
};
