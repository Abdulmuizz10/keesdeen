import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useShop } from "../context/ShopContext";
import CreateAddressModal from "./CreateAddressModal";

const Address: React.FC = () => {
  const { savedAddresses } = useShop(); // Replace with actual context or props to get saved addresses
  const [showAll, setShowAll] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(
    savedAddresses.find((a: any) => a.isDefault)?.id || null
  );
  const [showModal, setShowModal] = useState(false);
  const displayedItems = showAll ? savedAddresses : savedAddresses.slice(0, 2);

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
      <div className="space-y-4 pt-5">
        {savedAddresses.length === 0 ? (
          <p className="text-center text-base sm:text-lg">
            No addresses available. Please add a new address.
          </p>
        ) : (
          <>
            {displayedItems.map((address: any) => (
              <div
                key={address.id}
                onClick={() => setSelectedAddress(address.id)}
                className={`cursor-pointer border rounded-2xl p-3 sm:p-4 transition-all duration-300 ${
                  selectedAddress === address.id
                    ? "border-black shadow-md bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base md:text-lg font-semibold text-gray-900">
                      {address.name}
                    </h4>
                    <p className="text-gray-600 text-sm md:text-base">
                      {address.street}, {address.city}, {address.state},{" "}
                      {address.country}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Phone: {address.phone}
                    </p>
                  </div>

                  {/* Selected Indicator */}
                  {selectedAddress === address.id ? (
                    <span className="w-5 h-5 rounded-full bg-black border border-black flex items-center justify-center mt-1">
                      <span className="w-2 h-2 bg-white rounded-full" />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border border-gray-300 mt-1" />
                  )}
                </div>
              </div>
            ))}

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
          className="w-full mt-5 border border-dashed border-gray-400 rounded-xl py-4 flex items-center justify-center gap-2 text-gray-700 hover:text-black hover:border-black transition"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm md:text-base font-medium">
            Add New Address
          </span>
        </button>
      </div>

      {showModal && <CreateAddressModal setShowModal={setShowModal} />}
    </div>
  );
};

export default Address;
