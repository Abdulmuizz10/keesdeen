import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosConfig";

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
  isHeroReady: boolean; // NEW: Track if hero is fully ready to display
  setIsHeroReady: (value: boolean) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

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
  const [isHeroReady, setIsHeroReady] = useState(false); // NEW

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

    let cartData = structuredClone(cartItems || {});

    if (!cartData[itemId]) {
      cartData[itemId] = {
        name,
        price,
        image,
        variants: {},
      };
    }

    const variantKey = `${size}-${color}`;
    if (cartData[itemId].variants[variantKey]) {
      cartData[itemId].variants[variantKey] += 1;
    } else {
      cartData[itemId].variants[variantKey] = 1;
    }

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
      delete cartData[itemId].variants[variantKey];
      if (Object.keys(cartData[itemId].variants).length === 0) {
        delete cartData[itemId];
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
            product: itemId,
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
        return prevWishLists.filter((wish: any) => wish._id !== product._id);
      } else {
        return [...prevWishLists, product];
      }
    });
  };

  // UPDATED: Preload first image and wait for it to load
  const preloadFirstImage = (images: HeroImage[]): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!images.length) {
        resolve();
        return;
      }

      const firstImage = new Image();

      firstImage.onload = () => {
        console.log("First hero image loaded successfully");
        resolve();
      };

      firstImage.onerror = () => {
        console.error("Failed to load first hero image");
        reject();
      };

      // Add timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        console.warn("Hero image loading timeout");
        resolve(); // Resolve anyway after timeout
      }, 5000);

      firstImage.onload = () => {
        clearTimeout(timeout);
        console.log("First hero image loaded successfully");
        resolve();
      };

      firstImage.src = images[0].url;
    });
  };

  useEffect(() => {
    const fetchHeroSettings = async () => {
      try {
        const res = await axiosInstance.get(`/settings/get-hero`);
        if (res.data?.success && res.data?.data?.images?.length > 0) {
          setHeroSettings(res.data.data);
          setIsFetched(true);

          // Wait for first image to actually load
          await preloadFirstImage(res.data.data.images);

          // Mark as ready only after image is loaded
          setIsHeroReady(true);
        } else {
          // No hero images, mark as ready immediately
          setIsFetched(true);
          setIsHeroReady(true);
        }
      } catch (error) {
        console.error("Hero fetch error:", error);
        toast.error("Hero failed to load");
        // Even on error, mark as ready to not block forever
        setIsFetched(true);
        setIsHeroReady(true);
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
        isHeroReady, // NEW
        setIsHeroReady, // NEW
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
