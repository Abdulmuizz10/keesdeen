import React, { useEffect, useState } from "react";
import { Country, State } from "country-state-city";
import { Plus } from "lucide-react";
import CreateAddressModal from "./CreateAddressModal";
import Axios from "axios";
import { URL } from "../lib/constants";
import { toast } from "sonner";

interface AddressProps {
  setAddress: (address: any) => void;
}

const Address: React.FC<AddressProps> = ({ setAddress }) => {
  const [savedAddress, setSavedAddress] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const getAddress = async () => {
      setLoading(true);
      try {
        const response = await Axios.get(`${URL}/address/get-address`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setSavedAddress(response.data);
        }
      } catch (error) {
        toast.error("Network error, unable to get address!");
      } finally {
        setLoading(false);
      }
    };
    getAddress();
  }, []);

  useEffect(() => {
    if (savedAddress.length === 1 && !selectedAddress) {
      const onlyAddress = savedAddress[0];
      setSelectedAddress(onlyAddress._id);
      setAddress(onlyAddress);
    }
  }, [savedAddress, selectedAddress, setAddress]);

  useEffect(() => {
    if (savedAddress.length === 1) {
      const interval = setInterval(() => {
        setToggle((prev) => !prev);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [savedAddress.length]);

  const displayedItems = showAll ? savedAddress : savedAddress.slice(0, 2);

  const handleSelectAddress = (id: any, address: any) => {
    setSelectedAddress(id);
    setAddress(address);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg md:text-2xl font-semibold text-gray-900 bricolage-grotesque mb-3">
          <span>Shipping Address</span>
        </h3>
        <p className="text-sm sm:text-base text-gray-500">
          Select or create a new address.
        </p>
      </div>

      {/* Address List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse border-b border-gray-100 pb-6"
            >
              <div className="mb-2 h-4 w-1/4 bg-gray-200" />
              <div className="mb-2 h-3 w-1/2 bg-gray-200" />
              <div className="h-3 w-1/6 bg-gray-200" />
            </div>
          ))
        ) : displayedItems.length > 0 ? (
          <>
            {displayedItems.map((item: any, index: number) => {
              const address = item;
              const shipping = item.shippingAddress;
              const countryName =
                Country.getCountryByCode(shipping.country)?.name ||
                shipping.country;
              const stateName =
                State.getStateByCodeAndCountry(shipping.state, shipping.country)
                  ?.name || shipping.state;

              return (
                <div
                  key={index}
                  onClick={() => handleSelectAddress(address._id, address)}
                  className={`cursor-pointer border p-3 sm:p-4 transition-all duration-300 ${
                    selectedAddress === address._id
                      ? "border-black shadow-md bg-gray-100"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm md:text-base font-semibold text-text-primary">
                        <span>
                          {shipping.firstName} {shipping.lastName}
                        </span>
                      </h4>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1">
                        {shipping.address1}
                        {shipping.address2 && `, ${shipping.address2}`},{" "}
                        {stateName}, {countryName}
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1">
                        +{shipping.phone}
                      </p>
                    </div>

                    {/* Selected Indicator */}
                    {selectedAddress === address._id ? (
                      <span className="w-5 h-5 bg-black border-2 border-black flex items-center justify-center mt-1">
                        <span className="w-2 h-2 bg-white" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 border border-gray-300 mt-1" />
                    )}
                  </div>
                </div>
              );
            })}

            {savedAddress.length > 2 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full border-b border-gray-300 pb-1 pt-2 text-sm uppercase tracking-widest text-gray-500 transition-colors hover:border-gray-900 hover:text-gray-900"
              >
                {showAll ? "Show Less" : `Show ${savedAddress.length - 2} More`}
              </button>
            )}
          </>
        ) : (
          <p className="py-8 text-center text-sm uppercase tracking-widest text-gray-400">
            No saved addresses
          </p>
        )}

        {/* Add Address Button */}
        <button
          onClick={() => setShowModal(true)}
          className="group flex w-full items-center justify-center gap-2 border border-gray-300 py-4 transition-colors hover:border-gray-900 hover:bg-gray-50"
        >
          <Plus
            size={18}
            strokeWidth={1.5}
            className="text-gray-600 group-hover:text-gray-900"
          />
          <span className="text-sm uppercase tracking-widest text-gray-600 group-hover:text-gray-900">
            <p className="text-xs text-gray-500">
              {savedAddress.length === 1 &&
                (toggle
                  ? "Click to create a new address."
                  : "address selected automatically.")}
              {savedAddress.length > 1 && "Select or create a new address."}
            </p>
          </span>
        </button>
      </div>

      {showModal && (
        <CreateAddressModal
          setShowModal={setShowModal}
          savedAddress={savedAddress}
          setSavedAddress={setSavedAddress}
          handleSelectAddress={handleSelectAddress}
        />
      )}
    </div>
  );
};

export default Address;
