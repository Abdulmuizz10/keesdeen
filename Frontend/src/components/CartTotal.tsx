import React from "react";
import { useShop } from "../context/ShopContext";
import { formatAmountDefault } from "../lib/utils";
import { currency } from "../lib/constants";

const CartTotal: React.FC = () => {
  const { getCartAmount } = useShop();
  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 mt-2 text-md">
        <div className="flex justify-between">
          <p className="text-sm text-gray-500 tracking-wider">Subtotal:</p>
          <p className="text-text-primary">
            {formatAmountDefault(currency, getCartAmount())}
          </p>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default CartTotal;
