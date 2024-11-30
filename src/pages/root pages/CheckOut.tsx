import React, { useState, useContext } from "react";
import { formatAmount } from "../../lib/utils";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import { useShop } from "../../context/ShopContext";
import { createOrder } from "../../context/OrderContext/OrderApiCalls";
import Spinner from "../../components/Spinner";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import DeliveryForm from "../../components/DeliveryForm";
import { useOrders } from "../../context/OrderContext/OrderContext";
import { toast } from "react-toastify";
import {
  Button,
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
} from "@relume_io/relume-ui";

const CheckOut: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const {
    getCartDetailsForOrder,
    setCartItems,
    paymentLoader,
    setPaymentLoader,
    getCartAmount,
    delivery_fee,
    guestEmail,
  } = useShop();
  const orderedItems = getCartDetailsForOrder();

  const subtotal = getCartAmount();
  const { orderDispatch } = useOrders();
  const [coupon, setCoupon] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [deliveryData, setDeliveryData] = useState<any>(null);

  const handleDeliverySubmit = (data: any) => {
    setDeliveryData(data);
    toast.success("Delivery information submitted!");
  };

  const applyCoupon = () => {
    if (coupon === "SAVE10") {
      setDiscount(10);
      toast.success("Coupon applied successfully!");
    } else {
      toast.error("Invalid Coupon Code");
    }
  };

  // Calculate the final total
  const finalTotal = subtotal - (subtotal * discount) / 100 + delivery_fee;

  const handleOrderSubmission = async (token: string) => {
    if (!deliveryData) {
      setPaymentLoader(false);
      toast.error("Please fill in your delivery information.");
      return;
    }
    const today = new Date().toISOString();

    if (user) {
      let orderData = {
        ...deliveryData,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        user: user.id,
        totalPrice: finalTotal,
        coupon,
        currency: "GBP",
        discount,
        sourceId: token,
        orderedItems,
        paidAt: today,
        shippingPrice: delivery_fee,
      };
      try {
        createOrder(
          orderData,
          orderDispatch,
          setPaymentLoader,
          setCartItems,
          setSelectedCountry,
          setSelectedState
        );
        setSelectedCountry("");
        setSelectedState("");
      } catch (error) {
        toast.error("Order submission failed. Please try again.");
      }
    } else {
      let orderData = {
        ...deliveryData,
        email: guestEmail,
        user: null,
        totalPrice: finalTotal,
        coupon,
        currency: "GBP",
        discount,
        sourceId: token,
        orderedItems,
        paidAt: today,
        shippingPrice: delivery_fee,
      };

      try {
        createOrder(
          orderData,
          orderDispatch,
          setPaymentLoader,
          setCartItems,
          setSelectedCountry,
          setSelectedState
        );
        setSelectedCountry("");
        setSelectedState("");
      } catch (error) {
        toast.error("Order submission failed. Please try again.");
      }
    }
  };

  return (
    <section className="px-[5%] py-24 md:py-30">
      {paymentLoader && (
        <Dialog open={true}>
          <DialogPortal>
            <DialogOverlay className="bg-black/50" autoFocus={true} />
            <DialogContent className="w-full h-full flex items-center justify-center fixed">
              <Spinner />
            </DialogContent>
          </DialogPortal>
        </Dialog>
      )}
      <div className="container">
        <div className="rb-12 mb-12 md:mb-5 border-b border-border-secondary ">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
            Checkout
          </h2>
          <p className="md:text-md pb-5">
            Please make sure to fill the input fields before checking out.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-5">
          <div>
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            <DeliveryForm
              selectedCountry={selectedCountry}
              selectedState={selectedState}
              setSelectedCountry={setSelectedCountry}
              setSelectedState={setSelectedState}
              handleDeliverySubmit={handleDeliverySubmit}
            />
          </div>
          {/* Payment and Summary */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Payment</h2>
            <div className="mb-[18px] flex flex-col gap-[15px]">
              <div className="flex justify-between">
                <p>Subtotal:</p>
                <p>{formatAmount(subtotal + delivery_fee)}</p>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <p>Discount:</p>
                  <p>
                    {discount}% -{" "}
                    {discount > 0 && ((finalTotal * discount) / 100).toFixed(1)}
                    %
                  </p>
                </div>
              )}
              <div className="flex justify-between font-bold">
                <p>Total:</p>
                <p>{formatAmount(finalTotal)}</p>
              </div>
            </div>

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

            <PaymentForm
              applicationId={"sandbox-sq0idb-vQRLXoHkdEECHbO5_h9o2A"}
              locationId={"LNS0B6E8H9C06"}
              cardTokenizeResponseReceived={(tokenResult: any) => {
                if (tokenResult.errors) {
                  toast.error("Payment failed. Please try again.");
                } else {
                  setPaymentLoader(true);
                  handleOrderSubmission(tokenResult.token);
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
                {formatAmount(finalTotal)}
              </CreditCard>
            </PaymentForm>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckOut;
