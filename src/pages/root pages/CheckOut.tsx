import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@relume_io/relume-ui";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import { useShop } from "../../context/ShopContext";
import { formatAmount } from "../../lib/utils";

const CheckOut: React.FC = () => {
  const { getCartAmount, delivery_fee } = useShop();
  const subtotal = getCartAmount();
  const [coupon, setCoupon] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm();

  const handleCouponApply = () => {
    if (coupon === "SAVE10") {
      setDiscount(10); // 10% discount
    } else {
      alert("Invalid Coupon Code");
    }
  };

  const finalTotal = subtotal - (subtotal * discount) / 100;

  const onSubmit = async (data: any) => {
    const orderData = {
      ...data,
      total: finalTotal,
      coupon,
      discount,
      paymentMethod: "CreditCard", // Or other method based on user choice
      paymentToken, // Attach the token from PaymentForm
    };

    // Send orderData to your backend API
    console.log("Order Data:", orderData);

    // Reset form and token
    reset();
    setPaymentToken(null);
    alert("Order placed successfully!");
  };

  const onPaymentSuccess = (token: string) => {
    setPaymentToken(token);
    console.log("Payment Token:", token);

    // Trigger form submission only after successful payment
    handleSubmit(onSubmit)();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const APP_ID = import.meta.env.VITE_SQUARE_APP_ID;
  const LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID;

  return (
    <section className="px-[5%] py-24 md:py-30">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section: Delivery Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            <form className="grid grid-cols-2 gap-6">
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
                className="border border-border-secondary px-2 py-3 w-full rounded-md"
              />
              <input
                {...register("phone")}
                type="text"
                placeholder="Phone"
                className="border border-border-secondary px-2 py-3 w-full col-span-2 rounded-md"
              />
            </form>
          </div>

          {/* Right Section: Order Summary, Payment Methods, and Square Payment Form */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            <div className="mb-8 flex flex-col gap-[15px]">
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
            <div className="mb-6">
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
                  onClick={handleCouponApply}
                  className="w-full bg-brand-neutral text-text-light px-2 py-2 rounded-md poppins border-none"
                >
                  Apply
                </Button>
              </div>
            </div>

            {/* Payment Form */}
            <PaymentForm
              applicationId={APP_ID}
              locationId={LOCATION_ID}
              cardTokenizeResponseReceived={(tokenResult: any) => {
                if (tokenResult.errors) {
                  console.error("Payment Error:", tokenResult.errors);
                  alert("Payment failed. Please try again.");
                } else {
                  onPaymentSuccess(tokenResult.token);
                }
              }}
            >
              <CreditCard
                buttonProps={{
                  css: {
                    backgroundColor: "#3d3d3d",
                    fontSize: "18px",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#374151",
                    },
                  },
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

// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { Button } from "@relume_io/relume-ui";
// import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
// import { useShop } from "../../context/ShopContext";
// import { formatAmount } from "../../lib/utils";

// const CheckOut: React.FC = () => {
//   const { getCartAmount, delivery_fee } = useShop();
//   const subtotal = getCartAmount();
//   const [coupon, setCoupon] = useState<string>("");
//   const [discount, setDiscount] = useState<number>(0);
//   const [paymentToken, setPaymentToken] = useState<string | null>(null);
//   const { register, handleSubmit, reset } = useForm();

//   const handleCouponApply = () => {
//     if (coupon === "SAVE10") {
//       setDiscount(10); // 10% discount
//     } else {
//       alert("Invalid Coupon Code");
//     }
//   };

//   const finalTotal = subtotal - (subtotal * discount) / 100;

//   const onSubmit = async (data: any) => {
//     if (!paymentToken) {
//       alert("Please complete payment before submitting the order.");
//       return;
//     }

//     const orderData = {
//       ...data,
//       total: finalTotal,
//       coupon,
//       discount,
//       paymentMethod: "CreditCard", // Or other method based on user choice
//       paymentToken, // Attach the token from PaymentForm
//     };

//     // Send orderData to your backend API
//     console.log("Order Data:", orderData);

//     // Reset form and token
//     reset();
//     setPaymentToken(null);
//     alert("Order placed successfully!");
//   };

//   const onPaymentSuccess = (token: string) => {
//     setPaymentToken(token);
//     console.log("Payment Token:", token);
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const APP_ID = "sandbox-sq0idb-vQRLXoHkdEECHbO5_h9o2A";
//   const LOCATION_ID = "LNS0B6E8H9C06";

//   return (
//     <section className="px-[5%] py-24 md:py-30">
//       <div className="container">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Left Section: Delivery Information */}
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
//             <form
//               className="grid grid-cols-2 gap-6"
//               onSubmit={handleSubmit(onSubmit)}
//             >
//               <input
//                 {...register("firstName")}
//                 type="text"
//                 placeholder="First name"
//                 className="border border-border-secondary px-2 py-3 w-full rounded-md"
//               />
//               <input
//                 {...register("lastName")}
//                 type="text"
//                 placeholder="Last name"
//                 className="border border-border-secondary px-2 py-3 w-full rounded-md"
//               />
//               <input
//                 {...register("email")}
//                 type="email"
//                 placeholder="Email address"
//                 className="border border-border-secondary px-2 py-3 w-full col-span-2 rounded-md"
//               />
//               <input
//                 {...register("street")}
//                 type="text"
//                 placeholder="Street"
//                 className="border border-border-secondary px-2 py-3 w-full col-span-2 rounded-md"
//               />
//               <input
//                 {...register("city")}
//                 type="text"
//                 placeholder="City"
//                 className="border border-border-secondary px-2 py-3 w-full rounded-md"
//               />
//               <input
//                 {...register("state")}
//                 type="text"
//                 placeholder="State"
//                 className="border border-border-secondary px-2 py-3 w-full rounded-md"
//               />
//               <input
//                 {...register("zipcode")}
//                 type="text"
//                 placeholder="Zipcode"
//                 className="border border-border-secondary px-2 py-3 w-full rounded-md"
//               />
//               <input
//                 {...register("country")}
//                 type="text"
//                 placeholder="Country"
//                 className="border border-border-secondary px-2 py-3 w-full rounded-md"
//               />
//               <input
//                 {...register("phone")}
//                 type="text"
//                 placeholder="Phone"
//                 className="border border-border-secondary px-2 py-3 w-full col-span-2 rounded-md"
//               />
//               {/* <Button
//                 type="submit"
//                 className="w-full bg-brand-neutral text-text-light py-3 rounded-md poppins border-none"
//               >
//                 Place order {formatAmount(finalTotal)}
//               </Button> */}
//             </form>
//           </div>

//           {/* Right Section: Order Summary, Payment Methods, and Stripe Payment Form */}
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Payment</h2>
//             <div className="mb-8 flex flex-col gap-[15px]">
//               <div className="flex justify-between">
//                 <p>Subtotal:</p>
//                 <p>
//                   {finalTotal === 0
//                     ? "$0"
//                     : formatAmount(finalTotal + delivery_fee)}
//                 </p>
//               </div>
//               <div className="flex justify-between">
//                 <p>Discount:</p>
//                 <p>{discount}%</p>
//               </div>
//               <div className="flex justify-between font-bold">
//                 <p>Total:</p>
//                 <p>
//                   {finalTotal === 0
//                     ? "$0"
//                     : formatAmount(finalTotal + delivery_fee)}
//                 </p>
//               </div>
//             </div>

//             {/* Coupon Section */}
//             <div className="mb-6">
//               <label
//                 htmlFor="coupon"
//                 className="block text-sm font-medium poppins my-1"
//               >
//                 Coupon Code
//               </label>
//               <div className="flex space-x-2 mt-3">
//                 <input
//                   type="text"
//                   id="coupon"
//                   value={coupon}
//                   onChange={(e) => setCoupon(e.target.value)}
//                   className="border border-border-secondary p-2 w-full rounded-md"
//                   placeholder="Enter coupon code"
//                 />
//                 <Button
//                   onClick={handleCouponApply}
//                   className="w-full bg-brand-neutral text-text-light px-2 py-2 rounded-md poppins border-none"
//                 >
//                   Apply
//                 </Button>
//               </div>
//             </div>

//             {/* Payment Form */}
//             <PaymentForm
//               applicationId={APP_ID}
//               locationId={LOCATION_ID}
//               cardTokenizeResponseReceived={(tokenResult: any) => {
//                 if (tokenResult.errors) {
//                   console.error("Payment Error:", tokenResult.errors);
//                   alert("Payment failed. Please try again.");
//                 } else {
//                   onPaymentSuccess(tokenResult.token);
//                 }
//               }}
//             >
//               <CreditCard
//                 // style={{
//                 //   input: {
//                 //     fontSize: "14px",
//                 //   },
//                 //   "input::placeholder": {
//                 //     color: "#771520",
//                 //   },
//                 // }}
//                 buttonProps={{
//                   css: {
//                     backgroundColor: "#3d3d3d",
//                     fontSize: "18px",
//                     color: "#fff",
//                     "&:hover": {
//                       backgroundColor: "#374151",
//                     },
//                     marginTop: "-20px",
//                   },
//                 }}
//               >
//                 <p className="poppins">
//                   Place order{"    "}
//                   {finalTotal === 0
//                     ? "$0"
//                     : formatAmount(finalTotal + delivery_fee)}
//                 </p>
//               </CreditCard>
//             </PaymentForm>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CheckOut;
