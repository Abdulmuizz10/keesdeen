import { useEffect, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAmountDefault(currency: any, amount: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
}

// let exchangeRates: Record<string, number> = {}; // To store fetched rates
// export let currentCurrency = "GBP"; // Default currency

// export async function fetchExchangeRates(baseCurrency: string = "USD") {
//   try {
//     const response = await fetch(
//       `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
//     );
//     const data = await response.json();
//     exchangeRates = data.rates;
//   } catch (error) {
//     // console.error("Error fetching exchange rates:", error);
//   }
// }

// export function setCurrency(currency: string) {
//   currentCurrency = currency;
// }

// export function formatAmount(amount: number): string {
//   const rate = exchangeRates[currentCurrency] || 1; // Fallback to 1 if rate is unavailable
//   const convertedAmount = amount * rate;

//   const formatter = new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: currentCurrency,
//     minimumFractionDigits: 2,
//   });
//   return formatter.format(convertedAmount);
// }

export const useInView = (ref: React.RefObject<HTMLElement>) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            setIsInView(false);
          }
        });
      },
      { threshold: 0.1 } // Adjust this threshold as needed
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return isInView;
};
