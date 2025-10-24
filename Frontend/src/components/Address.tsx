import React, { useState } from "react";
import { Country, State } from "country-state-city";
import { Plus } from "lucide-react";
import { useShop } from "../context/ShopContext";
import CreateAddressModal from "./CreateAddressModal";

interface AddressProps {
  setAddress: (address: any) => void;
}

const Address: React.FC<AddressProps> = ({ setAddress }) => {
  const { savedAddresses } = useShop();
  const [showAll, setShowAll] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const displayedItems = showAll ? savedAddresses : savedAddresses.slice(0, 2);

  const handleSelectAddress = (index: number, address: any) => {
    setSelectedAddress(index);
    setAddress(address); // Pass selected address up
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg md:text-2xl font-semibold text-gray-900 bricolage-grotesque mb-3">
          Delivery Address
        </h3>
        <p className="text-gray-500 text-sm md:text-base">
          Select or create a new address.
        </p>
      </div>

      {/* Address List */}
      <div className="space-y-3">
        {savedAddresses.length === 0 ? (
          <p className="text-center text-base sm:text-lg">
            No address available. Please create a new address.
          </p>
        ) : (
          <>
            {displayedItems.map((item: any, index: number) => {
              const address = item;
              const delivery = item.deliveryAddress;
              const countryName =
                Country.getCountryByCode(delivery.country)?.name ||
                delivery.country;
              const stateName =
                State.getStateByCodeAndCountry(delivery.state, delivery.country)
                  ?.name || delivery.state;

              return (
                <div
                  key={index}
                  onClick={() => handleSelectAddress(index, address)}
                  className={`cursor-pointer border rounded-xl p-3 sm:p-4 transition-all duration-300 ${
                    selectedAddress === index
                      ? "border-black shadow-md bg-gray-100"
                      : "border-border-secondary hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base md:text-lg font-semibold text-gray-900">
                        {delivery.firstName} {delivery.lastName}
                      </h4>
                      <p className="text-gray-600 text-sm md:text-base">
                        {delivery.address1}
                        {delivery.address2 && `, ${delivery.address2}`},{" "}
                        {stateName}, {countryName}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Phone: +{delivery.phone}
                      </p>
                    </div>

                    {/* Selected Indicator */}
                    {selectedAddress === index ? (
                      <span className="w-5 h-5 rounded-full bg-black border border-black flex items-center justify-center mt-1">
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
            {savedAddresses.length > 2 && (
              <div className="text-center mt-5">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-sm md:text-base font-medium text-gray-800 underline hover:text-black transition poppins"
                >
                  {showAll
                    ? "Show less"
                    : `Show ${savedAddresses.length - 2} more item${
                        savedAddresses.length - 2 > 1 ? "s" : ""
                      }`}
                </button>
              </div>
            )}
          </>
        )}

        {/* Add Address Button */}
        <button
          className="w-full mt-5 border border-dashed border-gray-400 rounded-xl py-3 flex items-center justify-center gap-2 text-gray-700 hover:text-black hover:border-black transition"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-medium">Add a new address</span>
        </button>
      </div>

      {showModal && <CreateAddressModal setShowModal={setShowModal} />}
    </div>
  );
};

export default Address;
