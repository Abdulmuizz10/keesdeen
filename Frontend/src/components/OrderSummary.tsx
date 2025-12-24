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

  // const subtotal = summaryData.reduce(
  //   (acc, item) => acc + item.price * item.quantity,
  //   0
  // );

  // const shipping = subtotal > 0 ? 0 : 0;
  // const tax = 0;
  // const total = subtotal + shipping + tax;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5 border-b border-gray-200 pb-5">
        <h3 className="text-lg md:text-2xl font-semibold text-gray-900 bricolage-grotesque mb-3">
          <span>Order Summary</span>
        </h3>
        <p className="text-sm sm:text-base text-gray-500 ">
          Review your order before checkout
        </p>
      </div>

      {/* Order Items */}
      <div className="space-y-6">
        {summaryData.length === 0 ? (
          <p className="py-8 text-center text-sm uppercase tracking-widest text-gray-400">
            No items to display
          </p>
        ) : (
          <>
            {displayedItems.map((item, index) => (
              <div
                key={index}
                className="flex gap-6 border-b border-gray-100 pb-6 last:border-0"
              >
                {/* Image */}
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden bg-gray-50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="mb-1 font-light tracking-tight">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.size} / {item.color}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-sm font-light tracking-wider">
                    {formatAmountDefault(currency, item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}

            {/* Show More / Less */}
            {summaryData.length > 2 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full border-b border-gray-300 pb-1 pt-2 text-sm uppercase tracking-widest text-gray-500 transition-colors hover:border-gray-900 hover:text-gray-900"
              >
                {showAll ? "Show Less" : `Show ${summaryData.length - 2} More`}
              </button>
            )}
          </>
        )}
      </div>

      {/* Summary Totals */}
      {/* {summaryData.length > 0 && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-light">
                {formatAmountDefault(currency, subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-light">
                {shipping === 0
                  ? "Free"
                  : formatAmountDefault(currency, shipping)}
              </span>
            </div>
            {tax > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-light">
                  {formatAmountDefault(currency, tax)}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-3 font-light">
              <span>Total</span>
              <span className="text-base">
                {formatAmountDefault(currency, total)}
              </span>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default OrderSummary;
