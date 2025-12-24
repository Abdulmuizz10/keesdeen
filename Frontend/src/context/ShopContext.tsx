import { URL } from "@/lib/constants";
import Axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { toast } from "sonner";

interface HeroImage {
  url: string;
  tagline: string;
}

interface HeroSettings {
  images: HeroImage[];
  transitionDuration: number;
  autoPlayInterval: number;
}

const defaultHero: HeroSettings = {
  images: [],
  transitionDuration: 1000,
  autoPlayInterval: 5000,
};

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
  heroSettings: HeroSettings;
  setHeroSettings: any;
  loadedImages: any;
  setLoadedImages: any;
  isFetched: boolean;
  setIsFetched: (value: boolean) => void;
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
  const [shippingFee, setShippingFee] = useState<any>(0);
  const [discountPercent, setDiscountPercent] = useState<any>(0);
  const [change, setChange] = useState<boolean>(true);
  const [heroSettings, setHeroSettings] = useState<HeroSettings>(defaultHero);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [isFetched, setIsFetched] = useState(false);

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

  const preloadImages = (images: HeroImage[]) => {
    images.forEach((img) => {
      const image = new Image();
      image.src = img.url;
    });
  };

  useEffect(() => {
    const fetchHeroSettings = async () => {
      try {
        const res = await Axios.get(`${URL}/settings/get-hero`);
        if (res.data?.success && res.data?.data?.images?.length > 0) {
          preloadImages(res.data.data.images);
          setHeroSettings(res.data.data);
        }
      } catch (error) {
        toast.error("Hero failed to load");
      } finally {
        setIsFetched(true);
      }
    };
    fetchHeroSettings();
  }, []);

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
        heroSettings,
        setHeroSettings,
        loadedImages,
        setLoadedImages,
        isFetched,
        setIsFetched,
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
