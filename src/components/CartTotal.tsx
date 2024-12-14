import React from "react";
import { useShop } from "../context/ShopContext";
import { formatAmount } from "../lib/utils";

const CartTotal: React.FC = () => {
  const { getCartAmount } = useShop();
  return (
    <div className="w-full">
      <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6  bricolage-grotesque">
        Cart Subtotal:
      </h2>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal:</p>
          <p>{formatAmount(getCartAmount())}</p>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default CartTotal;
