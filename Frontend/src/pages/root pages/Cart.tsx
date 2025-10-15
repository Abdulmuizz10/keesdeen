import React, { useContext, useEffect, useState } from "react";
import { useShop } from "../../context/ShopContext";
import { Minus, Plus, Trash2 } from "lucide-react";
import CartTotal from "../../components/CartTotal";
import { Button } from "@relume_io/relume-ui";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { Link } from "react-router-dom";
import { formatAmountDefault } from "../../lib/utils";
import { currency } from "../../lib/constants";

const Cart: React.FC = () => {
  const { cartItems, updateQuantity, guestEmail } = useShop();
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

  // handle increment and decrement
  const handleIncrease = (item: any) => {
    updateQuantity(item.id, item.size, item.color, item.quantity + 1);
  };

  const handleDecrease = (item: any) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.size, item.color, item.quantity - 1);
    } else {
      // remove item if quantity reaches zero
      updateQuantity(item.id, item.size, item.color, 0);
    }
  };

  return (
    <section className="px-[5%] py-24 md:py-30">
      <div className="container">
        <div className="mb-2 md:mb-5">
          <h2 className="mb-2 text-5xl font-bold md:mb-4 md:text-7xl lg:text-8xl bricolage-grotesque text-gradient">
            Cart
          </h2>
          <p className="md:text-md">Your cart.</p>
        </div>

        <div className="mt-4 border-t">
          {cartData.length === 0 ? (
            <p className="mt-4 text-base md:text-3xl text-text-secondary">
              Your cart is empty.
            </p>
          ) : (
            <div>
              {cartData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between py-3 my-2 border-b border-border-secondary gap-6 lg:gap-10"
                >
                  {/* Left section: image + details */}
                  <div className="flex items-center gap-3 lg:gap-8 flex-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-22 h-24 lg:w-32 lg:h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />

                    <div className="flex flex-col">
                      <h3 className="text-base md:text-xl lg:text-2xl font-semibold text-text-primary bricolage-grotesque">
                        {item.name}
                      </h3>

                      <p className="text-sm md:text-base text-text-secondary mt-1">
                        Size:{" "}
                        <span className="text-text-primary font-medium">
                          {item.size}
                        </span>{" "}
                        | Color:{" "}
                        <span className="text-text-primary font-medium">
                          {item.color}
                        </span>
                      </p>

                      <div className="flex items-center mt-4">
                        <button
                          className="border flex items-center justify-center border-gray-300 rounded-md w-8 h-8 md:w-9 md:h-9 lg:w-12 lg:h-12 text-xl font-bold text-text-primary hover:bg-gray-100 transition"
                          onClick={() => handleDecrease(item)}
                        >
                          <Minus className="w-[15px] h-[15px] sm:w-[20px] sm:h-[20px]" />
                        </button>

                        <span className="mx-3 sm:mx-4 text-base md:text-lg lg:text-xl font-semibold text-text-primary">
                          {item.quantity}
                        </span>

                        <button
                          className="border flex items-center justify-center border-gray-300 rounded-md w-8 h-8 md:w-9 md:h-9 lg:w-12 lg:h-12 text-xl font-bold text-text-primary hover:bg-gray-100 transition"
                          onClick={() => handleIncrease(item)}
                        >
                          <Plus className="w-[15px] h-[15px] sm:w-[20px] sm:h-[20px]" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right section: price + delete */}
                  <div className="flex flex-col items-end justify-between h-full">
                    <p className="text-base md:text-xl lg:text-2xl font-semibold text-text-primary">
                      {formatAmountDefault(
                        currency,
                        item.price * item.quantity
                      )}
                    </p>

                    <Trash2
                      width={24}
                      height={24}
                      className="mt-4 text-text-error cursor-pointer hover:text-red-700 transition"
                      onClick={() =>
                        updateQuantity(item.id, item.size, item.color, 0)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartData.length > 0 && (
          <div className="flex justify-end mt-20">
            <div className="w-full md:w-1/2 border p-5 rounded-md border-border-secondary shadow-xxlarge">
              <CartTotal />
              <div className="w-full text-end mt-5 poppins">
                {!user && !guestEmail ? (
                  <Link to="/auth/guest-signUp">
                    <Button className="w-full rounded-md active:bg-gray-700 bg-brand-neutral border-none text-text-light">
                      Proceed to checkout
                    </Button>
                  </Link>
                ) : (
                  <Link to="/check_out">
                    <Button className="w-full rounded-md active:bg-gray-700 bg-brand-neutral border-none text-text-light">
                      Proceed to checkout
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
