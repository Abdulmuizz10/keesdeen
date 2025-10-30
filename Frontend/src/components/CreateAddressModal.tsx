import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, MapPin, X } from "lucide-react";
import { Button } from "@relume_io/relume-ui";
import { Country, State } from "country-state-city";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "sonner";
import Axios from "axios";
import { URL } from "../lib/constants";
import { AuthContext } from "../context/AuthContext/AuthContext";

interface SetShowModalProps {
  setShowModal: (value: boolean) => void;
  savedAddress: any;
  setSavedAddress: any;
  handleSelectAddress: any;
}

interface Address {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  state: string;
  address1: string;
  address2?: string;
  phone: string;
  postalCode: string;
}

const CreateAddressModal: React.FC<SetShowModalProps> = ({
  setShowModal,
  savedAddress,
  setSavedAddress,
  handleSelectAddress,
}) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  // 🏠 shipping Address State
  const [shippingAddress, setShippingAddress] = useState<Address>({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    state: "",
    address1: "",
    address2: "",
    phone: "",
    postalCode: "",
  });

  // 💳 Billing Address State
  const [billingAddress, setBillingAddress] = useState<Address>({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    state: "",
    address1: "",
    address2: "",
    phone: "",
    postalCode: "",
  });

  const [sameAsShipping, setSameAsShipping] = useState(false);

  // Copy shipping → billing when checked
  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress(shippingAddress);
    }
  }, [sameAsShipping, shippingAddress]);

  // ✅ Handle shipping Input Change
  const handleShippingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle Billing Input Change
  const handleBillingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "country",
      "state",
      "address1",
      "phone",
      "postalCode",
    ];

    const hasEmptyField = requiredFields.some(
      (key) => !shippingAddress[key as keyof Address]
    );

    if (hasEmptyField) {
      toast.error("Please fill all required shipping address fields.");
      return;
    }

    if (!sameAsShipping) {
      const billingEmpty = requiredFields.some(
        (key) => !billingAddress[key as keyof Address]
      );
      if (billingEmpty) {
        toast.error("Please fill all required billing address fields.");
        return;
      }
    }

    const addressData = {
      user: user.id,
      shippingAddress,
      billingAddress: sameAsShipping ? shippingAddress : billingAddress,
    };

    try {
      const response = await Axios.post(`${URL}/address`, addressData, {
        withCredentials: true,
        validateStatus: (status: any) => status < 600,
      });
      if (response.status === 200) {
        setSavedAddress([response.data, ...savedAddress]);
        handleSelectAddress(response.data._id, response.data);
        toast.success("Address created successfully!");
        setShowModal(false);
      }
    } catch (error) {
      toast.error("Network error, unable to get products!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 h-screen flex items-center justify-center !z-50">
      <div
        className="w-full h-full fixed inset-0 bg-black/50"
        onClick={() => setShowModal(false)}
      />
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative h-[70vh] w-[90%] sm:w-4/5 xl:w-3/5 overflow-y-auto bg-white border border-border-secondary rounded-md py-10 px-4 md:px-10 custom-scrollbar"
      >
        {/* Header */}
        <div className="mb-10 text-center">
          <h3 className="text-lg md:text-2xl font-semibold text-gray-900 bricolage-grotesque mb-1">
            Address
          </h3>
          <p className="text-gray-500 text-sm md:text-base">
            Please create and save your address.
          </p>
        </div>
        <X
          className="absolute top-3 right-5 cursor-pointer"
          onClick={() => setShowModal(false)}
        />

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* SHIPPING ADDRESS */}
          <div>
            <div className="flex gap-3 mb-5">
              <MapPin />
              <h2 className="text-xl font-semibold">Shipping Address</h2>
            </div>

            <div className="grid grid-cols-2 gap-5 w-full poppins">
              {/* First & Last Name */}
              <div className="relative w-full mb-1 max-sm:col-span-2">
                <label>First Name</label>
                <input
                  name="firstName"
                  value={shippingAddress.firstName}
                  onChange={handleShippingChange}
                  type="text"
                  placeholder="First name"
                  className="border border-border-secondary px-2 py-3 w-full rounded focus:outline-none mt-2"
                />
              </div>

              <div className="relative w-full mb-1 max-sm:col-span-2">
                <label>Last Name</label>
                <input
                  name="lastName"
                  value={shippingAddress.lastName}
                  onChange={handleShippingChange}
                  type="text"
                  placeholder="Last name"
                  className="border border-border-secondary px-2 py-3 w-full rounded focus:outline-none mt-2"
                />
              </div>

              {/* Email */}
              <div className="relative w-full mb-1 col-span-2">
                <label>Email Address</label>
                <input
                  name="email"
                  value={shippingAddress.email}
                  onChange={handleShippingChange}
                  type="email"
                  placeholder="example@gmail.com"
                  className="border border-border-secondary px-2 py-3 w-full rounded focus:outline-none mt-2"
                />
              </div>

              {/* Country / State */}
              <div className="relative w-full mb-1 max-sm:col-span-2">
                <label>Country</label>
                <select
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleShippingChange}
                  className="border border-border-secondary px-2 py-3 w-full rounded bg-white mt-2"
                >
                  <option value="">Select country</option>
                  {Country.getAllCountries().map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative w-full mb-1 max-sm:col-span-2">
                <label>State / Province</label>
                <select
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleShippingChange}
                  className="border border-border-secondary px-2 py-3 w-full rounded bg-white mt-2"
                >
                  <option value="">Select state / province</option>
                  {State.getStatesOfCountry(shippingAddress.country).map(
                    (state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Address Lines */}
              <div className="relative w-full mb-1 max-md:col-span-2">
                <label>Address Line One</label>
                <input
                  name="address1"
                  value={shippingAddress.address1}
                  onChange={handleShippingChange}
                  type="text"
                  placeholder="Address line one"
                  className="border border-border-secondary px-2 py-3 w-full rounded focus:outline-none mt-2"
                />
              </div>

              <div className="relative w-full mb-1 max-md:col-span-2">
                <div className="flex items-center gap-1">
                  <label>Address Line Two </label>
                  <span className="hidden md:flex">(optional)</span>
                </div>
                <input
                  name="address2"
                  value={shippingAddress.address2}
                  onChange={handleShippingChange}
                  type="text"
                  placeholder="Address line two optional"
                  className="border border-border-secondary px-2 py-3 w-full rounded  focus:outline-none mt-2"
                />
              </div>

              {/* Phone & Postal */}
              <div className="relative w-full mb-1 max-md:col-span-2">
                <label>Phone Number</label>
                <PhoneInput
                  country="gb"
                  value={shippingAddress.phone}
                  onChange={(phone) =>
                    setShippingAddress((prev) => ({ ...prev, phone }))
                  }
                  containerStyle={{
                    width: "100%",
                    borderRadius: "0.375rem",
                    marginTop: "8px",
                  }}
                  inputStyle={{
                    width: "100%",
                    border: "1px solid #afafaf",
                    padding: "1.5rem 3rem",
                    borderRadius: "4px",
                    fontFamily: "poppins",
                  }}
                />
              </div>

              <div className="relative w-full mb-1 max-md:col-span-2">
                <label>Postal code</label>
                <input
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleShippingChange}
                  type="text"
                  placeholder="Postal code"
                  maxLength={12} // Preventing user input beyond 12 characters
                  className="border border-border-secondary px-2 py-3 w-full rounded focus:outline-none mt-2"
                />
              </div>
            </div>
          </div>

          {/* BILLING CHECKBOX */}
          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="billingSameAsShipping"
              checked={sameAsShipping}
              onChange={() => setSameAsShipping(!sameAsShipping)}
              className="h-5 w-5 cursor-pointer"
            />
            <label
              htmlFor="billingSameAsShipping"
              className="text-[14px] sm:text-base cursor-pointer"
            >
              Billing address same as shipping address
            </label>
          </div>

          {/* BILLING ADDRESS */}
          {!sameAsShipping && (
            <div>
              <div className="flex gap-3 mb-5">
                <CreditCard />
                <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
              </div>

              <div className="grid grid-cols-2 gap-5 w-full poppins">
                <div className="relative w-full mb-1 max-sm:col-span-2">
                  <label>First Name</label>
                  <input
                    name="firstName"
                    value={billingAddress.firstName}
                    onChange={handleBillingChange}
                    type="text"
                    placeholder="First name"
                    className="border border-border-secondary px-2 py-3 w-full rounded focus:outline-none mt-2"
                  />
                </div>

                <div className="relative w-full mb-1 max-sm:col-span-2">
                  <label>Last Name</label>
                  <input
                    name="lastName"
                    value={billingAddress.lastName}
                    onChange={handleBillingChange}
                    type="text"
                    placeholder="Last name"
                    className="border border-border-secondary px-2 py-3 w-full rounded focus:outline-none mt-2"
                  />
                </div>

                <div className="relative w-full mb-1 col-span-2">
                  <label>Email Address</label>
                  <input
                    name="email"
                    value={billingAddress.email}
                    onChange={handleBillingChange}
                    type="email"
                    placeholder="example@gmail.com"
                    className="border border-border-secondary px-2 py-3 w-full rounded focus:outline-none mt-2"
                  />
                </div>

                <div className="relative w-full mb-1 max-sm:col-span-2">
                  <label>Country</label>
                  <select
                    name="country"
                    value={billingAddress.country}
                    onChange={handleBillingChange}
                    className="border border-border-secondary px-2 py-3 w-full rounded bg-white mt-2"
                  >
                    <option value="">Select country</option>
                    {Country.getAllCountries().map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative w-full mb-1 max-sm:col-span-2">
                  <label>State / Province</label>
                  <select
                    name="state"
                    value={billingAddress.state}
                    onChange={handleBillingChange}
                    className="border border-border-secondary px-2 py-3 w-full rounded bg-white mt-2"
                    autoComplete="no"
                  >
                    <option value="">Select State / Province</option>
                    {State.getStatesOfCountry(billingAddress.country).map(
                      (state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* address */}
                <div className="relative w-full mb-1 max-md:col-span-2">
                  <label>Address Line One</label>
                  <input
                    name="address1"
                    value={billingAddress.address1}
                    onChange={handleBillingChange}
                    type="text"
                    placeholder="Address line one"
                    className="border border-border-secondary px-2 py-3 w-full rounded focus:outline-none mt-2"
                  />
                </div>

                <div className="relative w-full mb-1 max-md:col-span-2">
                  <div className="flex items-center gap-1">
                    <label>Address Line Two </label>
                    <span className="hidden md:flex">(optional)</span>
                  </div>
                  <input
                    name="address2"
                    value={billingAddress.address2}
                    onChange={handleBillingChange}
                    type="text"
                    placeholder="Address line two optional"
                    className="border border-border-secondary px-2 py-3 w-full rounded focus:outline-none mt-2"
                  />
                </div>

                {/* Phone Number */}
                <div className="relative w-full mb-1 max-md:col-span-2">
                  <label>Phone Number</label>
                  <PhoneInput
                    country="gb"
                    value={billingAddress.phone}
                    onChange={(phone) =>
                      setBillingAddress((prev) => ({ ...prev, phone }))
                    }
                    containerStyle={{
                      width: "100%",
                      borderRadius: "0.375rem",
                      marginTop: "8px",
                    }}
                    inputStyle={{
                      width: "100%",
                      border: "1px solid #afafaf",
                      padding: "1.5rem 3rem",
                      borderRadius: "4px",
                      fontFamily: "poppins",
                    }}
                  />
                </div>

                {/* Zip Code */}
                <div className="relative w-full mb-1 max-md:col-span-2">
                  <label>Postal code</label>
                  <input
                    name="postalCode"
                    value={billingAddress.postalCode}
                    onChange={handleBillingChange}
                    type="text"
                    placeholder="Postal code"
                    maxLength={12} // Preventing user input beyond 12 characters
                    className="border border-border-secondary px-2 py-3 w-full rounded focus:outline-none mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="bg-brand-neutral text-white rounded-md py-3 px-10 w-full text-base poppins"
          >
            {loading ? "Loading..." : "Save Address"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateAddressModal;
