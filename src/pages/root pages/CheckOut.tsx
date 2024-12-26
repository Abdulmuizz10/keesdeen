import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@relume_io/relume-ui";
import { useShop } from "../../context/ShopContext";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import { toast } from "react-toastify";

import { AuthContext } from "../../context/AuthContext/AuthContext";
import { Country, State } from "country-state-city";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useOrders } from "../../context/OrderContext/OrderContext";
import { createOrder } from "../../context/OrderContext/OrderApiCalls";
import Spinner from "../../components/Spinner";

import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
} from "@relume_io/relume-ui";
import { useNavigate } from "react-router-dom";

const zipCodePatterns: { [key: string]: RegExp } = {
  US: /^[0-9]{5}(-[0-9]{4})?$/,
  CA: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
  UK: /^[A-Za-z]{1,2}\d[A-Za-z\d]? \d[A-Za-z]{2}$/,
  AU: /^\d{4}$/,
  IN: /^\d{6}$/,
};

const CheckOut: React.FC = ({}) => {
  const { user } = useContext(AuthContext);
  const {
    getCartAmount,
    delivery_fee,
    setCartItems,
    formatAmount,
    currentCurrency,
  } = useShop();
  const { orderDispatch } = useOrders();
  const [coupon, setCoupon] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const {
    getCartDetailsForOrder,
    paymentLoader,
    setPaymentLoader,
    guestEmail,
  } = useShop();
  const [selectedCountry, setSelectedCountry] = useState<any>();
  const [selectedState, setSelectedState] = useState<any>();

  const orderedItems = getCartDetailsForOrder();
  const subtotal = getCartAmount();

  const navigate = useNavigate();
  // Calculate the final total
  const finalTotal = discount
    ? getCartAmount() - (getCartAmount() / 100) * discount + delivery_fee
    : getCartAmount() + delivery_fee;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm({ mode: "onChange" });

  const applyCoupon = () => {
    if (coupon === "SAVE10") {
      setDiscount(10);
      toast.success("Coupon applied successfully!");
    } else if (coupon === "") {
      toast.error("The coupon field is empty please apply the coupon");
    } else {
      toast.error("Invalid Coupon Code");
    }
  };

  const handleOrderSubmission = async (data: any, token: string) => {
    if (data) {
      const today = new Date().toISOString();

      let orderData = {
        ...data,
        user: user ? user.id : null,
        totalPrice: finalTotal,
        guestOrder: guestEmail ? true : false,
        guestEmail: guestEmail ? guestEmail : null,
        coupon,
        currency: currentCurrency,
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
          setSelectedState,
          navigate
        );
      } catch (error) {
        toast.error("Order submission failed. Please try again.");
      }
    } else {
      setPaymentLoader(false);
      toast.error("Please fill in your delivery information.");
      return;
    }
  };

  const onPaymentSuccess = async (token: string) => {
    if (token) {
      const isValid = await trigger(); // Trigger validation for all form fields
      if (!isValid) {
        setPaymentLoader(false);
        toast.error("Please fill in your delivery information.");
        return;
      }

      handleSubmit((data: any) => {
        handleOrderSubmission(data, token); // Proceed with the payment
      })();
    }
  };

  const validateZipCode = (zip: string) => {
    const pattern = zipCodePatterns[selectedCountry] || /^[A-Za-z0-9 -]{3,10}$/;
    return pattern.test(zip) || "Invalid postal code format";
  };

  const phoneValidation = {
    required: "Phone number is required",
    validate: {
      isValid: (value: string) =>
        (value && value.length >= 10) || "Invalid phone number",
    },
  };

  React.useEffect(() => {
    register("phoneNumber", phoneValidation);
  }, [register]);

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
            <form className="grid grid-cols-2 gap-5 w-full poppins">
              <div className="relative w-full mb-1 max-sm:col-span-2">
                <label>First Name</label>
                <input
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  type="text"
                  placeholder="First name"
                  className="border border-border-secondary px-2 py-3 w-full rounded-md"
                  autoComplete="no"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors.firstName.message)}
                  </p>
                )}
              </div>

              <div className="relative w-full mb-1 max-sm:col-span-2">
                <label>Last Name</label>
                <input
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  type="text"
                  placeholder="Last name"
                  className="border border-border-secondary px-2 py-3 w-full rounded-md"
                  autoComplete="no"
                />
                {errors.lastName && (
                  <p className="absolute text-red-500 text-sm mt-1">
                    {String(errors.lastName.message)}
                  </p>
                )}
              </div>

              <div className="relative w-full mb-1 col-span-2">
                <label>Email Address</label>
                <input
                  {...register("email", {
                    required: "Email is required",
                  })}
                  type="text"
                  placeholder="example@gmail.com"
                  className="border border-border-secondary px-2 py-3 w-full rounded-md"
                  autoComplete="no"
                />
                {errors.email && (
                  <p className="absolute text-red-500 text-sm mt-1">
                    {String(errors.email.message)}
                  </p>
                )}
              </div>

              <div className="relative w-full mb-1 max-sm:col-span-2">
                <label>Country</label>
                <select
                  {...register("country", { required: "Country is required" })}
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="border border-border-secondary px-2 py-3 w-full rounded-md bg-white"
                  autoComplete="no"
                >
                  <option value="">Select country</option>
                  {Country.getAllCountries().map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="absolute text-red-500 text-sm mt-1">
                    {String(errors.country.message)}
                  </p>
                )}
              </div>

              <div className="relative w-full mb-1 max-sm:col-span-2">
                <label>State / Region</label>
                <select
                  {...register("cityAndRegion", {
                    required: "City or Region is required",
                  })}
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="border border-border-secondary px-2 py-3 w-full rounded-md bg-white"
                  autoComplete="no"
                >
                  <option value="">Select city/region</option>
                  {State.getStatesOfCountry(selectedCountry).map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.cityAndRegion && (
                  <p className="absolute text-red-500 text-sm mt-1">
                    {String(errors.cityAndRegion.message)}
                  </p>
                )}
              </div>

              {/* address */}
              <div className="relative w-full mb-1 max-md:col-span-2">
                <label>Address Line One</label>
                <input
                  {...register("addressLineOne", {
                    required: "Address is required",
                  })}
                  type="text"
                  placeholder="Address line one"
                  className="border border-border-secondary px-2 py-3 w-full rounded-md"
                  autoComplete="no"
                />
                {errors.addressLineOne && (
                  <p className="absolute text-red-500 text-sm mt-1">
                    {String(errors.addressLineOne.message)}
                  </p>
                )}
              </div>

              <div className="relative w-full mb-1 max-md:col-span-2">
                <div className="flex items-center gap-1">
                  <label>Address Line Two </label>
                  <span className="hidden md:flex">(optional)</span>
                </div>
                <input
                  {...register("addressLineTwo")}
                  type="text"
                  placeholder="Address line two optional"
                  className="border border-border-secondary px-2 py-3 w-full rounded-md "
                  autoComplete="no"
                />
              </div>

              {/* Phone Number */}
              <div className="relative w-full mb-1 max-md:col-span-2">
                <label>Phone Number</label>
                <PhoneInput
                  country="us"
                  value={watch("phoneNumber")}
                  onChange={(phone) =>
                    setValue("phoneNumber", phone, { shouldValidate: true })
                  }
                  // inputClass="w-full border border-border-secondary px-2 py-6 rounded-md"
                  // containerClass="!w-[100px]"
                  containerStyle={{
                    width: "100%", // Tailwind's `w-full`
                    borderRadius: "0.375rem", // Tailwind's `rounded-md`
                  }}
                  inputStyle={{
                    width: "100%", // Tailwind's `w-full`
                    border: "1px solid #afafaf", // Tailwind's `border-border-secondary` (replace with your custom color)
                    padding: "1.5rem 3rem", // Tailwind's `py-2 px-6`
                    borderRadius: "0.375rem", // Tailwind's `rounded-md`
                  }}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors.phoneNumber.message)}
                  </p>
                )}
              </div>

              {/* Zip Code */}
              <div className="relative w-full mb-1 max-md:col-span-2">
                <label>Zip Code / Postal code</label>
                <input
                  {...register("zipCode", {
                    required: "Zip code is required",
                    validate: validateZipCode, // Hooking the custom validation
                  })}
                  type="text"
                  placeholder="Zip code / Postal code"
                  maxLength={12} // Preventing user input beyond 12 characters
                  className="border border-border-secondary px-2 py-3 w-full rounded-md"
                  autoComplete="no"
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors.zipCode.message)}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Payment and Summary */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Payment</h2>
            <div className="mb-[18px] flex flex-col gap-[15px]">
              <div className="flex justify-between">
                <p>Subtotal:</p>
                <p>{formatAmount(subtotal)}</p>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <p>Discount:</p>
                  <p>
                    -{discount}% (
                    {formatAmount((getCartAmount() / 100) * discount)})
                  </p>
                </div>
              )}
              <div className="flex justify-between">
                <p>Delivery Fee:</p>
                <p>{formatAmount(delivery_fee)}</p>
              </div>

              <div className="flex justify-between font-bold">
                <p>Total:</p>
                <p>{formatAmount(finalTotal)}</p>
              </div>
            </div>

            <div className="mb-5">
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
                  onPaymentSuccess(tokenResult.token);
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

// {
//     "user": "66dedaef81577d2dec786e94",
//     "firstName": "Muizz",
//     "lastName": "Muizz",
//     "email": "muizz@gmail.com",
//     "sourceId": "cnon:CA4SEK69FSpHbaS3MF781U3Qnb0YASgC",
//     "currency": "GBP",
//     "coupon": "",
//     "orderedItems": [
//         {
//             "name": "Pink T-shirt",
//             "qty": 1,
//             "image": "https://res.cloudinary.com/dx2alxgiq/image/upload/v1730377838/product_images/djzdd3n6hxvw4j4wzyh0.png",
//             "price": 10.99,
//             "product": "672378ef27f78174ac01aa3c",
//             "size": "M",
//             "_id": "6734cb8772fc5fc34c4b5062"
//         },
//         {
//             "name": "Pink T-shirt",
//             "qty": 1,
//             "image": "https://res.cloudinary.com/dx2alxgiq/image/upload/v1730377838/product_images/djzdd3n6hxvw4j4wzyh0.png",
//             "price": 10.99,
//             "product": "672378ef27f78174ac01aa3c",
//             "size": "2XL",
//             "_id": "6734cb8772fc5fc34c4b5063"
//         }
//     ],
//     "address": "No 21A, Idoji, Okene",
//     "city": "Kuje",
//     "state": "FC",
//     "zipCode": 905101,
//     "country": "NG",
//     "shippingPrice": 100,
//     "totalPrice": 121.98,
//     "paidAt": "2024-11-13T15:53:41.539Z",
//     "isDelivered": false,
//     "_id": "6734cb8772fc5fc34c4b5061",
//     "createdAt": "2024-11-13T15:53:43.528Z",
//     "updatedAt": "2024-11-13T15:53:43.528Z",
//     "__v": 0,
//     "paymentResult": {
//         "payment": {
//             "id": "bJIDTWlENfCLSxhEfvnCZuSVLcVZY",
//             "createdAt": "2024-11-13T15:53:56.559Z",
//             "updatedAt": "2024-11-13T15:53:56.796Z",
//             "amountMoney": {
//                 "amount": "12198",
//                 "currency": "GBP"
//             },
//             "totalMoney": {
//                 "amount": "12198",
//                 "currency": "GBP"
//             },
//             "approvedMoney": {
//                 "amount": "12198",
//                 "currency": "GBP"
//             },
//             "status": "COMPLETED",
//             "delayDuration": "PT168H",
//             "delayAction": "CANCEL",
//             "delayedUntil": "2024-11-20T15:53:56.559Z",
//             "sourceType": "CARD",
//             "cardDetails": {
//                 "status": "CAPTURED",
//                 "card": {
//                     "cardBrand": "VISA",
//                     "last4": "1111",
//                     "expMonth": "11",
//                     "expYear": "2024",
//                     "fingerprint": "sq-1-9QI3c6XiavYctLcKqqQgOQgB8PprRp9AWXEAVoXK5FnFhUcpTueuxpAY72n_evNbIw",
//                     "cardType": "CREDIT",
//                     "prepaidType": "NOT_PREPAID",
//                     "bin": "411111"
//                 },
//                 "entryMethod": "KEYED",
//                 "cvvStatus": "CVV_ACCEPTED",
//                 "avsStatus": "AVS_ACCEPTED",
//                 "statementDescription": "SQ *DEFAULT TEST ACCOUNT",
//                 "cardPaymentTimeline": {
//                     "authorizedAt": "2024-11-13T15:53:56.696Z",
//                     "capturedAt": "2024-11-13T15:53:56.796Z"
//                 }
//             },
//             "locationId": "LNS0B6E8H9C06",
//             "orderId": "xvFVjrT9P5ueqVXs4hZCSdVnClQZY",
//             "riskEvaluation": {
//                 "createdAt": "2024-11-13T15:53:56.696Z",
//                 "riskLevel": "NORMAL"
//             },
//             "receiptNumber": "bJID",
//             "receiptUrl": "https://squareupsandbox.com/receipt/preview/bJIDTWlENfCLSxhEfvnCZuSVLcVZY",
//             "applicationDetails": {
//                 "squareProduct": "ECOMMERCE_API",
//                 "applicationId": "sandbox-sq0idb-vQRLXoHkdEECHbO5_h9o2A"
//             },
//             "versionToken": "hO4gkmRpOCXu8K9tTHlk1cKubHOad5pXe66XxeRrKOn6o"
//         }
//     }
// }
