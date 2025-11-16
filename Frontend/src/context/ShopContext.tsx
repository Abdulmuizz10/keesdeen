import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { toast } from "sonner";

// Define the context type
interface ShopContextType {
  cartItems: any;
  setCartItems: any;
  addToCart: any;
  getCartCount: any;
  updateQuantity: any;
  getCartAmount: any;
  getCartDetailsForOrder: any;
  wishLists: any;
  setWishLists: any;
  manageWishLists: any;
  savedAddress: any;
  setSavedAddress: any;
  // currentCurrency: any;
  // fetchExchangeRates: any;
  // setCurrency: any;
  // formatAmount: any;
  // getRawAmount: any;
  isActive: any;
  setIsActive: any;
  adminLoader: any;
  setAdminLoader: any;
  shippingFee: any;
  setShippingFee: any;
  discountPercent: any;
  setDiscountPercent: any;
  change: any;
  setChange: any;
}

// Create the ShopContext with an empty default value
const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Create the ShopProvider component to wrap around the app
export const ShopContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [adminLoader, setAdminLoader] = useState(false);
  const [cartItems, setCartItems] = useState<any>(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : {};
  });
  const [wishLists, setWishLists] = useState(() => {
    const storedWishLists = localStorage.getItem("wishLists");
    return storedWishLists ? JSON.parse(storedWishLists) : [];
  });
  const [savedAddress, setSavedAddress] = useState<any>([]);
  const [shippingFee, setShippingFee] = useState<any>(0);
  const [discountPercent, setDiscountPercent] = useState<any>(0);
  const [change, setChange] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wishLists", JSON.stringify(wishLists));
  }, [wishLists]);

  const addToCart = async (
    itemId: string,
    size: string,
    color: string,
    name: string,
    price: number,
    image: string
  ) => {
    if (!size || !color) {
      toast.error("Select Product Size and Color");
      return;
    }

    // Clone the cartItems to avoid mutating state directly
    let cartData = structuredClone(cartItems || {});

    // Check if the cart already has this itemId
    if (!cartData[itemId]) {
      cartData[itemId] = {
        name,
        price,
        image,
        variants: {}, // Stores sizes and colors
      };
    }

    // Check if the specific size-color combination exists
    const variantKey = `${size}-${color}`;
    if (cartData[itemId].variants[variantKey]) {
      cartData[itemId].variants[variantKey] += 1;
    } else {
      cartData[itemId].variants[variantKey] = 1;
    }

    // Update the state with the new cart data
    setCartItems(cartData);
  };

  const updateQuantity = async (
    itemId: string,
    size: string,
    color: string,
    quantity: number
  ) => {
    let cartData = structuredClone(cartItems || {});
    const variantKey = `${size}-${color}`;

    if (quantity > 0) {
      cartData[itemId].variants[variantKey] = quantity;
    } else {
      delete cartData[itemId].variants[variantKey]; // Remove variant if quantity is 0
      if (Object.keys(cartData[itemId].variants).length === 0) {
        delete cartData[itemId]; // Remove item if no variants left
      }
    }

    setCartItems(cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;

    for (const itemId in cartItems) {
      for (const variant in cartItems[itemId].variants) {
        try {
          const quantity = cartItems[itemId].variants[variant];
          if (quantity > 0) {
            totalCount += quantity;
          }
        } catch (error) {
          toast.error(`${error}`);
        }
      }
    }

    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;

    for (const itemId in cartItems) {
      const item = cartItems[itemId];
      for (const variant in item.variants) {
        try {
          const quantity = item.variants[variant];
          if (quantity > 0) {
            totalAmount += item.price * quantity;
          }
        } catch (error) {
          // console.log(error);
        }
      }
    }

    return totalAmount;
  };

  const getCartDetailsForOrder = () => {
    const cartDetailsArray = [];

    for (const itemId in cartItems) {
      const item = cartItems[itemId];
      for (const variant in item.variants) {
        const quantity = item.variants[variant];
        const [size, color] = variant.split("-");

        if (quantity > 0) {
          cartDetailsArray.push({
            name: item.name,
            qty: quantity,
            image: item.image,
            price: item.price,
            product: itemId, // Reference to the product ID
            size,
            color,
          });
        }
      }
    }

    return cartDetailsArray;
  };

  const manageWishLists = (product: any) => {
    setWishLists((prevWishLists: any) => {
      if (prevWishLists.find((wish: any) => wish._id === product._id)) {
        // Remove the product if it's already in the wishlist
        return prevWishLists.filter((wish: any) => wish._id !== product._id);
      } else {
        // Add the product if it's not in the wishlist
        return [...prevWishLists, product];
      }
    });
  };

  // const [currentCurrency, setCurrentCurrency] = useState("GBP"); // Default currency
  // const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(
  //   {}
  // ); // State for exchange rates

  // useEffect(() => {
  //   fetchExchangeRates(); // Fetch exchange rates when the component mounts
  // }, []);

  // const setCurrency = (currency: string) => {
  //   setCurrentCurrency(currency);
  // };

  // const fetchExchangeRates = async (baseCurrency: string = "GBP") => {
  //   try {
  //     const response = await fetch(
  //       `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
  //     );
  //     const data = await response.json();
  //     setExchangeRates(data.rates); // Update state with fetched rates
  //   } catch (error) {
  //     // toast.error("Error fetching exchange rates");
  //   }
  // };

  // const formatAmount = (amount: number) => {
  //   const rate = exchangeRates[currentCurrency] || 1; // Fallback to 1 if rate is unavailable
  //   const convertedAmount = amount * rate;

  //   const formatter = new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: currentCurrency,
  //     minimumFractionDigits: 2,
  //   });
  //   return formatter.format(convertedAmount);
  // };

  // const getRawAmount = (amount: number): number => {
  //   const rate = exchangeRates[currentCurrency] || 1;
  //   return amount * rate;
  // };

  return (
    <ShopContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        getCartDetailsForOrder,
        wishLists,
        setWishLists,
        manageWishLists,
        savedAddress,
        setSavedAddress,
        // currentCurrency,
        // fetchExchangeRates,
        // setCurrency,
        // formatAmount,
        // getRawAmount,
        isActive,
        setIsActive,
        adminLoader,
        setAdminLoader,
        shippingFee,
        setShippingFee,
        discountPercent,
        setDiscountPercent,
        change,
        setChange,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};

{
  /* old cart codes */
}
