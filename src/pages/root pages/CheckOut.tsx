import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@relume_io/relume-ui";
import { useShop } from "../../context/ShopContext";
import { formatAmount } from "../../lib/utils";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import { toast } from "react-toastify";
import { Product } from "../../lib/types";
import Axios from "axios";
import { URL } from "../../lib/constants";
import { AuthContext } from "../../context/AuthContext/AuthContext";

interface ProductListProps {
  products: Product[];
}

const CheckOut: React.FC<ProductListProps> = ({}) => {
  const { user } = useContext(AuthContext);
  const { getCartAmount, delivery_fee, orderHistory, setOrderHistory } =
    useShop();
  const subtotal = getCartAmount();
  const [coupon, setCoupon] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [_, setPaymentToken] = useState<string | null>(null);
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const { getCartDetailsForOrder } = useShop();

  const orderedItems = getCartDetailsForOrder();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const finalTotal = subtotal - (subtotal * discount) / 100;

  const applyCoupon = () => {
    if (coupon === "SAVE10") {
      setDiscount(10);
    } else {
      toast.error("Invalid Coupon Code");
    }
  };

  const handleOrderSubmission = async (data: any, token: string | null) => {
    const today = new Date().toISOString();

    let orderData = {
      ...data,
      user: user.id,
      totalPrice: finalTotal + delivery_fee,
      coupon,
      currency: "GBP",
      discount,
      sourceId: token,
      orderedItems,
      paidAt: today,
      shippingPrice: delivery_fee,
      paymentMethod: "Card",
    };

    setOrderHistory([...orderHistory, orderData]);

    if (token) {
      try {
        const res = await Axios.post(`${URL}/orders`, orderData);
        console.log(res.data);
        setOrderHistory([...orderHistory, res.data]);
        toast("Order placed successfully!");
      } catch (error) {
        console.error("Order submission failed:", error);
        toast.error("Order submission failed. Please try again.");
      }
    }

    setPaymentToken(null);
    setHasPaid(false); // Reset payment state for the next order
    // toast("Order placed successfully!");
    trigger(); // Revalidate form to ensure button behaves as expected
  };

  const onPaymentSuccess = (token: string) => {
    setHasPaid(true);
    if (isValid && token) {
      handleSubmit((data) => handleOrderSubmission(data, token))();
    }
  };

  // const APP_ID = import.meta.env.VITE_SQUARE_APP_ID;
  // const LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID;

  console.log(import.meta.env.VITE_SQUARE_LOCATION_ID);

  return (
    <section className="px-[5%] py-24 md:py-30">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section: Delivery Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            <form className="grid grid-cols-2 gap-6">
              {/* Form Fields */}
              <div className="relative w-full">
                <input
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  type="text"
                  placeholder="First name"
                  className="border border-border-secondary px-2 py-3 w-full rounded-md"
                />
                {errors.firstName && (
                  <p className="absolute text-red-500 text-sm mt-1">
                    {String(errors.firstName.message)}
                  </p>
                )}
              </div>
              <div className="relative w-full">
                <input
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  type="text"
                  placeholder="Last name"
                  className="border border-border-secondary px-2 py-3 w-full rounded-md"
                />
                {errors.lastName && (
                  <p className="absolute text-red-500 text-sm mt-1">
                    {String(errors.lastName.message)}
                  </p>
                )}
              </div>
              <div className="relative w-full col-span-2">
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  placeholder="Email address"
                  className="border border-border-secondary px-2 py-3 w-full rounded-md"
                />
                {errors.email && (
                  <p className="absolute text-red-500 text-sm mt-1">
                    {String(errors.email.message)}
                  </p>
                )}
              </div>

              {/* address */}
              <div className="relative w-full col-span-2">
                <input
                  {...register("address", { required: "Address is required" })}
                  type="text"
                  placeholder="Address"
                  className="border border-border-secondary px-2 py-3 w-full rounded-md"
                />
                {errors.address && (
                  <p className="absolute text-red-500 text-sm mt-1">
                    {String(errors.address.message)}
                  </p>
                )}
              </div>
              {/* City */}
              <div className="relative w-full">
                <input
                  {...register("city", { required: "City is required" })}
                  type="text"
                  placeholder="City"
                  className="border border-border-secondary px-2 py-3 w-full rounded-md"
                />
                {errors.city && (
                  <p className="absolute text-red-500 text-sm mt-1">
                    {String(errors.city.message)}
                  </p>
                )}
              </div>
              {/* State */}
              <div className="relative w-full">
                <input
                  {...register("state", { required: "State is required" })}
                  type="text"
                  placeholder="State"
                  className="border border-border-secondary px-2 py-3 w-full rounded-md"
                />
                {errors.state && (
                  <p className="absolute text-red-500 text-sm mt-1">
                    {String(errors.state.message)}
                  </p>
                )}
              </div>
              {/* Zipcode */}
              <div className="relative w-full">
                <input
                  {...register("zipCode", {
                    required: "Zipcode is required",
                    pattern: {
                      value: /^[0-9]{5}$/,
                      message: "Invalid zipcode format",
                    },
                  })}
                  type="text"
                  placeholder="Zipcode"
                  className="border border-border-secondary px-2 py-3 w-full rounded-md"
                />
                {errors.zipcode && (
                  <p className="absolute text-red-500 text-sm mt-1">
                    {String(errors.zipcode.message)}
                  </p>
                )}
              </div>
              {/* Country */}
              <div className="relative w-full">
                <input
                  {...register("country", { required: "Country is required" })}
                  type="text"
                  placeholder="Country"
                  className="border border-border-secondary px-2 py-3 w-full rounded-md"
                />
                {errors.country && (
                  <p className="absolute text-red-500 text-sm mt-1">
                    {String(errors.country.message)}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Right Section: Order Summary, Coupon, and Payment */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Payment</h2>
            <div className="mb-[18px] flex flex-col gap-[15px]">
              <div className="flex justify-between">
                <p>Subtotal:</p>
                <p>
                  {finalTotal === 0
                    ? "$0"
                    : formatAmount(finalTotal + delivery_fee)}
                </p>
              </div>
              <div className="flex justify-between">
                <p>Discount:</p>
                <p>{discount}%</p>
              </div>
              <div className="flex justify-between font-bold">
                <p>Total:</p>
                <p>
                  {finalTotal === 0
                    ? "$0"
                    : formatAmount(finalTotal + delivery_fee)}
                </p>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="mb-3">
              <label
                htmlFor="coupon"
                className="block text-sm font-medium poppins my-1"
              >
                Coupon Code
              </label>
              <div className="flex space-x-2 mt-3">
                <input
                  type="text"
                  id="coupon"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="border border-border-secondary p-2 w-full rounded-md"
                  placeholder="Enter coupon code"
                />
                <Button
                  onClick={applyCoupon}
                  className="w-full bg-brand-neutral text-text-light px-2 py-2 rounded-md poppins border-none"
                >
                  Apply
                </Button>
              </div>
            </div>

            {/* Payment Form */}
            <PaymentForm
              applicationId={import.meta.env.VITE_SQUARE_APP_ID}
              locationId={import.meta.env.VITE_SQUARE_LOCATION_ID}
              cardTokenizeResponseReceived={(tokenResult: any) => {
                if (tokenResult.errors) {
                  toast.error("Payment failed. Please try again.");
                } else {
                  onPaymentSuccess(tokenResult.token);
                }
              }}
            >
              <CreditCard
                buttonProps={{
                  css: {
                    backgroundColor:
                      isValid && !hasPaid ? "#3d3d3d" : "#d1d5db",
                    fontSize: "18px",
                    color: isValid && !hasPaid ? "#fff" : "#9ca3af",
                    "&:hover": {
                      backgroundColor:
                        isValid && !hasPaid ? "#374151" : "#d1d5db",
                    },
                  },
                  disabled: !isValid || hasPaid,
                }}
              >
                <p className="poppins">
                  Place order{" "}
                  {finalTotal === 0
                    ? "$0"
                    : formatAmount(finalTotal + delivery_fee)}
                </p>
              </CreditCard>
            </PaymentForm>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckOut;
