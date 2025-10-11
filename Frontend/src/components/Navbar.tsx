"use client";

import { useContext, useState } from "react";
// import { useMediaQuery } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
// import { RxChevronDown } from "react-icons/rx";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { mainLogo, smallLogo } from "../assets";
import { IoBagOutline } from "react-icons/io5";
import { LuHeart, LuSearch } from "react-icons/lu";
import { CiUser } from "react-icons/ci";
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

export const Navbar7 = (props: Navbar7Props) => {
  const { logo, navLinks } = {
    ...Navbar7Defaults,
    ...props,
  } as Props;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const isMobile = useMediaQuery("(max-width: 991px)");

  const { user } = useContext(AuthContext);
  const { getCartCount, wishLists, isActive, setIsActive } = useShop();

  return (
    <nav className="fixed z-[999] flex min-h-16 w-full items-center shadow-xxsmall bg-background-light px-[5%] md:min-h-18 bg-none">
      <div className="mx-auto flex size-full max-w-full items-center justify-between">
        <Link to={`${logo.url}`}>
          <img
            src={logo.src}
            alt={logo.alt}
            className="inline-block w-[150px] md:w-[200px]"
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
              <LuSearch
                className="text-2xl cursor-pointer  text-brand-neutral hover:text-brand-primary"
                onClick={() => setIsActive(!isActive)}
              />
              <Link className="relative" to="/cart">
                <IoBagOutline
                  className="text-2xl text-gradient  text-brand-neutral hover:text-brand-primary"
                  onClick={() => {
                    if (isActive === true) {
                      setIsActive(!isActive);
                    }
                  }}
                />
                {/* <div className="h-4 w-4 p-2 bg-background-alternative absolute top-0 -right-2 text-text-alternative rounded-full text-sm">
                  {getCartCount()}
                </div> */}
                {getCartCount() > 0 && (
                  <div className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[10px]">
                    {getCartCount()}
                  </div>
                )}
              </Link>
              <Link to="/wishlists" className="relative">
                <LuHeart
                  className="text-2xl text-brand-neutral hover:text-brand-primary"
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
                <CiUser className="text-3xl  text-brand-neutral hover:text-brand-primary" />
              </Link>
            ) : (
              <>
                <Link to="/auth/login">
                  <CiUser className="text-3xl  text-brand-neutral hover:text-brand-primary" />
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="flex xl:hidden gap-2 items-center">
          <LuSearch
            className="text-xl cursor-pointer text-text-primary"
            onClick={() => setIsActive(!isActive)}
          />
          <Link className="relative" to="/cart">
            <IoBagOutline
              className="text-xl  text-brand-neutral hover:text-brand-primary"
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
            <LuHeart
              className="text-xl text-brand-neutral hover:text-brand-primary"
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
              // onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <CiUser className="text-2xl text-text-primary" />
            </Link>
          ) : (
            <>
              <Link to="/auth/login">
                <CiUser className="text-2xl text-text-primary" />
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

// const SubMenu = ({
//   title,
//   megaMenu,
//   isMobile,
// }: {
//   title: string;
//   megaMenu: MegaMenuProps;
//   isMobile: boolean;
// }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   return (
//     <div
//       onMouseEnter={() => !isMobile && setIsDropdownOpen(true)}
//       onMouseLeave={() => !isMobile && setIsDropdownOpen(false)}
//     >
//       <button
//         className="relative flex w-full items-center justify-between whitespace-nowrap py-3 text-md lg:w-auto lg:justify-start lg:gap-2 lg:px-4 lg:py-6 lg:text-base"
//         onClick={() => setIsDropdownOpen((prev) => !prev)}
//       >
//         <span className="text-text-primary text-md lg:text-base poppins hover:text-brand-primary">
//           {title}
//         </span>
//         <motion.span
//           animate={isDropdownOpen ? "rotated" : "initial"}
//           variants={{
//             rotated: { rotate: 180 },
//             initial: { rotate: 0 },
//           }}
//           transition={{ duration: 0.3 }}
//         >
//           <RxChevronDown />
//         </motion.span>
//       </button>
//       <AnimatePresence>
//         {isDropdownOpen && (
//           <motion.nav
//             variants={{
//               open: {
//                 opacity: 1,
//                 height: "var(--height-open, auto)",
//               },
//               close: {
//                 opacity: 0,
//                 height: "var(--height-close, 0)",
//               },
//             }}
//             animate={isDropdownOpen ? "open" : "close"}
//             initial="close"
//             exit="close"
//             transition={{ duration: 0.2 }}
//             className="bottom-auto left-0 top-full w-full min-w-full max-w-full overflow-hidden bg-background-primary lg:absolute lg:w-screen lg:border-b lg:border-border-primary lg:px-[5%] lg:[--height-close:auto]"
//           >
//             <div className="mx-auto flex size-full max-w-full items-center justify-between">
//               <div className="flex w-full flex-col lg:flex-row">
//                 <div className="grid flex-1 grid-cols-1 content-start items-start gap-x-8 gap-y-6 py-4 sm:py-0 md:grid-cols-2 md:py-8 lg:auto-cols-fr lg:grid-cols-4 lg:content-stretch lg:items-stretch lg:gap-y-0">
//                   {megaMenu.linkGroups.map((linkGroup, index) => (
//                     <div
//                       key={index}
//                       className="grid auto-cols-fr grid-cols-1 grid-rows-[max-content_max-content_max-content_max-content_max-content] gap-y-2 md:gap-y-4"
//                     >
//                       <h4 className="text-2xl font-semibold leading-[1.3]">
//                         {linkGroup.title}
//                       </h4>
//                       {linkGroup.subMenuLinks.map((subMenuLink, index) => (
//                         <a
//                           key={index}
//                           href={subMenuLink.url}
//                           className="grid w-full auto-cols-fr grid-cols-[max-content_1fr] items-start gap-x-3 py-2"
//                           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                         >
//                           {/* <div className="flex size-6 flex-col items-center justify-center">
//                             <img
//                               src={subMenuLink.image.src}
//                               alt={subMenuLink.image.alt}
//                               className="shrink-0"
//                             />
//                           </div> */}
//                           <div
//                             className="flex flex-col items-start justify-center"
//                             onClick={() =>
//                               setIsMobileMenuOpen(!isMobileMenuOpen)
//                             }
//                           >
//                             <h5 className="font-medium">{subMenuLink.title}</h5>
//                             <p className="hidden text-sm md:block">
//                               {subMenuLink.description}
//                             </p>
//                           </div>
//                         </a>
//                       ))}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </motion.nav>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// const RelumeLogo = (props: React.SVGProps<SVGSVGElement>) => {
//   return (
//     <svg
//       width="currentWidth"
//       height="currentHeight"
//       viewBox="0 0 24 24"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       {...props}
//     >
//       <path
//         fill-rule="evenodd"
//         clip-rule="evenodd"
//         d="M20.73 7.12L20.59 6.87C20.4094 6.56769 20.1547 6.31643 19.85 6.14L13.14 2.27C12.8362 2.09375 12.4913 2.00062 12.14 2H11.85C11.4987 2.00062 11.1538 2.09375 10.85 2.27L4.14 6.15C3.83697 6.32526 3.58526 6.57697 3.41 6.88L3.27 7.13C3.09375 7.43384 3.00062 7.77874 3 8.13V15.88C3.00062 16.2313 3.09375 16.5762 3.27 16.88L3.41 17.13C3.58979 17.4295 3.84049 17.6802 4.14 17.86L10.86 21.73C11.1623 21.9099 11.5082 22.0033 11.86 22H12.14C12.4913 21.9994 12.8362 21.9063 13.14 21.73L19.85 17.85C20.156 17.6787 20.4087 17.426 20.58 17.12L20.73 16.87C20.9041 16.5653 20.9971 16.221 21 15.87V8.12C20.9994 7.76874 20.9063 7.42384 20.73 7.12ZM11.85 4H12.14L18 7.38L12 10.84L6 7.38L11.85 4ZM13 19.5L18.85 16.12L19 15.87V9.11L13 12.58V19.5Z"
//         fill="currentColor"
//       ></path>
//     </svg>
//   );
// };

export const Navbar7Defaults: Navbar7Props = {
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
    { title: "New In", url: "/collections/new_in" },
    { title: "Active wear", url: "/collections/Active_wear" },
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
