import React from "react";
import { useShop } from "../context/ShopContext";
import { formatAmount } from "../lib/utils";

const CartTotal: React.FC = () => {
  const { getCartAmount } = useShop();
  const delivery_fee = 100;
  return (
    <div className="w-full">
      <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
        Cart ToTal:
      </h2>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal:</p>
          <p>{formatAmount(getCartAmount())}</p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Shipping Fee:</p>
          <p>${delivery_fee}</p>
        </div>
        <hr />
        <div className="flex justify-between">
          <b>Total:</b>
          <b>
            {formatAmount(
              getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee
            )}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
