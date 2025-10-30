import { useContext, useState } from "react";
import type { ButtonProps } from "@relume_io/relume-ui";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { mainLogo, smallLogo } from "../assets";
import { Search, ShoppingBag, Heart, User } from "lucide-react";
import { AuthContext } from "../context/AuthContext/AuthContext";
import { useShop } from "../context/ShopContext";
// import CurrencySwitcher from "./CurrencySwitcher";

type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type NavLink = {
  url: string;
  title: string;
};

type Props = {
  logo: ImageProps;
  mobileLogo: ImageProps;
  navLinks: NavLink[];
  buttons: ButtonProps[];
};

export type Navbar7Props = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const Navbar = (props: Navbar7Props) => {
  const { logo, navLinks } = {
    ...NavbarDefaults,
    ...props,
  } as Props;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const isMobile = useMediaQuery("(max-width: 991px)");

  const { user } = useContext(AuthContext);
  const { getCartCount, wishLists, isActive, setIsActive } = useShop();

  return (
    <nav className="fixed top-0 inset-x-0 z-20 flex min-h-16 w-full items-center shadow-xxsmall bg-background-light px-[5%] md:min-h-18 bg-none">
      <div className="mx-auto size-full max-w-full flex items-center justify-between">
        <Link to={`${logo.url}`}>
          <img
            src={logo.src}
            alt={logo.alt}
            className="inline-block w-[130px] sm:w-[200px]"
          />
        </Link>
        <div className="absolute hidden h-screen overflow-auto border-b border-border-primary bg-background-light px-[5%] pb-24 pt-4 md:pb-0 lg:static lg:ml-6 xl:flex lg:h-auto lg:flex-1 lg:items-center lg:justify-between lg:border-none lg:bg-none lg:px-0 lg:pt-0">
          <div className="flex flex-col items-center lg:flex-row">
            {navLinks.map((navLink, index) => (
              <div key={index}>
                <Link
                  to={navLink.url}
                  className={`relative block w-auto py-3 text-md lg:inline-block lg:px-4 lg:py-6 lg:text-base poppins text-brand-neutral hover:text-brand-primary ${
                    index === 0 ? "lg:hidden" : ""
                  }`}
                  onClick={() => {
                    if (isActive === true) {
                      setIsActive(!isActive);
                    }
                  }}
                >
                  {navLink.title}
                </Link>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex gap-2.5 items-center">
              {/* <CurrencySwitcher color="white" /> */}
              <Search
                width={20}
                height={20}
                className="text-brand-neutral hover:text-brand-primary cursor-pointer"
                onClick={() => setIsActive(!isActive)}
              />
              <Link className="relative" to="/cart">
                <ShoppingBag
                  width={20}
                  height={20}
                  className="text-brand-neutral hover:text-brand-primary cursor-pointer"
                  onClick={() => {
                    if (isActive === true) {
                      setIsActive(!isActive);
                    }
                  }}
                />
                {getCartCount() > 0 && (
                  <div className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[10px]">
                    {getCartCount()}
                  </div>
                )}
              </Link>
              <Link to="/wishlists" className="relative">
                <Heart
                  width={20}
                  height={20}
                  className="text-brand-neutral hover:text-brand-primary cursor-pointer"
                  onClick={() => {
                    if (isActive === true) {
                      setIsActive(!isActive);
                    }
                  }}
                />
                {wishLists.length > 0 && (
                  <div className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[10px]">
                    {wishLists.length}
                  </div>
                )}
              </Link>
              {user?.isAdmin ? (
                <div className="flex flex-col items-center">
                  <Link
                    to="/admin"
                    className="relative block w-auto text-md lg:inline-block lg:px-1 lg:text-md poppins  text-brand-neutral hover:text-brand-primary"
                  >
                    Admin
                  </Link>
                  <div className="h-[3px] w-[90%] bg-brand-neutral" />
                </div>
              ) : (
                <></>
              )}
              {/* big screen */}
            </div>
            {user ? (
              <Link to="/profile">
                <User
                  width={20}
                  height={20}
                  className="text-brand-neutral hover:text-brand-primary cursor-pointer"
                />
              </Link>
            ) : (
              <>
                <Link to="/auth/sign_in">
                  <User
                    width={20}
                    height={20}
                    className="text-brand-neutral hover:text-brand-primary cursor-pointer"
                  />
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="flex xl:hidden items-center gap-2 sm:gap-4">
          <Search
            width={20}
            height={20}
            className="text-brand-neutral hover:text-brand-primary cursor-pointer"
            onClick={() => setIsActive(!isActive)}
          />
          <Link className="relative" to="/cart">
            <ShoppingBag
              width={20}
              height={20}
              className="text-brand-neutral hover:text-brand-primary cursor-pointer"
              onClick={() => {
                if (isActive === true) {
                  setIsActive(!isActive);
                }
              }}
            />
            {/* <div className="h-4 w-4 p-1 bg-background-alternative absolute top-0 -right-2 text-text-alternative rounded-full flex items-center justify-center text-sm">
              {getCartCount()}
            </div> */}
            {getCartCount() > 0 && (
              <div className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[10px]">
                {getCartCount()}
              </div>
            )}
          </Link>
          <Link to="/wishlists" className="relative">
            <Heart
              width={20}
              height={20}
              className="text-brand-neutral hover:text-brand-primary cursor-pointer"
              onClick={() => {
                if (isActive === true) {
                  setIsActive(!isActive);
                }
              }}
            />
            {wishLists.length > 0 && (
              <div className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[10px]">
                {wishLists.length}
              </div>
            )}
          </Link>
          {user ? (
            <Link
              to="/profile"
              className="hidden sm:flex"
              // onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <User
                width={20}
                height={20}
                className="text-brand-neutral hover:text-brand-primary cursor-pointer"
              />
            </Link>
          ) : (
            <>
              <Link to="/auth/sign_in" className="hidden sm:flex">
                <User
                  width={20}
                  height={20}
                  className="text-brand-neutral hover:text-brand-primary cursor-pointer"
                />
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center">
          <div className="max-sm:hidden flex xl:hidden">
            {/* <CurrencySwitcher color="white" /> */}
          </div>
          <button
            className="-mr-2 flex size-12 cursor-pointer flex-col items-center justify-center xl:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={{
              open: { height: "100dvh" },
              close: { height: "auto" },
            }}
            animate={isMobileMenuOpen ? "open" : "close"}
            initial="close"
            exit="close"
            className="absolute left-0 right-0 top-full w-full overflow-hidden lg:hidden"
            transition={{ duration: 0.4 }}
          >
            <motion.div
              variants={{
                open: { y: 0 },
                close: { y: "-100%" },
              }}
              animate={isMobileMenuOpen ? "open" : "close"}
              initial="close"
              exit="close"
              transition={{ duration: 0.4 }}
              className="absolute left-0 right-0 top-0 block h-[100dvh] overflow-auto border-b border-border-primary bg-background-light px-[5%] pb-8 pt-4"
            >
              <div className="flex flex-col">
                {navLinks.map((navLink, index) => (
                  <div key={index}>
                    <Link
                      to={navLink.url}
                      className="block py-3 text-md poppins"
                      onClick={() => {
                        setIsMobileMenuOpen(!isMobileMenuOpen);
                        if (isActive === true) {
                          setIsActive(!isActive);
                        }
                      }}
                    >
                      {navLink.title}
                    </Link>
                  </div>
                ))}
                <div className="mt-6 flex flex-col items-stretch gap-4">
                  {user?.isAdmin ? (
                    <Link
                      to="/admin"
                      className="relative block w-auto text-md lg:inline-block lg:px-4 lg:text-base poppins  text-brand-neutral hover:text-brand-primary"
                    >
                      Admin
                    </Link>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export const NavbarDefaults: Navbar7Props = {
  logo: {
    url: "/",
    src: mainLogo,
    alt: "Logo image",
  },
  mobileLogo: {
    url: "/",
    src: smallLogo,
    alt: "Logo image",
  },
  navLinks: [
    { title: "Home", url: "/" },
    { title: "Shop All", url: "/collections/shop_all" },
    { title: "New In", url: "/collections/new_arrivals" },
    { title: "Active wears", url: "/collections/Active_wears" },
    { title: "Fitness Accessories", url: "/collections/Fitness_accessories" },
  ],
  buttons: [
    // {
    //   title: "Button",
    //   variant: "secondary",
    //   size: "sm",
    // },
    {
      title: "Login",
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
