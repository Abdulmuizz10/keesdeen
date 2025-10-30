import React, { useContext, useState } from "react";
import { Button } from "@relume_io/relume-ui";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import { formatAmountDefault } from "../lib/utils";
import { currency, URL } from "../lib/constants";
import { AuthContext } from "../context/AuthContext/AuthContext";
import { useShop } from "../context/ShopContext";
import Axios from "axios";
import { toast } from "sonner";
import { showOrderSummary } from "./SweatOrderModal";
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

const Payment: React.FC<PaymentProps> = ({ setLoading, address }) => {
  const { user } = useContext(AuthContext);
  const [coupon, setCoupon] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const {
    getCartAmount,
    shippingFee,
    discountPercent,
    setCartItems,
    getCartDetailsForOrder,
    // currentCurrency,
  } = useShop();
  const subtotal = getCartAmount();
  const discountAmount = (subtotal / 100) * discount;
  const finalTotal = subtotal - discountAmount + shippingFee;
  const orderedItems = getCartDetailsForOrder();
  const navigate = useNavigate();

  const applyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await Axios.post(
        `${URL}/utility/apply-coupon`,
        { coupon },
        {
          withCredentials: true,
          validateStatus: (status) => status < 600,
        }
      );
      if (response.status === 200) {
        setDiscount(discountPercent);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Invalid coupon");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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
          validateStatus: (status) => status < 600,
        });
        if (response.status === 200) {
          showOrderSummary(response.data);
          console.log(response.data);
          toast.success("Order placed successfully!");
          setCartItems({});
          navigate("/collections/shop_all");
        }
      } catch (error) {
        toast.error("Order submission failed. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg md:text-2xl font-semibold text-gray-900 bricolage-grotesque mb-3">
          Order Details
        </h3>
        <p className="text-gray-500 text-sm md:text-base">
          Select or create a new address.
        </p>
      </div>

      {/* Order Details List */}
      <div className="mt-5 border border-border-secondary shadow-xxsmall px-3 py-5 md:p-5  bg-white space-y-5">
        <div className="space-y-3 text-gray-700">
          <div className="flex justify-between text-sm md:text-base">
            <span>Subtotal:</span>
            <span className="text-gray-800 font-medium">
              {formatAmountDefault(currency, subtotal)}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm md:text-base">
              <span>Discount:</span>
              <span className="text-gray-800 font-medium">
                -{discount}% ({formatAmountDefault(currency, discountAmount)})
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm md:text-base">
            <span>Estimated Tax:</span>
            <span className="text-gray-800 font-medium">
              {formatAmountDefault(currency, 20)}
            </span>
          </div>

          <div className="flex justify-between text-sm md:text-base">
            <span>Shipping Fee:</span>
            <span className="text-gray-800 font-medium">
              {formatAmountDefault(currency, shippingFee)}
            </span>
          </div>
        </div>

        <div className="poppins">
          <label htmlFor="coupon" className="text-sm">
            Coupon Code:
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
              className="border border-border-secondary px-2 py-2 w-full rounded focus:outline-none"
              placeholder="Enter coupon code"
            />
            <Button className="w-full bg-brand-neutral text-text-light px-2 py-2 rounded poppins border-none">
              Apply
            </Button>
          </form>
        </div>

        <div className="border-t border-gray-200 my-4" />

        <div className="flex justify-between items-center text-lg md:text-xl font-semibold text-gray-900">
          <span>Total:</span>
          <span className="text-gray-800 font-medium">
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
                backgroundColor: "#3d3d3d",
                fontSize: "16px",
                color: "#fff",
                // "&:hover": {
                //   backgroundColor: "#374151",
                // },
                fontFamily: "poppins",
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
