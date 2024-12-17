import React from "react";
import { Outlet } from "react-router-dom";
import {
  // Button,
  // DropdownMenuGroup,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  // Input,
  SheetClose,
  SheetOverlay,
  SheetPortal,
} from "@relume_io/relume-ui";
import {
  // BiArchive,
  // BiBarChartAlt2,
  // BiBell,
  // BiCog,
  // BiFile,
  // BiHelpCircle,
  BiHome,
  BiLayer,
  // BiPieChartAlt2,
  // BiSearch,
} from "react-icons/bi";
import { FaRegUser } from "react-icons/fa6";
// import { FaRegPaperPlane } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  // DropdownMenu,
  // DropdownMenuContent,
  // DropdownMenuItem,
  // DropdownMenuTrigger,
  Sheet,
  SheetContent,
  SheetTrigger,
  useMediaQuery,
} from "@relume_io/relume-ui";
// import { MdTrendingUp } from "react-icons/md";
import {
  RxChevronDown,
  // RxChevronRight,
  RxCross2,
  RxHamburgerMenu,
} from "react-icons/rx";
// import { AnimatePresence, motion } from "framer-motion";
// import clsx from "clsx";
import { mainLogo } from "../assets";
import { Link } from "react-router-dom";

interface AdminLayoutProps {
  children?: React.ReactNode;
  animation: Boolean;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, animation }) => {
  // const [isSearchIconClicked, setIsSearchIconClicked] =
  //   useState<boolean>(false);
  // const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const isMobile = useMediaQuery("(max-width: 991px)");
  return (
    <div className={`${animation ? "opacity-0" : " opacity-100"}`}>
      <main className="flex min-h-screen flex-col lg:flex-row bg-white">
        <div className="absolute top-0 z-10 flex min-h-16 flex-col px-6 md:min-h-18 md:px-8 lg:sticky lg:h-screen lg:min-h-[auto] lg:w-[15.5rem] lg:min-w-[15.5rem]  lg:px-0 lg:py-6">
          <div className="flex flex-1 flex-row items-center lg:flex-col lg:items-stretch">
            <Link
              to="/"
              className="order-1 ml-6 flex justify-start lg:order-none lg:mb-6 lg:ml-6 lg:block lg:self-start"
            >
              <img src={mainLogo} alt="Relume logo" className="w-full h-7" />
            </Link>
            {isMobile ? (
              <Sheet>
                <SheetTrigger>
                  <RxHamburgerMenu className="size-8" />
                </SheetTrigger>
                <SheetPortal>
                  <SheetOverlay className="bg-black/60" />
                  <SheetClose className="right-5 top-5 text-white">
                    <RxCross2 className="size-6" />
                  </SheetClose>
                  <SheetContent
                    side="left"
                    className="w-[80vw] overflow-hidden md:w-full md:max-w-[19.5rem]"
                  >
                    <Navigation />
                  </SheetContent>
                </SheetPortal>
              </Sheet>
            ) : (
              <Navigation />
            )}
          </div>
        </div>
        <main className="flex-1 py-20 px-4 w-full bg-background-primary lg:p-5 min-h-screen h-screen overflow-y-auto">
          {children}
          <Outlet />
        </main>
      </main>
    </div>
  );
};

const Navigation = () => {
  return (
    <nav className="absolute left-0 right-auto top-0 float-right h-full w-[80vw] max-w-[none] md:w-full md:max-w-[19.5rem] lg:relative lg:inset-auto lg:w-auto lg:max-w-[auto]">
      <div className="absolute flex size-full flex-col gap-4 border-r border-border-primary bg-white py-6 lg:gap-6 lg:border-none lg:py-0">
        <div className="flex size-full flex-col overflow-auto px-4 gap-4 no-scrollbar text-[15.5px]">
          <Link
            to="/admin"
            className="flex items-center gap-x-2 p-2 text-center"
          >
            <span className="flex w-full items-center gap-3">
              <BiHome className="size-6 shrink-0" />
              <p className="bricolage-grotesque">Home</p>
            </span>
          </Link>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger
                className="p-2 font-normal"
                icon={<RxChevronDown />}
              >
                <span className="flex items-center gap-3">
                  <BiLayer className="size-6 shrink-0" />
                  <p className="bricolage-grotesque">Orders</p>
                </span>
              </AccordionTrigger>
              <AccordionContent className="flex items-center gap-x-2 p-2 pl-[1rem] text-center">
                <Link
                  to="/admin/orders"
                  className="flex w-full items-center gap-3"
                >
                  <BiLayer className="size-6 shrink-0" />
                  <p className="bricolage-grotesque">All Orders</p>
                </Link>
              </AccordionContent>
              <AccordionContent className="flex items-center gap-x-2 p-2 pl-[1rem] text-center">
                <Link
                  to="/admin/pending_orders"
                  className="flex w-full items-center gap-3"
                >
                  <BiLayer className="size-6 shrink-0" />
                  <p className="bricolage-grotesque">Pending orders</p>
                </Link>
              </AccordionContent>
              <AccordionContent className="flex items-center gap-x-2 p-2 pl-[1rem] text-center">
                <Link
                  to="/admin/delivered_orders"
                  className="flex w-full items-center gap-3"
                >
                  <BiLayer className="size-6 shrink-0" />
                  <p className="bricolage-grotesque">Delivered orders</p>
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Link
            to="/admin/users"
            className="flex items-center gap-x-2 p-2 text-center"
          >
            <span className="flex w-full items-center gap-3">
              <FaRegUser className="size-5 shrink-0" />
              <p className="bricolage-grotesque">Users</p>
            </span>
          </Link>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger
                className="p-2 font-normal"
                icon={<RxChevronDown />}
              >
                <span className="flex items-center gap-3">
                  <BiLayer className="size-6 shrink-0" />
                  <p className="bricolage-grotesque">Products</p>
                </span>
              </AccordionTrigger>
              <AccordionContent className="flex items-center gap-x-2 p-2 pl-[1rem] text-center">
                <Link
                  to="/admin/products"
                  className="flex w-full items-center gap-3"
                >
                  <BiLayer className="size-6 shrink-0" />
                  <p className="bricolage-grotesque">All products</p>
                </Link>
              </AccordionContent>
              <AccordionContent className="flex items-center gap-x-2 p-2 pl-[1rem] text-center">
                <Link
                  to="/admin/add_product"
                  className="flex w-full items-center gap-3"
                >
                  <BiLayer className="size-6 shrink-0" />
                  <p className="bricolage-grotesque">Create product</p>
                </Link>
              </AccordionContent>
              <AccordionContent className="flex items-center gap-x-2 p-2 pl-[1rem] text-center">
                <Link
                  to="/admin/best_sellers"
                  className="flex w-full items-center gap-3"
                >
                  <BiLayer className="size-6 shrink-0" />
                  <p className="bricolage-grotesque">Add to best seller</p>
                </Link>
              </AccordionContent>
              <AccordionContent className="flex items-center gap-x-2 p-2 pl-[1rem] text-center">
                <Link
                  to="/admin/new_arrivals"
                  className="flex w-full items-center gap-3"
                >
                  <BiLayer className="size-6 shrink-0" />
                  <p className="bricolage-grotesque">Add to new arrival</p>
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger
                className="p-2 font-normal"
                icon={
                  <RxChevronDown className="shrink-0 text-text-primary transition-transform duration-300" />
                }
              >
                <span className="flex items-center gap-3">
                  <BiPieChartAlt2 className="size-6 shrink-0" />
                  <p>Analytics</p>
                </span>
              </AccordionTrigger>
              <AccordionContent className="flex items-center gap-x-2 p-2 pl-[2.75rem] text-center">
                <Link
                  to="/admin/dashboard/sales"
                  className="flex w-full items-center gap-3"
                >
                  <MdTrendingUp className="size-6 shrink-0" />
                  <p>Sales</p>
                </Link>
              </AccordionContent>
              <AccordionContent className="flex items-center gap-x-2 p-2 pl-[2.75rem] text-center">
                <Link
                  to="/admin/dashboard/orders"
                  className="flex w-full items-center gap-3"
                >
                  <FaRegPaperPlane />
                  <p>Orders</p>
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion> */}
        </div>
        {/* <div className="flex flex-col gap-4 px-4 lg:gap-6">
          <div className="flex flex-col">
            <Link to="#" className="flex items-center gap-x-2 p-2 text-center">
              <span className="flex w-full items-center gap-3">
                <BiHelpCircle className="size-6 shrink-0" />
                <p>Support</p>
              </span>
            </Link>
            <Link to="#" className="flex items-center gap-x-2 p-2 text-center">
              <span className="flex w-full items-center gap-3">
                <BiCog className="size-6 shrink-0" />
                <p>Settings</p>
              </span>
            </Link>
          </div>
        </div> */}
      </div>
    </nav>
  );
};

export default AdminLayout;
