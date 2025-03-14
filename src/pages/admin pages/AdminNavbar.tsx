"use client";

import { useState } from "react";
import { Button, useMediaQuery } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { AnimatePresence, motion } from "framer-motion";
import { RxChevronDown } from "react-icons/rx";
import { Link } from "react-router-dom";
import { mainLogo, smallLogo } from "../../assets";

type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type NavLink = {
  url: string;
  title: string;
  subMenuLinks?: NavLink[];
};

type Props = {
  logo: ImageProps;
  navLinks: NavLink[];
  buttons: ButtonProps[];
};

export type Navbar2Props = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const Navbar2 = (props: Navbar2Props) => {
  const { logo, navLinks, buttons } = {
    ...Navbar2Defaults,
    ...props,
  } as Props;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 991px)");

  return (
    <nav className="flex fixed w-full items-center border-b border-border-primary bg-background-light lg:min-h-18 lg:px-[5%]">
      <div className="mx-auto size-full lg:grid lg:grid-cols-[0.375fr_1fr_0.375fr] lg:items-center lg:justify-between lg:gap-4">
        <div className="flex min-h-16 items-center justify-between px-[5%] md:min-h-18 lg:min-h-full lg:px-0">
          <Link to="/">
            <a href={logo.url}>
              <img
                src={logo.src}
                alt={logo.alt}
                className="w-full h-[25px] hidden sm:flex"
              />
              <img
                src={smallLogo}
                alt={smallLogo}
                className="w-full h-[25px] flex sm:hidden"
              />
            </a>
          </Link>
          <div className="flex items-center gap-4 lg:hidden">
            <div>
              {buttons.map((button, index) => (
                <Button key={index} className="w-full px-4 py-1" {...button}>
                  {button.title}
                </Button>
              ))}
            </div>
            <button
              className="-mr-2 flex size-12 flex-col items-center justify-center"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <motion.span
                className="my-[3px] h-0.5 w-6 bg-black"
                animate={isMobileMenuOpen ? ["open", "rotatePhase"] : "closed"}
                variants={topLineVariants}
              />
              <motion.span
                className="my-[3px] h-0.5 w-6 bg-black"
                animate={isMobileMenuOpen ? "open" : "closed"}
                variants={middleLineVariants}
              />
              <motion.span
                className="my-[3px] h-0.5 w-6 bg-black"
                animate={isMobileMenuOpen ? ["open", "rotatePhase"] : "closed"}
                variants={bottomLineVariants}
              />
            </button>
          </div>
        </div>
        <motion.div
          variants={{
            open: {
              height: "var(--height-open, 100dvh)",
            },
            close: {
              height: "var(--height-closed, 0)",
            },
          }}
          animate={isMobileMenuOpen ? "open" : "close"}
          initial="close"
          exit="close"
          transition={{ duration: 0.4 }}
          className="overflow-hidden px-[5%] text-center lg:flex lg:items-center lg:justify-center lg:px-0 lg:[--height-closed:auto] lg:[--height-open:auto]"
        >
          {navLinks.map((navLink, index) => (
            <div key={index} className="first:pt-4 lg:first:pt-0">
              {navLink.subMenuLinks && navLink.subMenuLinks.length > 0 ? (
                <SubMenu
                  navLink={navLink}
                  isMobile={isMobile}
                  setIsMobileOpen={setIsMobileMenuOpen}
                />
              ) : (
                <Link
                  to={navLink.url}
                  className="block py-3 text-md lg:px-4 lg:py-2 lg:text-base"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {navLink.title}
                </Link>
              )}
            </div>
          ))}
        </motion.div>
        <div className="hidden justify-self-end lg:block">
          {buttons.map((button, index) => (
            <Button key={index} className="px-6 py-2" {...button}>
              {button.title}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

const SubMenu = ({
  navLink,
  isMobile,
  setIsMobileOpen,
}: {
  navLink: NavLink;
  isMobile: boolean;
  setIsMobileOpen: any;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav
      onMouseEnter={() => !isMobile && setIsDropdownOpen(true)}
      onMouseLeave={() => !isMobile && setIsDropdownOpen(false)}
    >
      <button
        className="flex w-full items-center justify-center gap-4 py-3 text-center text-md lg:w-auto lg:flex-none lg:justify-start lg:gap-2 lg:px-4 lg:py-2 lg:text-base"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <span>{navLink.title}</span>
        <motion.span
          animate={isDropdownOpen ? "rotated" : "initial"}
          variants={{
            rotated: { rotate: 180 },
            initial: { rotate: 0 },
          }}
          transition={{ duration: 0.3 }}
        >
          <RxChevronDown />
        </motion.span>
      </button>
      {isDropdownOpen && (
        <AnimatePresence>
          {/* <motion.nav
            animate={isDropdownOpen ? "open" : "close"}
            initial="close"
            exit="close"
            variants={{
              open: {
                visibility: "visible",
                opacity: "var(--opacity-open, 100%)",
                y: 0,
              },
              close: {
                visibility: "hidden",
                opacity: "var(--opacity-close, 0)",
                y: "var(--y-close, 0%)",
              },
            }}
            transition={{ duration: 0.2 }}
            className="bg-background-primary lg:absolute lg:z-50 lg:border lg:border-border-primary lg:p-2 lg:[--y-close:25%]"
          >
            {navLink.subMenuLinks?.map((subMenuLink, index) => (
              <Link
                key={index}
                to={subMenuLink.url}
                className="block py-3 text-center lg:px-4 lg:py-2 lg:text-left"
                onClick={() => setIsMobileOpen(false)}
              >
                {subMenuLink.title}
              </Link>
            ))}
          </motion.nav> */}
          <motion.nav
            animate={isDropdownOpen ? "open" : "close"}
            initial="close"
            exit="close"
            variants={{
              open: {
                visibility: "visible",
                opacity: "var(--opacity-open, 100%)",
                y: 0,
              },
              close: {
                visibility: "hidden",
                opacity: "var(--opacity-close, 0)",
                y: "var(--y-close, 0%)",
              },
            }}
            transition={{ duration: 0.2 }}
            className="sm:bg-white dark:bg-gray-800 lg:absolute lg:z-50 lg:border lg:border-gray-300 dark:lg:border-gray-600 lg:p-2 lg:rounded-lg lg:[--y-close:25%] transition-all duration-200 ease-in-out"
          >
            {navLink.subMenuLinks?.map((subMenuLink, index) => (
              <Link
                key={index}
                to={subMenuLink.url}
                className="block py-1 px-3 text-center text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 lg:text-left rounded-md transition-colors duration-200"
                onClick={() => setIsMobileOpen(false)}
              >
                {subMenuLink.title}
              </Link>
            ))}
          </motion.nav>
        </AnimatePresence>
      )}
    </nav>
  );
};

export const Navbar2Defaults: Navbar2Props = {
  logo: {
    url: "/",
    src: mainLogo,
    alt: "Logo image",
  },
  navLinks: [
    { title: "Home", url: "/admin" },
    { title: "Users", url: "/admin/customers" },
    { title: "Products", url: "/admin/products" },
    { title: "Orders", url: "/admin/orders" },
    { title: "Add products", url: "/admin/add_product" },
    {
      title: "Dashboard",
      url: "/dashboard",
      subMenuLinks: [
        { title: "sales", url: "/admin/dashboard/sales" },
        { title: "orders", url: "/admin/dashboard/orders" },
      ],
    },
  ],
  buttons: [
    {
      title: "Button",
      size: "sm",
    },
  ],
};

const topLineVariants = {
  open: {
    translateY: 8,
    transition: { delay: 0.1 },
  },
  rotatePhase: {
    rotate: -45,
    transition: { delay: 0.2 },
  },
  closed: {
    translateY: 0,
    rotate: 0,
    transition: { duration: 0.2 },
  },
};

const middleLineVariants = {
  open: {
    width: 0,
    transition: { duration: 0.1 },
  },
  closed: {
    width: "1.5rem",
    transition: { delay: 0.3, duration: 0.2 },
  },
};

const bottomLineVariants = {
  open: {
    translateY: -8,
    transition: { delay: 0.1 },
  },
  rotatePhase: {
    rotate: 45,
    transition: { delay: 0.2 },
  },
  closed: {
    translateY: 0,
    rotate: 0,
    transition: { duration: 0.2 },
  },
};
