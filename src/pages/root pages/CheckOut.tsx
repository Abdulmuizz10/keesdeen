// src/types/Order.ts
export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface CheckoutOrder {
  items: OrderItem[];
  totalAmount: number;
  shippingCost: number;
  tax: number;
}

import { Button } from "@relume_io/relume-ui";
// src/components/Checkout.tsx
import React, { useState } from "react";

const Checkout: React.FC = () => {
  const sampleOrder: CheckoutOrder = {
    items: [
      {
        id: 1,
        name: "Slim Fit T-shirt",
        price: 25.0,
        quantity: 2,
        imageUrl: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      },
      {
        id: 2,
        name: "Casual Denim Jeans",
        price: 45.0,
        quantity: 1,
        imageUrl: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      },
    ],
    totalAmount: 95.0,
    shippingCost: 10.0,
    tax: 5.5,
  };
  const [order] = useState<CheckoutOrder>(sampleOrder);

  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-10">
      <div className="container">
        <div className="rb-12 mb-12 md:mb-5">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
            Shipping Details
          </h2>
          <p className="md:text-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Section: Shipping Details */}
          <div className="lg:col-span-2">
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-3 border rounded-lg text-gray-700 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-3 border rounded-lg text-gray-700 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  className="block w-full px-4 py-3 border rounded-lg text-gray-700 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 ease-in-out"
                  placeholder="1234 Main St"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-3 border rounded-lg text-gray-700 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    placeholder="Los Angeles"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    State/Province
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-3 border rounded-lg text-gray-700 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    placeholder="CA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-3 border rounded-lg text-gray-700 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    placeholder="90001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-3 border rounded-lg text-gray-700 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    placeholder="United States"
                  />
                </div>
              </div>

              <Button className="w-full rounded-md">Continue to Payment</Button>
            </form>
          </div>

          {/* Right Section: Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">
              Order Summary
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-gray-800 font-medium">{item.name}</p>
                      <p className="text-gray-500 text-sm">
                        Qty: {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="border-t border-gray-300 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <p>Subtotal</p>
                  <p>${order.totalAmount.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-gray-600">
                  <p>Shipping</p>
                  <p>${order.shippingCost.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-800">
                  <p>Total</p>
                  <p>
                    $
                    {(
                      order.totalAmount +
                      order.shippingCost +
                      order.tax
                    ).toFixed(2)}
                  </p>
                </div>
              </div>

              <Button className="w-full rounded-md">Place order</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
