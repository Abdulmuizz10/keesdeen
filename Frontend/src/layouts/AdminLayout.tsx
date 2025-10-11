import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import {
  // Button,
  // DropdownMenuGroup,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  Input,
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogDescription,
  Button,
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
  BiPaperPlane,
  // BiPieChartAlt2,
  // BiSearch,
} from "react-icons/bi";
import { BiArrowBack } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa6";
import { FiX } from "react-icons/fi";
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
import Axios from "axios";
import { toast } from "react-toastify";
import { currency, URL } from "../lib/constants";
import { useShop } from "../context/ShopContext";
import { IoPeopleOutline } from "react-icons/io5";
import AdminSpinner from "../components/AdminSpinner";
import { formatAmountDefault } from "../lib/utils";

interface AdminLayoutProps {
  children?: React.ReactNode;
  animation: Boolean;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, animation }) => {
  // const [isSearchIconClicked, setIsSearchIconClicked] =
  //   useState<boolean>(false);
  // const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const isMobile = useMediaQuery("(max-width: 991px)");
  const { adminLoader } = useShop();

  return (
    <div className={`${animation ? "opacity-0" : " opacity-100"}`}>
      {adminLoader && <AdminSpinner />}
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
  const [loading, setLoading] = useState<boolean>(false);
  const [utilityLoading, setUtilityLoading] = useState<boolean>(true);
  const { change, setChange } = useShop();
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [order, setOrder] = useState<any>("");
  const [utility, setUtility] = useState<any>();
  const [utilityCouponCode, setUtilityCouponCode] = useState<string>("");
  const [utilityDeliveryFee, setUtilityDeliveryFee] = useState<string>("");
  const [utilityDiscount, setUtilityDiscount] = useState<string>("");

  const handleQuerySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await Axios.get(`${URL}/orders/${searchQuery}`, {
        withCredentials: true, // Include cookies in the request
      });
      setOrder(response.data);
    } catch (error) {
      toast.error("Error fetching order");
    } finally {
      setLoading(false);
    }
  };

  const handleUtilitySubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setUtilityLoading(true);
    const formData: Record<string, any> = {};

    if (utilityCouponCode) formData.couponCode = utilityCouponCode;
    if (utilityDeliveryFee) formData.deliveryFee = utilityDeliveryFee;
    if (utilityDiscount) formData.discount = utilityDiscount;
    try {
      const response = await Axios.put(`${URL}/utility`, formData, {
        withCredentials: true,
      });
      setUtility(response.data);
      setChange(!change);
    } catch (error) {
      toast.error("Error submitting utilities");
    } finally {
      setUtilityLoading(false);
    }
  };

  useEffect(() => {
    const handleGetUtility = async () => {
      setUtilityLoading(true);
      try {
        const response = await Axios.get(`${URL}/utility`, {
          withCredentials: true, // Include cookies in the request
        });
        setUtility(response.data);
      } catch (error) {
        toast.error("Error getting utilities");
      } finally {
        setUtilityLoading(false);
      }
    };

    handleGetUtility();
  }, [change]);

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

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger
                className="p-2 font-normal"
                icon={<RxChevronDown />}
              >
                <span className="flex items-center gap-3">
                  <FaRegUser className="size-6 shrink-0" />
                  <p className="bricolage-grotesque">Subscribers</p>
                </span>
              </AccordionTrigger>
              <AccordionContent className="flex items-center gap-x-2 p-2 pl-[1rem] text-center">
                <Link
                  to="/admin/subscribers"
                  className="flex w-full items-center gap-3"
                >
                  <IoPeopleOutline className="size-5 shrink-0" />
                  <p className="bricolage-grotesque">All subscribers</p>
                </Link>
              </AccordionContent>
              <AccordionContent className="flex items-center gap-x-2 p-2 pl-[1rem] text-center">
                <Link
                  to="/admin/email-to-subscribers"
                  className="flex w-full items-center gap-3"
                >
                  <BiPaperPlane className="size-5 shrink-0" />
                  <p className="bricolage-grotesque">Send email to all</p>
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div>
            <div className="hidden lg:flex">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-white hover:bg-gray-100 text-black border rounded-lg flex items-center gap-x-3 w-full mt-3 poppins py-[12px]">
                    Click to search order
                  </Button>
                </DialogTrigger>
                <DialogPortal>
                  <DialogOverlay className="bg-black/50" />
                  <DialogContent className="w-full flex items-center justify-center max-w-md bg-white py-6 px-8 rounded-lg">
                    <DialogHeader>
                      <DialogDescription className="text-lg font-medium mb-2 text-black">
                        Enter order ID
                      </DialogDescription>

                      {/* Search Form */}
                      <form
                        className="flex gap-3 poppins"
                        onSubmit={handleQuerySubmit}
                      >
                        <div className="flex items-center border rounded border-neutral-300 bg-gray-50 px-2">
                          <Input
                            type="text"
                            placeholder="Order ID"
                            className="rounded poppins w-[330px] bg-gray-50 focus:outline-none border-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            required
                          />
                          <FiX
                            className="text-xl cursor-pointer"
                            onClick={() => {
                              setSearchQuery("");
                              setOrder("");
                            }}
                          />
                        </div>
                        <Button
                          variant="primary"
                          className="w-full bg-brand-neutral text-text-light px-6 rounded-md poppins border-none"
                        >
                          Search
                        </Button>
                      </form>

                      {/* Order Display */}
                      <div className="w-full flex items-center justify-center pt-5">
                        {searchQuery.length > 1 &&
                          (loading ? (
                            <p className="text-gray-500">Loading...</p>
                          ) : (
                            order && (
                              <div className="w-full border p-5 rounded-md flex flex-col items-start gap-2 bg-gray-50">
                                <p className=" text-gray-700">
                                  <span className="font-medium">Name:</span>{" "}
                                  {order.shippingAddress.firstName}{" "}
                                  {order.shippingAddress.lastName}
                                </p>
                                <p className="text-gray-700">
                                  <span className="font-medium">
                                    Email Address:
                                  </span>{" "}
                                  {order.email}
                                </p>
                                <p className="text-gray-700">
                                  <span className="font-medium">
                                    Total Amount:
                                  </span>{" "}
                                  {formatAmountDefault(
                                    currency,
                                    order.totalPrice
                                  )}
                                </p>
                                <p className="text-gray-700">
                                  <span className="font-medium">
                                    Date Ordered:
                                  </span>{" "}
                                  {new Date(order.createdAt).toLocaleString()}
                                </p>
                                <p className="text-gray-700">
                                  <span className="font-medium">
                                    Order Status:
                                  </span>{" "}
                                  {order.isDelivered === "Delivered" ? (
                                    <span className="text-green-500 font-semibold">
                                      Delivered
                                    </span>
                                  ) : (
                                    <span className="text-brand-secondary font-semibold">
                                      {order.isDelivered}
                                    </span>
                                  )}
                                </p>
                                <div className="w-full flex justify-end">
                                  <DialogTrigger asChild>
                                    <Link
                                      to={`/admin/order_details/${order._id}`}
                                    >
                                      <Button className="bg-brand-neutral text-text-light p-3 rounded-md poppins border-none">
                                        more details
                                        <BiArrowBack className="rotate-180" />
                                      </Button>
                                    </Link>
                                  </DialogTrigger>
                                </div>
                              </div>
                            )
                          ))}
                      </div>
                    </DialogHeader>
                  </DialogContent>
                </DialogPortal>
              </Dialog>
            </div>

            <div className="hidden lg:flex mt-1">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-white hover:bg-gray-100 text-black border rounded-lg flex items-center gap-x-3 w-full mt-3 poppins py-[12px]">
                    Configure utilities
                  </Button>
                </DialogTrigger>
                <DialogPortal>
                  <DialogOverlay className="bg-black/50" />
                  <DialogContent className="w-full flex items-center justify-center max-w-sm bg-white py-6 px-8 rounded-lg">
                    <DialogHeader>
                      <DialogDescription className="text-lg font-medium mb-2 text-black">
                        Set Delivery fee and Coupon code
                      </DialogDescription>

                      {/* Search Form */}

                      <form
                        className="flex gap-3 poppins flex-col"
                        onSubmit={handleUtilitySubmit}
                      >
                        <p className="flex items-center gap-2">
                          Coupon code :{" "}
                          <span className="font-medium">
                            {utilityLoading ? (
                              <div className="small-loader" />
                            ) : (
                              utility?.couponCode
                            )}
                          </span>
                        </p>
                        <div className="flex items-center border rounded border-neutral-300 bg-gray-50 px-2">
                          <Input
                            type="text"
                            placeholder="Coupon code"
                            className="rounded poppins w-[330px] bg-gray-50 focus:outline-none border-none"
                            value={utilityCouponCode}
                            onChange={(e) =>
                              setUtilityCouponCode(e.target.value)
                            }
                          />
                          <FiX
                            className="text-xl cursor-pointer"
                            onClick={() => {
                              setUtilityCouponCode("");
                            }}
                          />
                        </div>

                        <p className="flex items-center gap-2">
                          Delivery fee :{" "}
                          <span className="font-medium">
                            {utilityLoading ? (
                              <div className="small-loader" />
                            ) : (
                              formatAmountDefault(
                                currency,
                                utility?.deliveryFee
                              )
                            )}
                          </span>
                        </p>
                        <div className="flex items-center border rounded border-neutral-300 bg-gray-50 px-2">
                          <Input
                            type="number"
                            placeholder="Delivery fee"
                            className="rounded poppins w-[330px] bg-gray-50 focus:outline-none border-none"
                            value={utilityDeliveryFee}
                            onChange={(e) =>
                              setUtilityDeliveryFee(e.target.value)
                            }
                          />
                          <FiX
                            className="text-xl cursor-pointer"
                            onClick={() => {
                              setUtilityDeliveryFee("");
                            }}
                          />
                        </div>

                        <p className="flex items-center gap-2">
                          Discount :{" "}
                          <span className="font-medium">
                            {utilityLoading ? (
                              <div className="small-loader" />
                            ) : (
                              `${utility?.discount}%`
                            )}
                          </span>
                        </p>
                        <div className="flex items-center border rounded border-neutral-300 bg-gray-50 px-2">
                          <Input
                            type="number"
                            placeholder="Discount"
                            className="rounded poppins w-[330px] bg-gray-50 focus:outline-none border-none"
                            value={utilityDiscount}
                            onChange={(e) => setUtilityDiscount(e.target.value)}
                          />
                          <FiX
                            className="text-xl cursor-pointer"
                            onClick={() => {
                              setUtilityDiscount("");
                            }}
                          />
                        </div>
                        <Button
                          variant="primary"
                          className="w-full bg-brand-neutral text-text-light px-4 rounded-md poppins border-none"
                        >
                          Submit
                        </Button>
                      </form>
                    </DialogHeader>
                  </DialogContent>
                </DialogPortal>
              </Dialog>
            </div>
          </div>

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
