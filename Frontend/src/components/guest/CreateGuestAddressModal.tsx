import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Country, State } from "country-state-city";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "sonner";

interface SetShowModalProps {
  setShowModal: (value: boolean) => void;
  guestSavedAddress: any;
  setGuestSavedAddress: any;
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

const CreateGuestAddressModal: React.FC<SetShowModalProps> = ({
  setShowModal,
  guestSavedAddress,
  setGuestSavedAddress,
  handleSelectAddress,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

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

  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress(shippingAddress);
    }
  }, [sameAsShipping, shippingAddress]);

  const handleShippingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
      (key) => !shippingAddress[key as keyof Address],
    );

    if (hasEmptyField) {
      toast.error("Please fill all required shipping address fields.");
      return;
    }

    if (!sameAsShipping) {
      const billingEmpty = requiredFields.some(
        (key) => !billingAddress[key as keyof Address],
      );
      if (billingEmpty) {
        toast.error("Please fill all required billing address fields.");
        return;
      }
    }

    const addressData = {
      //   user: user.id,
      _id: Math.floor(Math.random() * 10000) + 1,
      shippingAddress,
      billingAddress: sameAsShipping ? shippingAddress : billingAddress,
    };

    setLoading(true);
    setGuestSavedAddress([addressData, ...guestSavedAddress]);
    handleSelectAddress(addressData._id, addressData);
    toast.success("Address created successfully!");
    setShowModal(false);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-sm"
        onClick={() => setShowModal(false)}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 h-[85vh] w-[90%] overflow-y-auto border border-gray-300 bg-white p-6 md:w-4/5 md:p-10 xl:w-3/5 custom-scrollbar"
      >
        {/* Close Button */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-900"
        >
          <X size={24} strokeWidth={1.5} />
        </button>

        {/* Header */}
        <div className="mb-12 border-b border-gray-200 pb-8">
          <h2 className="mb-2 text-lg font-light tracking-tight md:text-xl">
            New Address
          </h2>
          <p className="text-sm text-gray-500">
            Enter your shipping and billing details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* SHIPPING ADDRESS */}
          <div>
            <h3 className="mb-6 text-xs uppercase tracking-widest text-gray-500">
              Shipping Address
            </h3>

            <div className="grid grid-cols-2 gap-6">
              {/* First Name */}
              <div className="col-span-2 md:col-span-1">
                <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
                  First Name
                </label>
                <input
                  name="firstName"
                  value={shippingAddress.firstName}
                  onChange={handleShippingChange}
                  type="text"
                  placeholder="First name"
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>

              {/* Last Name */}
              <div className="col-span-2 md:col-span-1">
                <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
                  Last Name
                </label>
                <input
                  name="lastName"
                  value={shippingAddress.lastName}
                  onChange={handleShippingChange}
                  type="text"
                  placeholder="Last name"
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="col-span-2">
                <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
                  Email
                </label>
                <input
                  name="email"
                  value={shippingAddress.email}
                  onChange={handleShippingChange}
                  type="email"
                  placeholder="example@gmail.com"
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>

              {/* Country */}
              <div className="col-span-2 md:col-span-1">
                <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
                  Country
                </label>
                <select
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleShippingChange}
                  className="w-full border border-gray-300 bg-white px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                >
                  <option value="">Select country</option>
                  {Country.getAllCountries().map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div className="col-span-2 md:col-span-1">
                <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
                  State / Province
                </label>
                <select
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleShippingChange}
                  className="w-full border border-gray-300 bg-white px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                >
                  <option value="">Select state</option>
                  {State.getStatesOfCountry(shippingAddress.country).map(
                    (state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* Address Line 1 */}
              <div className="col-span-2 md:col-span-1">
                <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
                  Address Line 1
                </label>
                <input
                  name="address1"
                  value={shippingAddress.address1}
                  onChange={handleShippingChange}
                  type="text"
                  placeholder="Street address"
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>

              {/* Address Line 2 */}
              <div className="col-span-2 md:col-span-1">
                <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
                  Address Line 2{" "}
                  <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  name="address2"
                  value={shippingAddress.address2}
                  onChange={handleShippingChange}
                  type="text"
                  placeholder="Apartment, suite, etc."
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>

              {/* Phone */}
              <div className="col-span-2 md:col-span-1">
                <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
                  Phone Number
                </label>
                <PhoneInput
                  country="gb"
                  value={shippingAddress.phone}
                  onChange={(phone) =>
                    setShippingAddress((prev) => ({ ...prev, phone }))
                  }
                  containerStyle={{ width: "100%" }}
                  inputStyle={{
                    width: "100%",
                    border: "1px solid #d1d5db",
                    padding: "1.4rem 3rem",
                    fontSize: "0.875rem",
                    borderRadius: "0",
                  }}
                />
              </div>

              {/* Postal Code */}
              <div className="col-span-2 md:col-span-1">
                <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
                  Postal Code
                </label>
                <input
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleShippingChange}
                  type="text"
                  placeholder="Postal code"
                  maxLength={12}
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* BILLING CHECKBOX */}
          <div className="border-t border-gray-200 pt-6">
            <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-600 transition-colors hover:text-gray-900">
              <input
                type="checkbox"
                checked={sameAsShipping}
                onChange={() => setSameAsShipping(!sameAsShipping)}
                className="h-4 w-4 cursor-pointer border-gray-300"
              />
              Billing address same as shipping
            </label>
          </div>

          {/* BILLING ADDRESS */}
          {!sameAsShipping && (
            <div>
              <h3 className="mb-6 text-xs uppercase tracking-widest text-gray-500">
                Billing Address
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={billingAddress.firstName}
                    onChange={handleBillingChange}
                    type="text"
                    placeholder="First name"
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    value={billingAddress.lastName}
                    onChange={handleBillingChange}
                    type="text"
                    placeholder="Last name"
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
                    Email
                  </label>
                  <input
                    name="email"
                    value={billingAddress.email}
                    onChange={handleBillingChange}
                    type="email"
                    placeholder="example@gmail.com"
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
                    Country
                  </label>
                  <select
                    name="country"
                    value={billingAddress.country}
                    onChange={handleBillingChange}
                    className="w-full border border-gray-300 bg-white px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                  >
                    <option value="">Select country</option>
                    {Country.getAllCountries().map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
                    State / Province
                  </label>
                  <select
                    name="state"
                    value={billingAddress.state}
                    onChange={handleBillingChange}
                    className="w-full border border-gray-300 bg-white px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                  >
                    <option value="">Select state</option>
                    {State.getStatesOfCountry(billingAddress.country).map(
                      (state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
                    Address Line 1
                  </label>
                  <input
                    name="address1"
                    value={billingAddress.address1}
                    onChange={handleBillingChange}
                    type="text"
                    placeholder="Street address"
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
                    Address Line 2{" "}
                    <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    name="address2"
                    value={billingAddress.address2}
                    onChange={handleBillingChange}
                    type="text"
                    placeholder="Apartment, suite, etc."
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
                    Phone Number
                  </label>
                  <PhoneInput
                    country="gb"
                    value={billingAddress.phone}
                    onChange={(phone) =>
                      setBillingAddress((prev) => ({ ...prev, phone }))
                    }
                    containerStyle={{ width: "100%" }}
                    inputStyle={{
                      width: "100%",
                      border: "1px solid #d1d5db",
                      padding: "1.4rem 3rem",
                      fontSize: "0.875rem",
                      borderRadius: "0",
                    }}
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
                    Postal Code
                  </label>
                  <input
                    name="postalCode"
                    value={billingAddress.postalCode}
                    onChange={handleBillingChange}
                    type="text"
                    placeholder="Postal code"
                    maxLength={12}
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="border-t border-gray-200 pt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full border border-gray-900 bg-gray-900 py-4 text-sm uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateGuestAddressModal;
