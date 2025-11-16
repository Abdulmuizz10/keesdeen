import React, { useContext, useState } from "react";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import { formatAmountDefault } from "../lib/utils";
import { X } from "lucide-react";
import { currency, URL } from "../lib/constants";
import { AuthContext } from "../context/AuthContext/AuthContext";
import { useShop } from "../context/ShopContext";
import Axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface PaymentProps {
  setLoading: any;
  address: any;
}

interface OrderData {
  user: any;
  email: any;
  sourceId: any;
  currency: string;
  coupon: string;
  orderedItems: any;
  shippingAddress: any;
  billingAddress: any;
  shippingPrice: number;
  totalPrice: number;
  paidAt: string;
}

interface AppliedCoupon {
  code: string;
  discountAmount: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
}

const Payment: React.FC<PaymentProps> = ({ setLoading, address }) => {
  const { user } = useContext(AuthContext);
  const {
    getCartAmount,
    shippingFee: fee,
    setCartItems,
    getCartDetailsForOrder,
  } = useShop();

  const [loading, _] = useState();
  const [coupon, setCoupon] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    null
  );

  // Your existing state
  const subtotal = getCartAmount();
  const shippingFee = fee;
  // Calculate discount amount based on applied coupon
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  // Calculate final total
  const finalTotal = Math.max(subtotal - discountAmount + shippingFee, 0);

  const orderedItems = getCartDetailsForOrder();
  const navigate = useNavigate();

  const applyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coupon.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    setLoading(true);
    try {
      const response = await Axios.post(
        `${URL}/coupons/apply-coupon`,
        {
          code: coupon.toUpperCase(),
          cartTotal: subtotal, // Send the current subtotal
        },
        {
          withCredentials: true,
          validateStatus: (status: any) => status < 600,
        }
      );

      if (response.status === 200 && response.data.success) {
        // Store the applied coupon details
        setAppliedCoupon({
          code: coupon.toUpperCase(),
          discountAmount: response.data.discountAmount,
          discountType: response.data.discountType || "fixed", // Get from response if available
          discountValue: response.data.discountValue || 0, // Get from response if available
        });
        toast.success(response.data.message || "Coupon applied successfully!");
        setCoupon(""); // Clear input after successful apply
      } else {
        toast.error(response.data.message || "Invalid coupon");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCoupon("");
    toast.info("Coupon removed");
  };

  const onPaymentSuccess = async (token: string) => {
    const today = new Date().toISOString();
    if (token) {
      const order: OrderData = {
        user: user.id,
        email: user.email,
        sourceId: token,
        currency: currency,
        coupon,
        orderedItems,
        shippingAddress: address.shippingAddress,
        billingAddress: address.billingAddress,
        shippingPrice: shippingFee,
        totalPrice: finalTotal,
        paidAt: today,
      };
      try {
        const response = await Axios.post(`${URL}/orders/create-order`, order, {
          withCredentials: true,
          validateStatus: (status: any) => status < 600,
        });
        if (response.status === 200) {
          // Navigate to confirmation page with order data
          navigate("/order_confirmation", {
            state: { orderData: response.data },
          });

          toast.success("Order placed successfully!");
          setCartItems({});
        }
      } catch (error) {
        toast.error("Order submission failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg md:text-2xl font-semibold text-gray-900 bricolage-grotesque mb-3">
          <span>Order Details</span>
        </h3>
        <p className="text-sm sm:text-base text-gray-500 ">
          your order details.
        </p>
      </div>

      {/* Order Details List */}
      {/* <div className="mt-5 border border-gray-200 px-3 py-5 md:p-5  bg-white space-y-5">
        <div className="space-y-3 text-gray-500 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="text-gray-700">
              {formatAmountDefault(currency, subtotal)}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between">
              <span>Discount:</span>
              <span className="text-gray-700">
                -{discount}% ({formatAmountDefault(currency, discountAmount)})
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Estimated Tax:</span>
            <span className="text-gray-700">
              {formatAmountDefault(currency, 20)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Shipping Fee:</span>
            <span className="text-gray-700">
              {formatAmountDefault(currency, shippingFee)}
            </span>
          </div>
        </div>

        <div className="poppins">
          <label htmlFor="coupon" className="text-base">
            Apply coupon code:
          </label>

          <form
            className="grid grid-cols-[4fr_2fr] gap-2 mt-3"
            onSubmit={applyCoupon}
          >
            <input
              type="text"
              id="coupon"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="border border-gray-300 text-sm px-2 py-2 w-full focus:outline-none"
              placeholder="Enter coupon code"
            />
            <button className="w-full border border-gray-900 bg-gray-900 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-gray-800">
              Apply
            </button>
          </form>
        </div>

        <div className="border-t border-gray-200 my-4" />

        <div className="flex justify-between items-center text-sm md:text-base tracking-wider font-semibold text-gray-500">
          <span>Total:</span>
          <span className="text-gray-700 font-medium">
            {formatAmountDefault(currency, finalTotal)}
          </span>
        </div>
      </div> */}

      <div className="mt-5 border border-gray-200 px-3 py-5 md:p-5 bg-white space-y-5">
        <div className="space-y-2 text-gray-500 text-sm">
          {/* Subtotal */}
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="text-gray-700">
              {formatAmountDefault(currency, subtotal)}
            </span>
          </div>

          {/* Discount - Only show if coupon is applied */}
          {appliedCoupon && appliedCoupon.discountAmount > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span>Discount ({appliedCoupon.code}):</span>
                <button
                  onClick={removeCoupon}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Remove coupon"
                >
                  <X className="h-4 w-4 text-red-500" />
                </button>
              </div>
              <span className="text-green-600 font-medium">
                -{formatAmountDefault(currency, appliedCoupon.discountAmount)}
              </span>
            </div>
          )}

          {/* Shipping Fee */}
          <div className="flex justify-between">
            <span>Shipping Fee:</span>
            <span className="text-gray-700">
              {formatAmountDefault(currency, shippingFee)}
            </span>
          </div>
        </div>

        {/* Coupon Form - Only show if no coupon is applied */}
        {!appliedCoupon && (
          <div className="poppins">
            <label htmlFor="coupon" className="text-base">
              Apply coupon code:
            </label>
            <form
              className="grid grid-cols-[4fr_2fr] gap-2 mt-3"
              onSubmit={applyCoupon}
            >
              <input
                type="text"
                id="coupon"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                className="border border-gray-300 text-sm px-2 py-2 w-full focus:outline-none uppercase"
                placeholder="Enter coupon code"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full border border-gray-900 bg-gray-900 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "..." : "Apply"}
              </button>
            </form>
          </div>
        )}

        {/* Show applied coupon badge if exists */}
        {appliedCoupon && (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-700">
                Coupon Applied: {appliedCoupon.code}
              </span>
            </div>
            <button
              onClick={removeCoupon}
              className="text-sm text-green-600 hover:text-green-800 underline"
            >
              Remove
            </button>
          </div>
        )}

        <div className="border-t border-gray-200 my-4" />

        {/* Total */}
        <div className="flex justify-between items-center text-sm md:text-base tracking-wider font-semibold text-gray-500">
          <span>Total:</span>
          <span className="text-gray-700 font-medium">
            {formatAmountDefault(currency, finalTotal)}
          </span>
        </div>
      </div>

      <div className="mt-10">
        <PaymentForm
          // applicationId={"sandbox-sq0idb-vQRLXoHkdEECHbO5_h9o2A"}
          // locationId={"LNS0B6E8H9C06"}
          applicationId={import.meta.env.VITE_SQUARE_APP_ID}
          locationId={import.meta.env.VITE_SQUARE_LOCATION_ID}
          cardTokenizeResponseReceived={(tokenResult: any) => {
            if (address) {
              setLoading(true);
              if (tokenResult.errors) {
                toast.error("Payment failed. Please try again.");
                setLoading(false);
              } else {
                onPaymentSuccess(tokenResult.token);
              }
            } else {
              toast.error("Please select address before checkout.");
              setLoading(false);
              return;
            }
          }}
        >
          <CreditCard
            buttonProps={{
              css: {
                backgroundColor: "#111827",
                fontSize: "14px",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#1f2937",
                },
                borderRadius: "0px",
                letterSpacing: "0.1em",
              },
            }}
          >
            Pay {/* ... */}
            {formatAmountDefault(currency, finalTotal)}
          </CreditCard>
        </PaymentForm>
      </div>
    </div>
  );
};

export default Payment;

// firstName: string;
// lastName: string;
// email: string;
// country: any;
// state: any;
// addressLineOne: string;
// addressLineTwo: string;
// phoneNumber: any;
// zipCode: any;
