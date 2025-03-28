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
import { createOrder } from "../../context/OrderContext/OrderApiCalls";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import { formatAmountDefault } from "../../lib/utils";
import { currency, URL } from "../../lib/constants";
import Axios from "axios";

interface OrderData {
  user: any;
  email: any;
  currency: string;
  coupon: string;
  orderedItems: any;
  shippingAddress: {
    firstName: any;
    lastName: any;
    country: any;
    state: any;
    addressLineOne: any;
    addressLineTwo: any;
    phoneNumber: any;
    zipCode: any;
  };
  billingAddress?: {
    firstName: any;
    lastName: any;
    country: any;
    state: any;
    street: any;
    phoneNumber: any;
    zipCode: any;
  };
  billingSameAsShipping: boolean;
  shippingPrice: number;
  totalPrice: number;
  guestOrder: boolean;
  guestEmail: string | null;
  paidAt: string;
  sourceId: string;
}

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
    deliveryFee,
    discountPercent,
    setCartItems,
    getCartDetailsForOrder,
    guestEmail,
    // currentCurrency,
  } = useShop();
  const [loading, setLoading] = useState<boolean>(false);
  const [coupon, setCoupon] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [deliverySelectedCountry, setDeliverySelectedCountry] = useState<any>();
  const [deliverySelectedState, setDeliverySelectedState] = useState<any>();
  const [billingSelectedCountry, setBillingSelectedCountry] = useState<any>();
  const [billingSelectedState, setBillingSelectedState] = useState<any>();
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(false);
  const orderedItems = getCartDetailsForOrder();
  const navigate = useNavigate();

  const subtotal = getCartAmount();
  const discountAmount = (subtotal / 100) * discount;
  const finalTotal = subtotal - discountAmount + deliveryFee;

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
    unregister,
  } = useForm({ mode: "onChange" });

  const applyCoupon = async () => {
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

  const handleBillingCheckbox = () => {
    setBillingSameAsShipping(!billingSameAsShipping);
    if (!billingSameAsShipping) {
      unregister("billingFirstName");
      unregister("billingLastName");
      unregister("billingCountry");
      unregister("billingState");
      unregister("billingStreet");
      unregister("billingPhoneNumber");
      unregister("billingZipCode");
      setBillingSelectedCountry("");
      setBillingSelectedState("");
    } else {
      register("billingFirstName");
      register("billingLastName");
      register("billingCountry");
      register("billingState");
      register("billingStreet");
      register("billingPhoneNumber");
      register("billingZipCode");
    }
  };

  const handleOrderSubmission = async (data: any, token: string) => {
    const today = new Date().toISOString();

    const orderData: OrderData = {
      user: user ? user.id : null,
      email: data.email,
      currency: currency,
      coupon,
      orderedItems,
      shippingAddress: {
        firstName: data.deliveryFirstName,
        lastName: data.deliveryLastName,
        country: data.deliveryCountry,
        state: data.deliveryState,
        addressLineOne: data.deliveryAddressLineOne,
        addressLineTwo: data.deliveryAddressLineTwo,
        phoneNumber: data.deliveryPhoneNumber,
        zipCode: data.deliveryZipCode,
      },
      billingSameAsShipping,
      shippingPrice: deliveryFee,
      totalPrice: finalTotal,
      guestOrder: !!guestEmail,
      guestEmail: guestEmail || null,
      paidAt: today,
      sourceId: token,
    };

    if (!billingSameAsShipping) {
      orderData.billingAddress = {
        firstName: data.billingFirstName,
        lastName: data.billingLastName,
        country: data.billingCountry,
        state: data.billingState,
        street: data.billingStreet,
        phoneNumber: data.billingPhoneNumber,
        zipCode: data.billingZipCode,
      };
    }
    try {
      await createOrder(
        orderData,
        setLoading,
        setCartItems,
        setDeliverySelectedCountry,
        setDeliverySelectedState,
        setBillingSelectedCountry,
        setBillingSelectedState,
        navigate
      );
    } catch (error) {
      toast.error("Order submission failed. Please try again.");
      setLoading(false);
    }
  };

  const onPaymentSuccess = async (token: string) => {
    if (token) {
      const isValid = await trigger();
      if (!isValid) {
        setLoading(false);
        toast.error("Please fill all your information completely.");
        return;
      }
      handleSubmit((data: any) => handleOrderSubmission(data, token))();
    }
  };

  const deliveryValidateZipCode = (zip: string) => {
    const pattern =
      zipCodePatterns[deliverySelectedCountry] || /^[A-Za-z0-9 -]{3,10}$/;
    return pattern.test(zip) || "Invalid postal code format";
  };

  const billingValidateZipCode = (zip: string) => {
    const pattern =
      zipCodePatterns[billingSelectedCountry] || /^[A-Za-z0-9 -]{3,10}$/;
    return pattern.test(zip) || "Invalid postal code format";
  };

  const deliveryPhoneValidation = {
    required: "Phone number is required",
    validate: {
      isValid: (value: string) =>
        (value && value.length >= 10) || "Invalid phone number",
    },
  };

  const billingPhoneValidation = {
    required: "Phone number is required",
    validate: {
      isValid: (value: string) =>
        (value && value.length >= 10) || "Invalid phone number",
    },
  };

  useEffect(() => {
    register("deliveryPhoneNumber", deliveryPhoneValidation);
    register("billingPhoneNumber", billingPhoneValidation);
  }, [register]);

  return (
    <section className="px-[5%] py-24 md:py-30">
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 h-screen w-screen flex items-center justify-center bg-black/50 z-50">
          <Spinner />
        </div>
      )}
      <div className="container">
        <div className="mb-5 border-b border-border-secondary">
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque text-gradient">
            Checkout
          </h2>
          <p className="md:text-md pb-5">
            Please provide delivery and billing information below.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:pt-5">
          <div className="flex flex-col gap-5">
            <form className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                <div className="grid grid-cols-2 gap-5 w-full poppins">
                  <div className="relative w-full mb-1 max-sm:col-span-2">
                    <label>First Name</label>
                    <input
                      {...register("deliveryFirstName", {
                        required: "First name is required",
                      })}
                      type="text"
                      placeholder="First name"
                      className="border border-border-secondary px-2 py-3 w-full rounded-md"
                      autoComplete="no"
                    />
                    {errors.deliveryFirstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {String(errors.deliveryFirstName.message)}
                      </p>
                    )}
                  </div>
                  <div className="relative w-full mb-1 max-sm:col-span-2">
                    <label>Last Name</label>
                    <input
                      {...register("deliveryLastName", {
                        required: "Last name is required",
                      })}
                      type="text"
                      placeholder="Last name"
                      className="border border-border-secondary px-2 py-3 w-full rounded-md"
                      autoComplete="no"
                    />
                    {errors.deliveryLastName && (
                      <p className="absolute text-red-500 text-sm mt-1">
                        {String(errors.deliveryLastName.message)}
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
                      {...register("deliveryCountry", {
                        required: "Country is required",
                      })}
                      value={deliverySelectedCountry}
                      onChange={(e) =>
                        setDeliverySelectedCountry(e.target.value)
                      }
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
                    {errors.deliveryCountry && (
                      <p className="absolute text-red-500 text-sm mt-1">
                        {String(errors.deliveryCountry.message)}
                      </p>
                    )}
                  </div>
                  <div className="relative w-full mb-1 max-sm:col-span-2">
                    <label>State / Province</label>
                    <select
                      {...register("deliveryState", {
                        required: "State is required",
                      })}
                      value={deliverySelectedState}
                      onChange={(e) => setDeliverySelectedState(e.target.value)}
                      className="border border-border-secondary px-2 py-3 w-full rounded-md bg-white"
                      autoComplete="no"
                    >
                      <option value="">Select state / province</option>
                      {State.getStatesOfCountry(deliverySelectedCountry).map(
                        (state) => (
                          <option key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </option>
                        )
                      )}
                    </select>
                    {errors.deliveryState && (
                      <p className="absolute text-red-500 text-sm mt-1">
                        {String(errors.deliveryState.message)}
                      </p>
                    )}
                  </div>

                  {/* address */}
                  <div className="relative w-full mb-1 max-md:col-span-2">
                    <label>Address Line One</label>
                    <input
                      {...register("deliveryAddressLineOne", {
                        required: "Address is required",
                      })}
                      type="text"
                      placeholder="Address line one"
                      className="border border-border-secondary px-2 py-3 w-full rounded-md"
                      autoComplete="no"
                    />
                    {errors.deliveryAddressLineOne && (
                      <p className="absolute text-red-500 text-sm mt-1">
                        {String(errors.deliveryAddressLineOne.message)}
                      </p>
                    )}
                  </div>
                  <div className="relative w-full mb-1 max-md:col-span-2">
                    <div className="flex items-center gap-1">
                      <label>Address Line Two </label>
                      <span className="hidden md:flex">(optional)</span>
                    </div>
                    <input
                      {...register("deliveryAddressLineTwo")}
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
                      country="gb"
                      value={watch("deliveryPhoneNumber")}
                      onChange={(phone) =>
                        setValue("deliveryPhoneNumber", phone, {
                          shouldValidate: true,
                        })
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
                    {errors.deliveryPhoneNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {String(errors.deliveryPhoneNumber.message)}
                      </p>
                    )}
                  </div>
                  {/* Zip Code */}
                  <div className="relative w-full mb-1 max-md:col-span-2">
                    <label>Zip Code / Postal code</label>
                    <input
                      {...register("deliveryZipCode", {
                        required: "Zip code is required",
                        validate: deliveryValidateZipCode, // Hooking the custom validation
                      })}
                      type="text"
                      placeholder="Zip code / Postal code"
                      maxLength={12} // Preventing user input beyond 12 characters
                      className="border border-border-secondary px-2 py-3 w-full rounded-md"
                      autoComplete="no"
                    />
                    {errors.deliveryZipCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {String(errors.deliveryZipCode.message)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="billingSameAsShipping"
                  checked={billingSameAsShipping}
                  onChange={handleBillingCheckbox}
                  className="h-5 w-5 cursor-pointer"
                />
                <label
                  htmlFor="billingSameAsShipping"
                  className="text-[14px] sm:text-base cursor-pointer"
                >
                  Billing address same as shipping address
                </label>
              </div>
              {!billingSameAsShipping ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Billing Address
                  </h2>
                  <div className="grid grid-cols-2 gap-5 w-full poppins">
                    <div className="relative w-full mb-1 max-sm:col-span-2">
                      <label>First Name</label>
                      <input
                        {...register("billingFirstName", {
                          required: "First name is required",
                        })}
                        type="text"
                        placeholder="First name"
                        className="border border-border-secondary px-2 py-3 w-full rounded-md"
                        autoComplete="no"
                      />
                      {errors.billingFirstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {String(errors.billingFirstName.message)}
                        </p>
                      )}
                    </div>
                    <div className="relative w-full mb-1 max-sm:col-span-2">
                      <label>Last Name</label>
                      <input
                        {...register("billingLastName", {
                          required: "Last name is required",
                        })}
                        type="text"
                        placeholder="Last name"
                        className="border border-border-secondary px-2 py-3 w-full rounded-md"
                        autoComplete="no"
                      />
                      {errors.billingLastName && (
                        <p className="absolute text-red-500 text-sm mt-1">
                          {String(errors.billingLastName.message)}
                        </p>
                      )}
                    </div>
                    <div className="relative w-full mb-1 max-sm:col-span-2">
                      <label>Country</label>
                      <select
                        {...register("billingCountry", {
                          required: "Country is required",
                        })}
                        value={billingSelectedCountry}
                        onChange={(e) =>
                          setBillingSelectedCountry(e.target.value)
                        }
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
                      {errors.billingCountry && (
                        <p className="absolute text-red-500 text-sm mt-1">
                          {String(errors.billingCountry.message)}
                        </p>
                      )}
                    </div>
                    <div className="relative w-full mb-1 max-sm:col-span-2">
                      <label>State / Province</label>
                      <select
                        {...register("billingState", {
                          required: "State is required",
                        })}
                        value={billingSelectedState}
                        onChange={(e) =>
                          setBillingSelectedState(e.target.value)
                        }
                        className="border border-border-secondary px-2 py-3 w-full rounded-md bg-white"
                        autoComplete="no"
                      >
                        <option value="">Select State / Province</option>
                        {State.getStatesOfCountry(billingSelectedCountry).map(
                          (state) => (
                            <option key={state.isoCode} value={state.isoCode}>
                              {state.name}
                            </option>
                          )
                        )}
                      </select>
                      {errors.billingState && (
                        <p className="absolute text-red-500 text-sm mt-1">
                          {String(errors.billingState.message)}
                        </p>
                      )}
                    </div>

                    {/* address */}
                    <div className="relative w-full mb-1 max-md:col-span-2">
                      <label>Street address</label>
                      <input
                        {...register("billingStreet", {
                          required: "Address is required",
                        })}
                        type="text"
                        placeholder="Street address"
                        className="border border-border-secondary px-2 py-3 w-full rounded-md"
                        autoComplete="no"
                      />
                      {errors.billingStreet && (
                        <p className="absolute text-red-500 text-sm mt-1">
                          {String(errors.billingStreet.message)}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="relative w-full mb-1 max-md:col-span-2">
                      <label>Phone Number</label>
                      <PhoneInput
                        country="gb"
                        value={watch("billingPhoneNumber")}
                        onChange={(phone) =>
                          setValue("billingPhoneNumber", phone, {
                            shouldValidate: true,
                          })
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
                      {errors.billingPhoneNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {String(errors.billingPhoneNumber.message)}
                        </p>
                      )}
                    </div>
                    {/* Zip Code */}
                    <div className="relative w-full mb-1 col-span-2">
                      <label>Zip Code / Postal code</label>
                      <input
                        {...register("billingZipCode", {
                          required: "Zip code is required",
                          validate: billingValidateZipCode, // Hooking the custom validation
                        })}
                        type="text"
                        placeholder="Zip code / Postal code"
                        maxLength={12} // Preventing user input beyond 12 characters
                        className="border border-border-secondary px-2 py-3 w-full rounded-md"
                        autoComplete="no"
                      />
                      {errors.billingZipCode && (
                        <p className="text-red-500 text-sm mt-1">
                          {String(errors.billingZipCode.message)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </form>
          </div>
          {/* Payment and Summary */}
          <div className="poppins">
            <h2 className="text-xl font-semibold mb-6">Payment</h2>
            <div className="mb-[18px] flex flex-col gap-[15px]">
              <div className="flex justify-between">
                <p>Subtotal:</p>
                <p>{formatAmountDefault(currency, subtotal)}</p>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <p>Discount:</p>
                  <p>
                    -{discount}% (
                    {formatAmountDefault(currency, discountAmount)})
                  </p>
                </div>
              )}
              <div className="flex justify-between">
                <p>Delivery Fee:</p>
                <p>{formatAmountDefault(currency, deliveryFee)}</p>
              </div>
              <div className="flex justify-between font-bold">
                <p>Total:</p>
                <p>{formatAmountDefault(currency, finalTotal)}</p>
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
              // applicationId={"sq0idp-iYzYlKuv3IrrCUgk0mL_Tw"}
              // locationId={"LNS0B6E8H9C06"}
              applicationId={import.meta.env.VITE_SQUARE_APP_ID}
              locationId={import.meta.env.VITE_SQUARE_LOCATION_ID}
              cardTokenizeResponseReceived={(tokenResult: any) => {
                setLoading(true);
                if (tokenResult.errors) {
                  toast.error("Payment failed. Please try again.");
                  setLoading(false);
                } else {
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
                {formatAmountDefault(currency, finalTotal)}
              </CreditCard>
            </PaymentForm>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckOut;
