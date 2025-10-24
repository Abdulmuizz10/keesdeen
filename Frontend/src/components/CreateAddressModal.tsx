import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, MapPin, X } from "lucide-react";
import { Button } from "@relume_io/relume-ui";
import { Country, State } from "country-state-city";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "sonner";
import { useShop } from "../context/ShopContext";

interface SetShowModalProps {
  setShowModal: (value: boolean) => void;
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

const CreateAddressModal: React.FC<SetShowModalProps> = ({ setShowModal }) => {
  const { savedAddresses, setSavedAddresses } = useShop();
  // 🏠 Delivery Address State
  const [deliveryAddress, setDeliveryAddress] = useState<Address>({
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

  const [sameAsDelivery, setSameAsDelivery] = useState(false);

  // Copy delivery → billing when checked
  useEffect(() => {
    if (sameAsDelivery) {
      setBillingAddress(deliveryAddress);
    }
  }, [sameAsDelivery, deliveryAddress]);

  // ✅ Handle Delivery Input Change
  const handleDeliveryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDeliveryAddress((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle Billing Input Change
  const handleBillingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
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
      (key) => !deliveryAddress[key as keyof Address]
    );

    if (hasEmptyField) {
      toast.error("Please fill all required delivery address fields.");
      return;
    }

    if (!sameAsDelivery) {
      const billingEmpty = requiredFields.some(
        (key) => !billingAddress[key as keyof Address]
      );
      if (billingEmpty) {
        toast.error("Please fill all required billing address fields.");
        return;
      }
    }

    const generateId = (): string => {
      return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const addressData = {
      id: generateId(),
      deliveryAddress,
      billingAddress: sameAsDelivery ? deliveryAddress : billingAddress,
    };

    setSavedAddresses([...savedAddresses, addressData]);
    toast.success("Address created successfully!");
    setShowModal(false);
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
        className="relative h-[70vh] w-[90%] sm:w-3/5 overflow-y-auto bg-white border border-border-secondary rounded-md py-10 px-4 md:px-10 custom-scrollbar"
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
          {/* DELIVERY ADDRESS */}
          <div>
            <div className="flex gap-3 mb-5">
              <MapPin />
              <h2 className="text-xl font-semibold">Delivery Address</h2>
            </div>

            <div className="grid grid-cols-2 gap-5 w-full poppins">
              {/* First & Last Name */}
              <div className="relative w-full mb-1 max-sm:col-span-2">
                <label>First Name</label>
                <input
                  name="firstName"
                  value={deliveryAddress.firstName}
                  onChange={handleDeliveryChange}
                  type="text"
                  placeholder="First name"
                  className="border border-border-secondary px-2 py-3 w-full rounded-md focus:outline-none mt-2"
                />
              </div>

              <div className="relative w-full mb-1 max-sm:col-span-2">
                <label>Last Name</label>
                <input
                  name="lastName"
                  value={deliveryAddress.lastName}
                  onChange={handleDeliveryChange}
                  type="text"
                  placeholder="Last name"
                  className="border border-border-secondary px-2 py-3 w-full rounded-md focus:outline-none mt-2"
                />
              </div>

              {/* Email */}
              <div className="relative w-full mb-1 col-span-2">
                <label>Email Address</label>
                <input
                  name="email"
                  value={deliveryAddress.email}
                  onChange={handleDeliveryChange}
                  type="text"
                  placeholder="example@gmail.com"
                  className="border border-border-secondary px-2 py-3 w-full rounded-md focus:outline-none mt-2"
                />
              </div>

              {/* Country / State */}
              <div className="relative w-full mb-1 max-sm:col-span-2">
                <label>Country</label>
                <select
                  name="country"
                  value={deliveryAddress.country}
                  onChange={handleDeliveryChange}
                  className="border border-border-secondary px-2 py-3 w-full rounded-md bg-white mt-2"
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
                  value={deliveryAddress.state}
                  onChange={handleDeliveryChange}
                  className="border border-border-secondary px-2 py-3 w-full rounded-md bg-white mt-2"
                >
                  <option value="">Select state / province</option>
                  {State.getStatesOfCountry(deliveryAddress.country).map(
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
                  value={deliveryAddress.address1}
                  onChange={handleDeliveryChange}
                  type="text"
                  placeholder="Address line one"
                  className="border border-border-secondary px-2 py-3 w-full rounded-md focus:outline-none mt-2"
                />
              </div>

              <div className="relative w-full mb-1 max-md:col-span-2">
                <div className="flex items-center gap-1">
                  <label>Address Line Two </label>
                  <span className="hidden md:flex">(optional)</span>
                </div>
                <input
                  name="address2"
                  value={deliveryAddress.address2}
                  onChange={handleDeliveryChange}
                  type="text"
                  placeholder="Address line two optional"
                  className="border border-border-secondary px-2 py-3 w-full rounded-md  focus:outline-none mt-2"
                />
              </div>

              {/* Phone & Postal */}
              <div className="relative w-full mb-1 max-md:col-span-2">
                <label>Phone Number</label>
                <PhoneInput
                  country="gb"
                  value={deliveryAddress.phone}
                  onChange={(phone) =>
                    setDeliveryAddress((prev) => ({ ...prev, phone }))
                  }
                  containerStyle={{
                    width: "100%",
                    borderRadius: "0.375rem",
                    marginTop: "12px",
                  }}
                  inputStyle={{
                    width: "100%",
                    border: "1px solid #afafaf",
                    padding: "1.5rem 3rem",
                    borderRadius: "0.375rem",
                  }}
                />
              </div>

              <div className="relative w-full mb-1 max-md:col-span-2">
                <label>Zip Code / Postal code</label>
                <input
                  name="postalCode"
                  value={deliveryAddress.postalCode}
                  onChange={handleDeliveryChange}
                  type="text"
                  placeholder="Zip code / Postal code"
                  maxLength={12} // Preventing user input beyond 12 characters
                  className="border border-border-secondary px-2 py-3 w-full rounded-md focus:outline-none mt-2"
                />
              </div>
            </div>
          </div>

          {/* BILLING CHECKBOX */}
          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="billingSameAsShipping"
              checked={sameAsDelivery}
              onChange={() => setSameAsDelivery(!sameAsDelivery)}
              className="h-5 w-5 cursor-pointer"
            />
            <label
              htmlFor="billingSameAsShipping"
              className="text-[14px] sm:text-base cursor-pointer"
            >
              Billing address same as delivery address
            </label>
          </div>

          {/* BILLING ADDRESS */}
          {!sameAsDelivery && (
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
                    className="border border-border-secondary px-2 py-3 w-full rounded-md focus:outline-none mt-2"
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
                    className="border border-border-secondary px-2 py-3 w-full rounded-md focus:outline-none mt-2"
                  />
                </div>

                <div className="relative w-full mb-1 col-span-2">
                  <label>Email Address</label>
                  <input
                    name="email"
                    value={billingAddress.email}
                    onChange={handleBillingChange}
                    type="text"
                    placeholder="example@gmail.com"
                    className="border border-border-secondary px-2 py-3 w-full rounded-md focus:outline-none mt-2"
                  />
                </div>

                <div className="relative w-full mb-1 max-sm:col-span-2">
                  <label>Country</label>
                  <select
                    name="country"
                    value={billingAddress.country}
                    onChange={handleBillingChange}
                    className="border border-border-secondary px-2 py-3 w-full rounded-md bg-white mt-2"
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
                    className="border border-border-secondary px-2 py-3 w-full rounded-md bg-white mt-2"
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
                    className="border border-border-secondary px-2 py-3 w-full rounded-md focus:outline-none mt-2"
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
                    className="border border-border-secondary px-2 py-3 w-full rounded-md  focus:outline-none mt-2"
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
                      marginTop: "12px",
                    }}
                    inputStyle={{
                      width: "100%",
                      border: "1px solid #afafaf",
                      padding: "1.5rem 3rem",
                      borderRadius: "0.375rem",
                    }}
                  />
                </div>

                {/* Zip Code */}
                <div className="relative w-full mb-1 max-md:col-span-2">
                  <label>Zip Code / Postal code</label>
                  <input
                    name="postalCode"
                    value={billingAddress.postalCode}
                    onChange={handleBillingChange}
                    type="text"
                    placeholder="Zip code / Postal code"
                    maxLength={12} // Preventing user input beyond 12 characters
                    className="border border-border-secondary px-2 py-3 w-full rounded-md focus:outline-none mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="bg-brand-neutral text-white rounded-md py-3 px-10 w-full text-base poppins"
          >
            Save Address
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateAddressModal;
