// import React from "react";
// import { useShop } from "../context/ShopContext";

const CurrencySwitcher = ({ color }: { color: string }) => {
  // const { setCurrency } = useShop();
  // const currencies = ["GBP", "USD", "EUR", "AUD"];

  // const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selectedCurrency = e.target.value;
  //   setCurrency(selectedCurrency);
  // };

  return (
    <div className="currency-switcher flex items-center space-x-2 poppins">
      <label
        htmlFor="currency"
        className={`text-sm ${color === "black" ? "flex" : "hidden"}`}
      >
        Currency:
      </label>
      {/* <select
        id="currency"
        className={`p-1 px-2 rounded-md outline-none cursor-pointer ${
          color === "black"
            ? "bg-brand-neutral text-text-light border border-gray-300"
            : "bg-white"
        }`}
        onChange={handleCurrencyChange}
      >
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select> */}
    </div>
  );
};

export default CurrencySwitcher;
