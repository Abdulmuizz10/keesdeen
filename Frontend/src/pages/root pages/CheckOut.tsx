import React, { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import Spinner from "../../components/Spinner";
import OrderSummary from "../../components/OrderSummary";
import Address from "../../components/Address";
import Payment from "../../components/Payment";

const CheckOut: React.FC = () => {
  const [address, setAddress] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="px-[5%] py-24 md:py-30">
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 h-screen w-screen flex items-center justify-center bg-black/50 z-50">
          <Spinner />
        </div>
      )}
      <div>
        <div className="mb-5 border-b border-border-secondary">
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque text-gradient">
            Checkout
          </h2>
          <p className="md:text-md pb-5">
            Please provide shipping and billing information.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:pt-5">
          {/* Order Summary and Address component */}
          <div className="flex flex-col gap-10">
            <OrderSummary />
            <Address setAddress={setAddress} />
          </div>

          {/* Order details and Payment component */}
          <Payment setLoading={setLoading} address={address} />
        </div>
      </div>
    </section>
  );
};

export default CheckOut;
