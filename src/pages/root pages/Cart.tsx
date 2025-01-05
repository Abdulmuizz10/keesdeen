import React, { useContext, useEffect, useState } from "react";
import { useShop } from "../../context/ShopContext";
import { RiDeleteBin5Line } from "react-icons/ri";
import CartTotal from "../../components/CartTotal";
import { Button } from "@relume_io/relume-ui";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { Link } from "react-router-dom";

const Cart: React.FC = () => {
  const { cartItems, updateQuantity, guestEmail, formatAmount } = useShop();
  const [cartData, setCartData] = useState<any[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const tempData: any[] = [];
    for (const itemId in cartItems) {
      const item = cartItems[itemId];
      for (const variantKey in item.variants) {
        const quantity = item.variants[variantKey];
        if (quantity > 0) {
          const [size, color] = variantKey.split("-"); // Assuming size and color are separated by "-"
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
                  <div className="flex items-center gap-2 sm:gap-3 mt-1 text-sm">
                    <p className="text-base md:text-lg">
                      {formatAmount(item.price)}
                    </p>
                    <p className="h-[30px] w-[30px] md:h-[40px] md:w-[42px] bg-gray-100 font-medium flex items-center justify-center cursor-pointer text-text-primary border">
                      {item.size}
                    </p>
                    <p className="h-[30px] md:h-[40px] px-3 bg-gray-100 font-medium hidden sm:flex items-center justify-center cursor-pointer text-text-primary border">
                      {item.color}
                    </p>
                  </div>
                </div>
              </div>
              <input
                className="border border-border-secondary bg-background-primary max-w-[90px] sm:max-w-[100px] px-1 py-[5px] sm:px-2 sm:py-1  text-text-primary rounded-md"
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(
                    item.id,
                    item.size,
                    item.color,
                    Number(e.target.value)
                  )
                }
              />
              <RiDeleteBin5Line
                className="text-text-primary h-[45px] w-[25px] cursor-pointer"
                onClick={() =>
                  updateQuantity(item.id, item.size, item.color, 0)
                }
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end my-20">
          <div className="w-full md:w-1/2 border p-5 rounded-md border-border-secondary shadow-xxlarge">
            <CartTotal />
            <div className="w-full text-end mt-5">
              {!user && !guestEmail ? (
                <Link to="/auth/guest-signUp">
                  <Button className="w-full rounded-md active:bg-gray-700 bg-brand-neutral border-none text-text-light">
                    PROCEED TO CHECKOUT
                  </Button>
                </Link>
              ) : (
                <Link to="/check_out">
                  <Button className="w-full rounded-md active:bg-gray-700 bg-brand-neutral border-none text-text-light">
                    PROCEED TO CHECKOUT
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
