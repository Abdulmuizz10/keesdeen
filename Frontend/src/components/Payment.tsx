import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  CreditCard,
  GooglePay,
  ApplePay,
  PaymentForm,
} from "react-square-web-payments-sdk";
import { formatAmountDefault } from "../lib/utils";
import { X } from "lucide-react";
import { currency, URL } from "../lib/constants";
import { AuthContext } from "../context/AuthContext/AuthContext";
import { useShop } from "../context/ShopContext";
import Axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import CriticalErrorModal from "./CriticalErrorModal";
// Import the modal

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

interface CriticalError {
  title: string;
  message: string;
  paymentId?: string;
  instructions?: string[];
  contactSupport?: boolean;
}

const Payment: React.FC<PaymentProps> = ({ setLoading, address }) => {
  const { user } = useContext(AuthContext);
  const {
    getCartAmount,
    shippingFee: fee,
    setCartItems,
    getCartDetailsForOrder,
  } = useShop();
  const [isPaying, setIsPaying] = useState(false);
  const [loading, _] = useState();
  const [coupon, setCoupon] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    null
  );

  // Modal state
  const [criticalError, setCriticalError] = useState<CriticalError | null>(
    null
  );
  const [showErrorModal, setShowErrorModal] = useState(false);

  const subtotal = getCartAmount();
  const shippingFee = fee;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
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
          cartTotal: subtotal,
        },
        {
          withCredentials: true,
          validateStatus: (status: any) => status < 600,
        }
      );

      if (response.status === 200 && response.data.success) {
        setAppliedCoupon({
          code: coupon.toUpperCase(),
          discountAmount: response.data.discountAmount,
          discountType: response.data.discountType || "fixed",
          discountValue: response.data.discountValue || 0,
        });
        toast.success(response.data.message || "Coupon applied successfully!");
        setCoupon("");
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

  const handleCriticalError = (error: CriticalError) => {
    setCriticalError(error);
    setShowErrorModal(true);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setCriticalError(null);
  };

  const onPaymentSuccess = async (token: string) => {
    const today = new Date().toISOString();

    if (!token) {
      toast.error("Payment token is missing");
      setIsPaying(false);
      setLoading(false);
      return;
    }

    const order: OrderData = {
      user: user.id,
      email: user.email,
      sourceId: token,
      currency: currency,
      coupon: appliedCoupon?.code || "",
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
      });

      // Handle success
      if (response.data.success !== false) {
        navigate("/order_confirmation", {
          state: { orderData: response.data },
        });
        toast.success("Order placed successfully!");
        setCartItems({});
      } else {
        throw new Error(response.data.message || "Order failed");
      }
    } catch (error: any) {
      console.error("Order submission error:", error);

      const errorData = error.response?.data;
      const errorCode = errorData?.code;
      const paymentId = errorData?.paymentId;

      // CRITICAL ERRORS - Show modal
      if (errorCode === "ORDER_CREATION_FAILED" || paymentId) {
        handleCriticalError({
          title: "Payment Processed - Order Issue",
          message:
            errorData?.message ||
            "Your payment was successfully processed, but we encountered an issue creating your order. Don't worry - your money is safe and we'll resolve this.",
          paymentId: paymentId,
          instructions: [
            "Take a screenshot or note down your payment reference ID above",
            "Check your email for a payment confirmation from Square",
            "Contact our support team with your payment reference ID",
            "Do not attempt to place the order again to avoid duplicate charges",
          ],
          contactSupport: true,
        });
      }
      // VALIDATION ERRORS - Show modal
      else if (
        errorCode === "VALIDATION_ERROR" ||
        error.response?.status === 400
      ) {
        handleCriticalError({
          title: "Order Validation Failed",
          message:
            errorData?.message ||
            "There was an issue with your order information. Please review and try again.",
          instructions: [
            "Check that all required fields are filled correctly",
            "Verify your shipping and billing addresses",
            "Ensure your payment information is valid",
            "Try refreshing the page and submitting again",
          ],
          contactSupport: false,
        });
      }
      // SERVER ERRORS - Show modal
      else if (error.response?.status >= 500) {
        handleCriticalError({
          title: "Server Error",
          message:
            "We're experiencing technical difficulties. Your payment was not processed.",
          instructions: [
            "Please wait a few minutes before trying again",
            "Clear your browser cache and cookies",
            "Try using a different browser or device",
            "If the problem persists, contact our support team",
          ],
          contactSupport: true,
        });
      }
      // REGULAR ERRORS - Use toast
      else {
        const errorMessage =
          errorData?.message ||
          error.message ||
          "Order submission failed. Please try again.";
        toast.error(errorMessage);
      }
    } finally {
      setIsPaying(false);
      setLoading(false);
    }
  };

  const createPaymentRequest = useCallback(() => {
    if (!address?.shippingAddress) {
      return {
        countryCode: "GB",
        currencyCode: currency,
        total: {
          amount: finalTotal.toFixed(2),
          label: "Total",
        },
        requestBillingContact: false,
        requestShippingContact: false,
      };
    }

    return {
      countryCode: address.shippingAddress.country || "GB",
      currencyCode: currency,
      total: {
        amount: finalTotal.toFixed(2),
        label: "Total",
      },
      requestBillingContact: true,
      requestShippingContact: false,
    };
  }, [finalTotal, address]);

  const createVerificationDetails = useCallback(() => {
    if (!address?.billingAddress) return undefined;

    return {
      amount: finalTotal.toFixed(2),
      currencyCode: currency,
      intent: "CHARGE" as const,
      billingContact: {
        givenName: address.billingAddress.firstName || "",
        familyName: address.billingAddress.lastName || "",
        email: user.email || "",
        phone: address.billingAddress.phone || "",
        addressLines: [
          address.billingAddress.address1 || "",
          address.billingAddress.address2 || "",
        ].filter(Boolean),
        city: address.billingAddress.city || "",
        region: address.billingAddress.state || "",
        postalCode: address.billingAddress.postalCode || "",
        countryCode: address.billingAddress.country || "",
      },
    };
  }, [finalTotal, address, user.email]);

  const [applePaySupported, setApplePaySupported] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkApplePay = async () => {
      try {
        const ApplePaySessionAny = (window as any).ApplePaySession;
        if (!ApplePaySessionAny) {
          setApplePaySupported(false);
          return;
        }

        const canMake = ApplePaySessionAny.canMakePayments
          ? await Promise.resolve(ApplePaySessionAny.canMakePayments())
          : false;
        setApplePaySupported(Boolean(canMake));
      } catch (err) {
        setApplePaySupported(false);
      }
    };
    checkApplePay();
  }, []);

  useEffect(() => {
    const blockNav = (e: BeforeUnloadEvent) => {
      if (isPaying) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", blockNav);
    return () => window.removeEventListener("beforeunload", blockNav);
  }, [isPaying]);

  return (
    <div className="w-full">
      {/* Critical Error Modal */}
      {criticalError && (
        <CriticalErrorModal
          isOpen={showErrorModal}
          onClose={closeErrorModal}
          error={criticalError}
        />
      )}

      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg md:text-2xl font-semibold text-gray-900 bricolage-grotesque mb-3">
          <span>Order Details</span>
        </h3>
        <p className="text-sm sm:text-base text-gray-500">
          Your order details.
        </p>
      </div>

      {/* Order Details List */}
      <div className="mt-5 border border-gray-200 px-3 py-5 md:p-5 bg-white space-y-5">
        <div className="space-y-2 text-gray-500 text-sm">
          {/* Subtotal */}
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="text-gray-700">
              {formatAmountDefault(currency, subtotal)}
            </span>
          </div>

          {/* Discount */}
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

        {/* Coupon Form */}
        {!appliedCoupon && (
          <div className="poppins">
            <label htmlFor="coupon" className="text-base tracking-wide">
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
                className="border border-gray-300 text-xs px-2 py-1 w-full focus:outline-none uppercase"
                placeholder="Enter coupon code"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full border border-gray-900 bg-gray-900 py-2.5 text-sm uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "..." : "Apply"}
              </button>
            </form>
          </div>
        )}

        {/* Applied coupon badge */}
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

      {/* Payment Methods Section */}
      <div className="mt-10">
        <h3 className="text-lg md:text-2xl font-semibold text-gray-900 bricolage-grotesque mb-3">
          <span> Choose Payment Method</span>
        </h3>

        <PaymentForm
          key={`payment-form-${finalTotal}`}
          applicationId={import.meta.env.VITE_SQUARE_APP_ID}
          locationId={import.meta.env.VITE_SQUARE_LOCATION_ID}
          createPaymentRequest={createPaymentRequest}
          createVerificationDetails={createVerificationDetails}
          cardTokenizeResponseReceived={(tokenResult: any) => {
            if (isPaying) return;

            setIsPaying(true);
            setLoading(true);

            if (!address) {
              toast.error("Please select address before checkout.");
              setIsPaying(false);
              setLoading(false);
              return;
            }

            if (tokenResult.errors) {
              const errorMessage =
                tokenResult.errors[0]?.message ||
                "Payment failed. Please try again.";
              toast.error(errorMessage);
              setIsPaying(false);
              setLoading(false);
              return;
            }

            onPaymentSuccess(tokenResult.token);
          }}
        >
          {/* Digital Wallets Section */}
          <div className="space-y-3 mb-6">
            <p className="text-sm sm:text-base text-gray-500">
              Express Checkout:
            </p>

            {!address && (
              <div className="p-3 text-xs text-red-500 text-center border border-red-400 bg-red-50">
                Please select or create an address to enable express checkout
              </div>
            )}

            {/* Apple Pay */}
            {applePaySupported && address && (
              <ApplePay
                buttonColor="black"
                buttonType="buy"
                buttonStyles={{
                  height: "48px",
                  borderRadius: "0px",
                  opacity: isPaying ? 0.6 : 1,
                }}
              />
            )}

            {!applePaySupported && (
              <div className="text-center text-xs text-gray-500">
                Apple Pay not available in your browser
              </div>
            )}

            {/* Google Pay */}
            {address && (
              <GooglePay
                buttonColor="black"
                buttonType="buy"
                buttonSizeMode="fill"
                buttonStyles={{
                  height: "48px",
                  borderRadius: "0px",
                  opacity: isPaying ? 0.6 : 1,
                }}
              />
            )}
          </div>

          {/* Accepted Cards */}
          <div className="mt-4 flex flex-col items-center">
            <p className="mb-2 text-center text-xs text-gray-500">We accept:</p>

            <div className="flex items-center gap-4">
              {[
                "visa",
                "mastercard",
                "amex",
                "discover",
                "jcb",
                "unionpay",
              ].map((card) => (
                <button
                  key={card}
                  onClick={() => {
                    const el = document.getElementById("card-section");
                    if (!el) return;

                    const yOffset = -70;
                    const y =
                      el.getBoundingClientRect().top +
                      window.pageYOffset +
                      yOffset;

                    window.scrollTo({
                      top: y,
                      behavior: "smooth",
                    });
                  }}
                  className="hover:scale-105 transition transform"
                  title={`Pay with ${card.toUpperCase()}`}
                >
                  <img
                    src={`https://img.icons8.com/color/48/${card}.png`}
                    alt={card}
                    className="h-10"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Credit Card Form */}
          <div className="mt-6" id="card-section">
            <p className="text-sm sm:text-base text-gray-500 mb-2">
              Pay with Card:
            </p>
            <CreditCard
              includeInputLabels
              buttonProps={{
                disabled: isPaying,
                onClick: () => {
                  if (!address) {
                    toast.error("Please select an address before checkout");
                    return;
                  }
                },
                css: {
                  backgroundColor: !address || isPaying ? "#9ca3af" : "#111827",
                  cursor: !address || isPaying ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  color: "#fff",
                  borderRadius: "0px",
                  letterSpacing: "0.1em",
                  padding: "16px",
                  fontWeight: "600",
                },
              }}
            >
              {isPaying
                ? "Processing..."
                : `Pay ${formatAmountDefault(currency, finalTotal)}`}
            </CreditCard>
          </div>
        </PaymentForm>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Secure payment powered by Square</span>
        </div>
      </div>
    </div>
  );
};

export default Payment;
