import React, { useContext, useEffect, useState } from "react";
import { useShop } from "../../context/ShopContext";
import { Minus, Plus, Trash2 } from "lucide-react";
import CartTotal from "../../components/CartTotal";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { Link } from "react-router-dom";
import { formatAmountDefault } from "../../lib/utils";
import { currency } from "../../lib/constants";

const Cart: React.FC = () => {
  const { cartItems, updateQuantity } = useShop();
  const [cartData, setCartData] = useState<any[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const tempData: any[] = [];
    for (const itemId in cartItems) {
      const item = cartItems[itemId];
      for (const variantKey in item.variants) {
        const quantity = item.variants[variantKey];
        if (quantity > 0) {
          const [size, color] = variantKey.split("-");
          tempData.push({
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
    setCartData(tempData);
  }, [cartItems]);

  const handleIncrease = (item: any) => {
    updateQuantity(item.id, item.size, item.color, item.quantity + 1);
  };

  const handleDecrease = (item: any) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.size, item.color, item.quantity - 1);
    } else {
      updateQuantity(item.id, item.size, item.color, 0);
    }
  };

  return (
    <section className="placing">
      {/* Header */}
      <div className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="mb-2 text-5xl font-bold md:mb-4 md:text-7xl lg:text-8xl">
          <span> Shopping Cart</span>
        </h1>
        <p className="text-sm text-text-secondary">
          {cartData.length} {cartData.length === 1 ? "item" : "items"}
        </p>
      </div>

      {cartData.length === 0 ? (
        /* Empty State */
        <div className="flex min-h-[40vh] flex-col items-center justify-center">
          <p className="mb-8 text-center text-sm uppercase tracking-widest text-gray-400">
            Your cart is empty
          </p>
          <Link
            to="/collections/shop_all"
            className="border-b border-gray-900 pb-1 text-sm uppercase tracking-widest transition-colors hover:border-gray-400 hover:text-gray-400"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        /* Grid Layout: Cart Items (3.5fr) | Cart Total (1.5fr) */
        <div className="grid gap-12 lg:grid-cols-[3.5fr_1.5fr]">
          {/* Cart Items - Left Side */}
          <div className="space-y-8">
            {cartData.map((item, index) => (
              <div
                key={index}
                className="group flex gap-4 sm:gap-6 border-b border-gray-100 pb-8 transition-opacity hover:opacity-70"
              >
                {/* Product Image */}
                <div className="h-full w-20 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden bg-gray-50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="sm:mb-2 font-light tracking-tight">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.size} / {item.color}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="sm:mt-4 flex items-center gap-4">
                    <div className="flex items-center border border-gray-300">
                      <button
                        className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-gray-100"
                        onClick={() => handleDecrease(item)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} strokeWidth={1.5} />
                      </button>

                      <span className="w-12 text-center text-sm">
                        {item.quantity}
                      </span>

                      <button
                        className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-gray-100"
                        onClick={() => handleIncrease(item)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} strokeWidth={1.5} />
                      </button>
                    </div>

                    <button
                      className="text-gray-400 transition-colors hover:text-red-600"
                      onClick={() =>
                        updateQuantity(item.id, item.size, item.color, 0)
                      }
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-sm font-light">
                    {formatAmountDefault(currency, item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Total - Right Side (Sticky) */}
          <div className="lg:sticky lg:top-26 xl:top-28 lg:h-fit">
            <div>
              <h2 className="mb-8 text-xs font-medium uppercase tracking-widest text-gray-500">
                Summary
              </h2>

              {/* Cart Total Component */}
              <div className="mb-8">
                <CartTotal />
              </div>

              {/* Checkout Button */}
              <Link to={user ? "/check_out" : "/auth/sign_up"}>
                <button className="w-full border border-gray-900 bg-gray-900 py-4 text-sm uppercase tracking-widest text-white transition-colors hover:bg-gray-800">
                  Proceed to Checkout
                </button>
              </Link>

              {/* Continue Shopping Link */}
              <Link
                to="/collections/shop_all"
                className="mt-6 block text-center text-sm uppercase tracking-widest text-gray-500 transition-colors hover:text-gray-900"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Cart;
