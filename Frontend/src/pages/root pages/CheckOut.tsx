import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import "react-phone-input-2/lib/style.css";
import Spinner from "../../components/Spinner";
import Axios from "axios";
import OrderSummary from "../../components/OrderSummary";
import Address from "../../components/Address";

const CheckOut: React.FC = () => {
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
      <div className="">
        <div className="mb-5 border-b border-border-secondary">
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque text-gradient">
            Checkout
          </h2>
          <p className="md:text-md pb-5">
            Please provide delivery and billing information below.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:pt-5">
          {/* Order Summary compoenent */}
          <OrderSummary />
          {/* Address and Payment component */}
          <div>
            <Address />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckOut;
