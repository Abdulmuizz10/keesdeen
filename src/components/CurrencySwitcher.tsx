import React from "react";
import { useShop } from "../context/ShopContext";

const CurrencySwitcher = ({ color }: { color: string }) => {
  const { setCurrency } = useShop();
  const currencies = [
    "GBP",
    "USD",
    "EUR",
    "JPY",
    "AUD",
    "CHF",
    "SEK",
    "NOK",
    "DKK",
    "RUB",
    "PLN",
    "CZK",
    "HUF",
  ];

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = e.target.value;
    setCurrency(selectedCurrency);
  };

  return (
    <div className="currency-switcher flex items-center space-x-2">
      <label
        htmlFor="currency"
        className={`text-sm ${color === "black" ? "flex" : "hidden"}`}
      >
        Currency:
      </label>
      <select
        id="currency"
        className={`p-2 rounded-md outline-none poppins ${
          color === "black"
            ? "bg-brand-neutral text-text-light border border-gray-300"
            : "bg-white"
        }`}
        onChange={handleCurrencyChange}
      >
        {currencies.map((currency) => (
          <option key={currency} value={currency} className="poppins">
            {currency}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySwitcher;