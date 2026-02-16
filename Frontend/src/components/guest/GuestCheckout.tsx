import React, { useState, useEffect } from "react";
import Spinner from "../Spinner";
import OrderSummary from "../OrderSummary";
import Payment from "../Payment";
import GuestAddress from "./GuestAddress";

const GuestCheckout: React.FC = () => {
  const [address, setAddress] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="placing">
      {loading && (
        <div className="fixed inset-0 h-screen w-screen flex items-center justify-center bg-black/55 backdrop-blur-sm z-50">
          <Spinner />
        </div>
      )}
      <div>
        <div className="mb-10 border-b border-gray-200 pb-8">
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            <span>Guest Checkout</span>
          </h2>
          <p className="text-sm text-gray-500">
            Please provide or select shipping and billing information.
          </p>
        </div>
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Order Summary and Address component */}
          <div className="flex flex-col gap-10">
            <OrderSummary />
            <GuestAddress setAddress={setAddress} />
          </div>

          {/* Order details and Payment component */}
          <Payment setLoading={setLoading} address={address} />
        </div>
      </div>
    </section>
  );
};

export default GuestCheckout;
