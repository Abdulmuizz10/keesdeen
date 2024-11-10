import React, { useEffect, useState } from "react";
import { useShop } from "../../context/ShopContext";
import { formatAmount } from "../../lib/utils";
import { RiDeleteBin5Line } from "react-icons/ri";
import CartTotal from "../../components/CartTotal";
import { Button } from "@relume_io/relume-ui";
import { useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
  const { cartItems, updateQuantity } = useShop();
  const [cartData, setCartData] = useState<any[]>([]);

  useEffect(() => {
    // Convert cartItems object structure into an array for easier rendering
    const tempData: any[] = [];
    for (const itemId in cartItems) {
      const item = cartItems[itemId];
      for (const size in item.sizes) {
        const quantity = item.sizes[size];
        if (quantity > 0) {
          tempData.push({
            id: itemId,
            name: item.name,
            price: item.price,
            image: item.image,
            size,
            quantity,
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  const navigate = useNavigate();

  return (
    <section id="relume" className="px-[5%] py-24 md:py-30">
      <div className="container">
        <div className="rb-12 mb-12 md:mb-5">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
            Cart
          </h2>
        </div>

        <div className="border-t border-border-secondary">
          {cartData.length === 0 && (
            <p className="mt-4 text-3xl text-text-secondary">
              Your cart is empty.
            </p>
          )}
          {cartData.map((item, index) => (
            <div
              key={index}
              className="py-4 border-b border-border-secondary text-text-secondary grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20 rounded-sm"
                  src={item.image}
                  alt="cart image"
                />
                <div className="flex flex-col gap-2">
                  <p className="text-xs sm:text-lg font-medium text-text-primary bricolage-grotesque">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 sm:gap-5 mt-1">
                    <p>{formatAmount(item.price)}</p>
                    <p className="-2 h-[30px] w-[30px] md:h-[42px] md:w-[42px] bg-gray-300 flex items-center justify-center cursor-pointer text-text-primary rounded-sm">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>
              <input
                className="border border-border-secondary bg-background-primary max-w-[40px] sm:max-w-[80px] px-1 sm:px-2 sm:py-1 py-[2px] text-text-primary rounded-md"
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.id, item.size, Number(e.target.value))
                }
              />
              <RiDeleteBin5Line
                className="text-text-primary h-[45px] w-[25px] cursor-pointer"
                onClick={() => updateQuantity(item.id, item.size, 0)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end my-20">
          <div className="w-full sm:w-[450px] border p-5 rounded-md border-border-secondary shadow-xxlarge">
            <CartTotal />
            <div className="w-full text-end mt-5">
              <Button
                className="w-full rounded-md active:bg-gray-700 bg-brand-neutral border-none text-text-light"
                onClick={() => navigate("/check_out")}
              >
                PROCEED TO CHECKOUT
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
