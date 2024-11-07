import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { toast } from "react-toastify";
import { getProducts } from "./ProductContext/ProductApiCalls";
import { useProducts } from "./ProductContext/ProductContext";
import { Product } from "../lib/types";

// Define the context type
interface ShopContextType {
  cartItems: any;
  setCartItems: any;
  addToCart: any;
  getCartCount: any;
  updateQuantity: any;
  getCartAmount: any;
  wishLists: any;
  setWishLists: any;
  manageWishLists: any;
  isActive: any;
  setIsActive: any;
  delivery_fee: number;
}

// Create the ShopContext with an empty default value
const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Create the ShopProvider component to wrap around the app
export const ShopContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { products, dispatch } = useProducts();
  const [cartItems, setCartItems] = useState<any>(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : {};
  });
  const [isActive, setIsActive] = useState(false);
  const [wishLists, setWishLists] = useState(() => {
    const storedWishLists = localStorage.getItem("wishLists");
    return storedWishLists ? JSON.parse(storedWishLists) : [];
  });

  const delivery_fee = 100;

  useEffect(() => {
    getProducts(dispatch);
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wishLists", JSON.stringify(wishLists));
  }, [wishLists]);

  const addToCart = async (itemId: string, size: string) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    // Clone the cartItems to avoid mutating state directly
    let cartData = structuredClone(cartItems || {});

    // Check if the cart has this itemId already
    if (!cartData[itemId]) {
      // Initialize the item object if it doesn't exist
      cartData[itemId] = {};
    }

    // Check if the size exists for this item
    if (cartData[itemId][size]) {
      // If the size exists, increment the quantity
      cartData[itemId][size] += 1;
    } else {
      // If the size doesn't exist, initialize it with 1
      cartData[itemId][size] = 1;
    }

    // Update the state with the new cart data
    setCartItems(cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (
    itemId: string,
    size: string,
    quantity: number
  ) => {
    let cartData = structuredClone(cartItems || {});
    if (quantity > 0) {
      cartData[itemId][size] = quantity;
    } else {
      delete cartData[itemId][size]; // Remove size if quantity is 0
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId]; // Remove item if no sizes left
      }
    }
    setCartItems(cartData);
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products?.find(
        (product: Product) => product._id === items
      );
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0 && itemInfo) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalAmount;
  };

  const manageWishLists = (productId: any) => {
    setWishLists((prevWishLists: any) => {
      if (prevWishLists.includes(productId)) {
        // Remove the product if it's already in the wishlist
        return prevWishLists.filter((id: any) => id !== productId);
      } else {
        // Add the product if it's not in the wishlist
        return [...prevWishLists, productId];
      }
    });
  };

  return (
    <ShopContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        wishLists,
        setWishLists,
        manageWishLists,
        isActive,
        setIsActive,
        delivery_fee,
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
