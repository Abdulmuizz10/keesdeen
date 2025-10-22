import React, { useEffect, useState } from "react";
import { useShop } from "../context/ShopContext";
import { formatAmountDefault } from "../lib/utils";
import { currency } from "../lib/constants";

const OrderSummary: React.FC = () => {
  const { cartItems } = useShop();
  const [summaryData, setSummaryData] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const data: any[] = [];
    for (const itemId in cartItems) {
      const item = cartItems[itemId];
      for (const variantKey in item.variants) {
        const quantity = item.variants[variantKey];
        if (quantity > 0) {
          const [size, color] = variantKey.split("-");
          data.push({
            id: itemId,
            name: item.name,
            price: item.price,
            image: item.image,
            size,
            color,
            quantity,
          });
        }
      }
    }
    setSummaryData(data);
  }, [cartItems]);

  const displayedItems = showAll ? summaryData : summaryData.slice(0, 2);

  const subtotal = summaryData.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 0 : 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg md:text-2xl font-semibold text-gray-900 bricolage-grotesque mb-3">
          Order Summary
        </h3>
        <p className="text-gray-500 text-sm md:text-base">
          Review your order before completing checkout.
        </p>
      </div>

      {/* Order Items */}
      <div className="space-y-6 pt-5">
        {summaryData.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No items to display.
          </p>
        ) : (
          <>
            {displayedItems.map((item, index) => (
              <div
                key={index}
                className="flex items-start justify-between gap-5 border-b border-border-secondary pb-3.5 sm:pb-5"
              >
                {/* Left: Image */}
                <div className="flex items-center gap-5 flex-1">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm"
                  />

                  {/* Details */}
                  <div className="flex flex-col space-y-1">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 bricolage-grotesque">
                      {item.name}
                    </h3>

                    <p className="text-gray-500 text-sm md:text-base">
                      Size:{" "}
                      <span className="text-gray-800 font-medium">
                        {item.size}
                      </span>{" "}
                      | Color:{" "}
                      <span className="text-gray-800 font-medium">
                        {item.color}
                      </span>
                    </p>

                    <p className="text-gray-500 text-sm md:text-base">
                      Quantity:{" "}
                      <span className="text-gray-800 font-medium">
                        {item.quantity}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Right: Price */}
                <div className="">
                  <span className="text-base md:text-xl font-semibold text-gray-900">
                    {formatAmountDefault(currency, item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}

            {/* Show More / Less Button */}
            {summaryData.length > 2 && (
              <div className="text-center mt-5">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-sm md:text-base font-medium text-gray-800 underline hover:text-black transition poppins"
                >
                  {showAll
                    ? "Show less"
                    : `Show ${summaryData.length - 2} more item${
                        summaryData.length - 2 > 1 ? "s" : ""
                      }`}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Summary totals */}
      {summaryData.length > 0 && (
        <div className="mt-5 border border-border-secondary rounded shadow-lg p-6 md:p-8 bg-white space-y-4">
          <h3 className="text-2xl font-semibold text-gray-900 bricolage-grotesque">
            Order Details
          </h3>

          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between text-sm md:text-base">
              <span>Subtotal</span>
              <span className="text-gray-800 font-medium">
                {formatAmountDefault(currency, subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm md:text-base">
              <span>Shipping</span>
              <span className="text-gray-800 font-medium">
                {shipping > 0
                  ? formatAmountDefault(currency, shipping)
                  : "Free"}
              </span>
            </div>
            <div className="flex justify-between text-sm md:text-base">
              <span>Estimated Tax</span>
              <span className="text-gray-800 font-medium">
                {formatAmountDefault(currency, tax)}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 my-4" />

          <div className="flex justify-between items-center text-lg md:text-xl font-semibold text-gray-900">
            <span>Total</span>
            <span className="text-gray-800 font-medium">
              {formatAmountDefault(currency, total)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
