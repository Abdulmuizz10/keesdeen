import React from "react";
import { useShop } from "../context/ShopContext";
import { formatAmountDefault } from "../lib/utils";
import { currency } from "../lib/constants";

const CartTotal: React.FC = () => {
  const { getCartAmount } = useShop();
  return (
    <div className="w-full">
      <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 bricolage-grotesque text-gradient">
        Cart Subtotal:
      </h2>

      <div className="flex flex-col gap-2 mt-2 text-md">
        <div className="flex justify-between">
          <p>Subtotal:</p>
          <p>{formatAmountDefault(currency, getCartAmount())}</p>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default CartTotal;
