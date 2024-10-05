import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { formatAmount } from "../../lib/utils";
import { Button } from "@relume_io/relume-ui";
import { useLocation } from "react-router-dom";

interface CheckoutProps {
  subtotal: number;
}

const CheckOut: React.FC<CheckoutProps> = ({}) => {
  const location = useLocation();
  const subtotal = 299;
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("CreditCard");
  const [coupon, setCoupon] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);

  const { register, handleSubmit } = useForm();

  const handleCouponApply = () => {
    if (coupon === "SAVE10") {
      setDiscount(10); // 10% discount
    } else {
      alert("Invalid Coupon Code");
    }
  };

  const finalTotal = subtotal - (subtotal * discount) / 100;

  const onSubmit = (data: any) => {
    alert("Order placed successfully!");
    console.log(data);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section: Delivery Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
          <form
            className="grid grid-cols-2 gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              {...register("firstName")}
              type="text"
              placeholder="First name"
              className="border border-border-secondary px-2 py-3 w-full rounded-md"
            />
            <input
              {...register("lastName")}
              type="text"
              placeholder="Last name"
              className="border border-border-secondary px-2 py-3 w-full rounded-md"
            />
            <input
              {...register("email")}
              type="email"
              placeholder="Email address"
              className="border border-border-secondary px-2 py-3 w-full col-span-2 rounded-md"
            />
            <input
              {...register("street")}
              type="text"
              placeholder="Street"
              className="border border-border-secondary px-2 py-3 w-full col-span-2 rounded-md"
            />
            <input
              {...register("city")}
              type="text"
              placeholder="City"
              className="border border-border-secondary px-2 py-3 w-full rounded-md"
            />
            <input
              {...register("state")}
              type="text"
              placeholder="State"
              className="border border-border-secondary px-2 py-3 w-full rounded-md"
            />
            <input
              {...register("zipcode")}
              type="text"
              placeholder="Zipcode"
              className="border border-border-secondary px-2 py-3 w-full rounded-md"
            />
            <input
              {...register("country")}
              type="text"
              placeholder="Country"
              className="border border-border-secondary  px-2 py-3 w-full rounded-md"
            />
            <input
              {...register("phone")}
              type="text"
              placeholder="Phone"
              className="border border-border-secondary px-2 py-3 w-full col-span-2 rounded-md"
            />
          </form>
        </div>

        {/* Right Section: Order Summary, Payment Methods, and Credit Card Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Payment</h2>
          <div className="mb-4">
            <div className="flex justify-between">
              <p>Subtotal:</p>
              <span>{formatAmount(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <p>Discount:</p>
              <span>{discount}%</span>
            </div>
            <div className="flex justify-between font-bold">
              <p>Total:</p>
              <p>{formatAmount(finalTotal)}</p>
            </div>
          </div>

          {/* Coupon Section */}
          <div className="mb-6">
            <label
              htmlFor="coupon"
              className="block text-sm font-medium poppins my-1"
            >
              Coupon Code
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="coupon"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="border border-border-secondary p-2 w-full rounded-md"
                placeholder="Enter coupon code"
              />
              <Button
                className="w-full  active:bg-gray-700 bg-brand-neutral text-text-light px-2 py-2 rounded-md poppins border-none"
                onClick={handleCouponApply}
              >
                Apply
              </Button>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="payment"
                  value="CreditCard"
                  checked={selectedPaymentMethod === "CreditCard"}
                  onChange={() => setSelectedPaymentMethod("CreditCard")}
                  className="form-radio  border-border-secondary"
                />
                <p>Credit Card</p>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="payment"
                  value="PayPal"
                  checked={selectedPaymentMethod === "PayPal"}
                  onChange={() => setSelectedPaymentMethod("PayPal")}
                  className="form-radio border-border-secondary"
                />
                <p>PayPal</p>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="payment"
                  value="Stripe"
                  checked={selectedPaymentMethod === "Stripe"}
                  onChange={() => setSelectedPaymentMethod("Stripe")}
                  className="form-radio border-border-secondary"
                />
                <p>Stripe</p>
              </label>
            </div>
          </div>

          {/* Conditional Credit Card Info */}
          {selectedPaymentMethod === "CreditCard" && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Credit Card Information
              </h3>
              <input
                type="text"
                placeholder="Card Number"
                className="border border-border-secondary p-2 w-full rounded-md mb-4"
              />
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Expiry Date (MM/YY)"
                  className="border border-border-secondary p-2 w-full rounded-md"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  className="border border-border-secondary p-2 w-full rounded-md"
                />
              </div>
            </div>
          )}

          {/* Pay Button */}
          <Button className="w-full  active:bg-gray-700 bg-brand-neutral text-text-light py-3 rounded-md poppins border-none">
            Place order {formatAmount(finalTotal)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
