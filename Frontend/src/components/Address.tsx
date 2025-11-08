import React, { useEffect, useState } from "react";
import { Country, State } from "country-state-city";
import { Plus } from "lucide-react";
import CreateAddressModal from "./CreateAddressModal";
import Axios from "axios";
import { URL } from "../lib/constants";
import { toast } from "sonner";
import { useShop } from "../context/ShopContext";

interface AddressProps {
  setAddress: (address: any) => void;
}

const Address: React.FC<AddressProps> = ({ setAddress }) => {
  const { savedAddress, setSavedAddress } = useShop();
  const [loading, setLoading] = useState<boolean>(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

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

  const displayedItems = showAll ? savedAddress : savedAddress.slice(0, 2);

  const handleSelectAddress = (id: any, address: any) => {
    setSelectedAddress(id);
    setAddress(address); // Pass selected address up
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg md:text-2xl font-semibold text-gray-900 bricolage-grotesque mb-3">
          <span>Shipping Address</span>
        </h3>
        <p className="text-gray-500 text-sm md:text-base">
          Select or create a new address.
        </p>
      </div>

      {/* Address List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="cursor-pointer border border-border-secondary hover:border-gray-300 rounded-xl p-3 sm:p-4 transition-all duration-300"
            >
              <div className="flex flex-col gap-1">
                <div className="h-6 bg-gray-200 animate-pulse" />
                <div className="h-6 bg-gray-200 animate-pulse" />
                <div className="h-6 bg-gray-200 animate-pulse" />
              </div>
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
                  className={`cursor-pointer border rounded-xl p-3 sm:p-4 transition-all duration-300 ${
                    selectedAddress === address._id
                      ? "border-black shadow-md bg-gray-100"
                      : "border-border-secondary hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base md:text-lg font-semibold text-text-primary">
                        <span>
                          {shipping.firstName} {shipping.lastName}
                        </span>
                      </h4>
                      <p className="text-gray-600 text-sm md:text-base">
                        {shipping.address1}
                        {shipping.address2 && `, ${shipping.address2}`},{" "}
                        {stateName}, {countryName}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Phone: +{shipping.phone}
                      </p>
                    </div>

                    {/* Selected Indicator */}
                    {selectedAddress === address._id ? (
                      <span className="w-5 h-5 rounded-full bg-black border-2 border-black flex items-center justify-center mt-1">
                        <span className="w-2 h-2 bg-white rounded-full" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-gray-300 mt-1" />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Show More / Less Button */}
            {savedAddress.length > 2 && (
              <div className="text-center mt-5">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-sm md:text-base font-medium text-gray-800 underline hover:text-black transition poppins"
                >
                  {showAll
                    ? "Show less"
                    : `Show ${savedAddress.length - 2} more item${
                        savedAddress.length - 2 > 1 ? "s" : ""
                      }`}
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-base sm:text-lg">
            No address available. Please create a new address.
          </p>
        )}

        {/* Add Address Button */}
        <button
          className="w-full mt-5 border border-dashed border-gray-400 rounded py-3 flex items-center justify-center gap-2 text-gray-700 hover:text-black hover:border-black transition"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-medium">Add a new address</span>
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
