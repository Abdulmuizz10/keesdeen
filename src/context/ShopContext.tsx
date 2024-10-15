import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Images } from "../assets";
import { toast } from "react-toastify";

// Define the type for a clothing product
interface ClothingProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  size: string;
  color: string;
  rating: number;
  reviews: number;
  isAvailable: boolean;
  material: string;
  gender: string;
  imageUrl: string[];
  description: string;
}

// Define the context type
interface ShopContextType {
  products: ClothingProduct[];
  cartItems: any;
  addToCart: any;
  getCartCount: any;
  updateQuantity: any;
  getCartAmount: any;
  wishLists: any;
  manageWishLists: any;
  isActive: any;
  setIsActive: any;
}

// Create the ShopContext with an empty default value
const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Create a custom hook for easier access to the ShopContext

// Sample clothing products
const initialProducts: ClothingProduct[] = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    brand: "Burberry",
    category: "Active wear",
    subcategory: " Modest Workout Tops",
    price: 199.99,
    size: "M",
    color: "Cream",
    rating: 4.9,
    reviews: 190,
    isAvailable: true,
    material: "Wool",
    gender: "Unisex",
    imageUrl: [Images.img_2_1, Images.img_2_2, Images.img_2_3, Images.img_2_4],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 2,
    name: "Silk Trunks T-Shirt",
    brand: "Levi's",
    category: "Active wear",
    subcategory: " Joggers & Bottoms",
    price: 49.99,
    size: "3XL",
    color: "Purple",
    rating: 4.8,
    reviews: 420,
    isAvailable: true,
    material: "Denim",
    gender: "Men",
    imageUrl: [Images.img_1, Images.img_1, Images.img_1, Images.img_1],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 3,
    name: "Running Shoes",
    brand: "Nike",
    category: "Active Wear",
    subcategory: "Complete Active wear Sets",
    price: 89.99,
    size: "L",
    color: "Black",
    rating: 4.6,
    reviews: 540,
    isAvailable: true,
    material: "Mesh",
    gender: "Women",
    imageUrl: [Images.img_4, Images.img_4, Images.img_4, Images.img_4],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 4,
    name: "Hooded Sweatshirt",
    brand: "Adidas",
    category: "Active wear",
    subcategory: "High-Support Sports Bras",
    price: 59.99,
    size: "S",
    color: "White",
    rating: 4.7,
    reviews: 365,
    isAvailable: true,
    material: "Polyester",
    gender: "Unisex",
    imageUrl: [Images.img_5, Images.img_5, Images.img_5, Images.img_5],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 5,
    name: "Casual Chinos",
    brand: "Zara",
    category: "Active wear",
    subcategory: "Sports Hijabs",
    price: 39.99,
    size: "M",
    color: "Blue",
    rating: 4.3,
    reviews: 280,
    isAvailable: true,
    material: "Cotton",
    gender: "Men",
    imageUrl: [Images.img_6, Images.img_6, Images.img_6, Images.img_6],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 6,
    name: "Floral Print Dress",
    brand: "H&M",
    category: "Active wear",
    subcategory: "Burkinis / Swimwear",
    price: 29.99,
    size: "XS",
    color: "Red",
    rating: 4.4,
    reviews: 180,
    isAvailable: true,
    material: "Rayon",
    gender: "Women",
    imageUrl: [Images.img_7, Images.img_7, Images.img_7, Images.img_7],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 7,
    name: "Denim Jacket",
    brand: "Guess",
    category: "Fitness accessories",
    subcategory: "Gym Essentials Kit",
    price: 69.99,
    size: "2XL",
    color: "Cream",
    rating: 4.6,
    reviews: 320,
    isAvailable: true,
    material: "Denim",
    gender: "Unisex",
    imageUrl: [Images.img_8, Images.img_8, Images.img_8, Images.img_8],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 8,
    name: "Striped Polo Shirt",
    brand: "Ralph Lauren",
    category: "Fitness accessories",
    subcategory: "Workout Bag",
    price: 79.99,
    size: "XXS",
    color: "Green",
    rating: 4.5,
    reviews: 150,
    isAvailable: true,
    material: "Cotton",
    gender: "Men",
    imageUrl: [Images.img_10, Images.img_10, Images.img_10, Images.img_10],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 9,
    name: "Yoga Leggings",
    brand: "Lululemon",
    category: "Fitness accessories",
    subcategory: "Water Bottle",
    price: 89.99,
    size: "XL",
    color: "Grey",
    rating: 4.9,
    reviews: 610,
    isAvailable: true,
    material: "Spandex",
    gender: "Women",
    imageUrl: [Images.img_11, Images.img_11, Images.img_11, Images.img_11],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 10,
    name: "Puffer Jacket",
    brand: "The North Face",
    category: "Fitness accessories",
    subcategory: "Athletic Socks",
    price: 149.99,
    size: "5XL",
    color: "Blue",
    rating: 4.8,
    reviews: 410,
    isAvailable: true,
    material: "Nylon",
    gender: "Men",
    imageUrl: [Images.img_12, Images.img_12, Images.img_12, Images.img_12],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 11,
    name: "Leather Chelsea Boots",
    brand: "Dr. Martens",
    category: "Active wear",
    subcategory: "Modest Workout Tops",
    price: 139.99,
    size: "M",
    color: "Brown",
    rating: 4.7,
    reviews: 290,
    isAvailable: true,
    material: "Leather",
    gender: "Unisex",
    imageUrl: [Images.img_13, Images.img_13, Images.img_13, Images.img_13],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 12,
    name: "Basic Black Cap",
    brand: "New Era",
    category: "Active wear",
    subcategory: "Joggers & Bottoms",
    price: 19.99,
    size: "L",
    color: "Black",
    rating: 4.4,
    reviews: 200,
    isAvailable: true,
    material: "Cotton",
    gender: "Unisex",
    imageUrl: [Images.img_14, Images.img_14, Images.img_14, Images.img_14],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 13,
    name: "Oversized Hoodie",
    brand: "Champion",
    category: "Active wear",
    subcategory: "Complete Active wear Sets",
    price: 44.99,
    size: "XS",
    color: "Pink",
    rating: 4.5,
    reviews: 340,
    isAvailable: true,
    material: "Fleece",
    gender: "Unisex",
    imageUrl: [Images.img_15, Images.img_15, Images.img_15, Images.img_15],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 14,
    name: "Plaid Flannel Shirt",
    brand: "Uniqlo",
    category: "Active wear",
    subcategory: "High-Support Sports Bras",
    price: 34.99,
    size: "L",
    color: "White",
    rating: 4.3,
    reviews: 270,
    isAvailable: true,
    material: "Cotton",
    gender: "Men",
    imageUrl: [Images.img_16, Images.img_16, Images.img_16, Images.img_16],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 15,
    name: "Athletic Shorts",
    brand: "Under Armour",
    category: "Active wear",
    subcategory: "Burkinis / Swimwear",
    price: 29.99,
    size: "XXS",
    color: "Purple",
    rating: 4.6,
    reviews: 310,
    isAvailable: true,
    material: "Polyester",
    gender: "Men",
    imageUrl: [Images.img_17, Images.img_17, Images.img_17, Images.img_17],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 16,
    name: "Wool Scarf",
    brand: "Burberry",
    category: "Fitness accessories",
    subcategory: "Gym Essentials Kit",
    price: 199.99,
    size: "S",
    color: "Cream",
    rating: 4.9,
    reviews: 190,
    isAvailable: true,
    material: "Wool",
    gender: "Unisex",
    imageUrl: [Images.img_18, Images.img_18, Images.img_18, Images.img_18],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 17,
    name: "V-Neck Sweater",
    brand: "Tommy Hilfiger",
    category: "Fitness accessories",
    subcategory: "Workout Bag",
    price: 69.99,
    size: "L",
    color: "Green",
    rating: 4.4,
    reviews: 230,
    isAvailable: true,
    material: "Wool",
    gender: "Men",
    imageUrl: [Images.img_19, Images.img_19, Images.img_19, Images.img_19],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 18,
    name: "High-Waist Skirt",
    brand: "Forever 21",
    category: "Fitness accessories",
    subcategory: "Water Bottle",
    price: 24.99,
    size: "S",
    color: "Black",
    rating: 4.2,
    reviews: 150,
    isAvailable: true,
    material: "Polyester",
    gender: "Women",
    imageUrl: [Images.img_20, Images.img_20, Images.img_20, Images.img_20],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 19,
    name: "Button-Up Shirt",
    brand: "Calvin Klein",
    category: "Fitness accessories",
    subcategory: "Sweat Towel",
    price: 49.99,
    size: "M",
    color: "White",
    rating: 4.6,
    reviews: 310,
    isAvailable: true,
    material: "Cotton",
    gender: "Men",
    imageUrl: [Images.img_21, Images.img_21, Images.img_21, Images.img_21],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 20,
    name: "Graphic Tee",
    brand: "Supreme",
    category: "Fitness accessories",
    subcategory: "Athletic Socks",
    price: 39.99,
    size: "XS",
    color: "Red",
    rating: 4.8,
    reviews: 500,
    isAvailable: true,
    material: "Cotton",
    gender: "Unisex",
    imageUrl: [Images.img_22, Images.img_22, Images.img_22, Images.img_22],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 21,
    name: "Cargo Pants",
    brand: "Patagonia",
    category: "Active wear",
    subcategory: " Modest Workout Tops",
    price: 59.99,
    size: "XL",
    color: "Brown",
    rating: 4.7,
    reviews: 280,
    isAvailable: true,
    material: "Cotton",
    gender: "Men",
    imageUrl: [Images.img_23, Images.img_23, Images.img_23, Images.img_23],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 22,
    name: "Track Jacket",
    brand: "Puma",
    category: "Active wear",
    subcategory: "Joggers & Bottoms",
    price: 79.99,
    size: "2XL",
    color: "Blue",
    rating: 4.5,
    reviews: 290,
    isAvailable: true,
    material: "Polyester",
    gender: "Unisex",
    imageUrl: [Images.img_24, Images.img_24, Images.img_24, Images.img_24],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 23,
    name: "Silk Blouse",
    brand: "Dior",
    category: "Active wear",
    subcategory: "Complete Active wear Sets",
    price: 129.99,
    size: "XXS",
    color: "Pink",
    rating: 4.9,
    reviews: 400,
    isAvailable: true,
    material: "Silk",
    gender: "Women",
    imageUrl: [Images.img_11, Images.img_11, Images.img_11, Images.img_11],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 24,
    name: "Sport Socks (5-Pack)",
    brand: "Adidas",
    category: "Active wear",
    subcategory: "High-Support Sports Bras",
    price: 19.99,
    size: "2XL",
    color: "Black",
    rating: 4.3,
    reviews: 120,
    isAvailable: true,
    material: "Cotton",
    gender: "Unisex",
    imageUrl: [Images.img_12, Images.img_12, Images.img_12, Images.img_12],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 25,
    name: "Polo Shirt",
    brand: "Lacoste",
    category: "Active wear",
    subcategory: "Sports Hijabs",
    price: 89.99,
    size: "3XL",
    color: "Green",
    rating: 4.6,
    reviews: 210,
    isAvailable: true,
    material: "Cotton",
    gender: "Men",
    imageUrl: [Images.img_13, Images.img_13, Images.img_13, Images.img_13],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },

  {
    id: 26,
    name: "Sports Bra",
    brand: "Nike",
    category: "Active wear",
    subcategory: "Burkinis / Swimwear",
    price: 34.99,
    size: "XS",
    color: "White",
    rating: 4.9,
    reviews: 430,
    isAvailable: true,
    material: "Spandex",
    gender: "Women",
    imageUrl: [Images.img_16, Images.img_16, Images.img_16, Images.img_16],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 27,
    name: "Leather Biker Jacket",
    brand: "AllSaints",
    category: "Fitness accessories",
    subcategory: "Gym Essentials Kit",
    price: 299.99,
    size: "L",
    color: "Black",
    rating: 4.8,
    reviews: 330,
    isAvailable: true,
    material: "Leather",
    gender: "Unisex",
    imageUrl: [Images.img_19, Images.img_19, Images.img_19, Images.img_19],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 28,
    name: "Corduroy Pants",
    brand: "Urban Outfitters",
    category: "Fitness accessories",
    subcategory: "Workout Bag",
    price: 54.99,
    size: "M",
    color: "Brown",
    rating: 4.5,
    reviews: 190,
    isAvailable: true,
    material: "Corduroy",
    gender: "Men",
    imageUrl: [Images.img_15, Images.img_15, Images.img_15, Images.img_15],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 29,
    name: "Ankle Boots",
    brand: "Steve Madden",
    category: "Fitness accessories",
    subcategory: "Water Bottle",
    price: 119.99,
    size: "L",
    color: "Cream",
    rating: 4.7,
    reviews: 240,
    isAvailable: true,
    material: "Leather",
    gender: "Women",
    imageUrl: [Images.img_10, Images.img_10, Images.img_10, Images.img_10],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 30,
    name: "Denim Skirt",
    brand: "American Eagle",
    category: "Fitness accessories",
    subcategory: "Sweat Towel",
    price: 44.99,
    size: "S",
    color: "Blue",
    rating: 4.6,
    reviews: 260,
    isAvailable: true,
    material: "Denim",
    gender: "Women",
    imageUrl: [Images.img_7, Images.img_7, Images.img_7, Images.img_7],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
  {
    id: 31,
    name: "Wide Brim Hat",
    brand: "Stetson",
    category: "Fitness accessories",
    subcategory: "Athletic Socks",
    price: 99.99,
    size: "XXS",
    color: "Grey",
    rating: 4.8,
    reviews: 310,
    isAvailable: true,
    material: "Wool",
    gender: "Unisex",
    imageUrl: [Images.img_5, Images.img_5, Images.img_5, Images.img_5],
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas vel enim aliquid exercitationem repellendus amet ex explicabo, facere voluptatem saepe ",
  },
];

// Create the ShopProvider component to wrap around the app
export const ShopContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products] = useState<ClothingProduct[]>(initialProducts);

  {
    /* Unused cart code */
  }

  // const [cartItems, setCartItems] = useState<any>({});

  // const addToCart = async (itemId: number, size: string) => {
  //   if (!size) {
  //     toast.error("Select Product Size");
  //     return;
  //   }
  //   // Clone the cartItems to avoid mutating state directly
  //   let cartData = structuredClone(cartItems || {});

  //   // Check if the cart has this itemId already
  //   if (!cartData[itemId]) {
  //     // Initialize the item object if it doesn't exist
  //     cartData[itemId] = {};
  //   }

  //   // Check if the size exists for this item
  //   if (cartData[itemId][size]) {
  //     // If the size exists, increment the quantity
  //     cartData[itemId][size] += 1;
  //   } else {
  //     // If the size doesn't exist, initialize it with 1
  //     cartData[itemId][size] = 1;
  //   }

  //   // Update the state with the new cart data
  //   setCartItems(cartData);
  // };

  // const getCartCount = () => {
  //   let totalCount = 0;
  //   for (const items in cartItems) {
  //     for (const item in cartItems[items]) {
  //       try {
  //         if (cartItems[items][item] > 0) {
  //           totalCount += cartItems[items][item];
  //         }
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   }
  //   return totalCount;
  // };

  // const updateQuantity = async (
  //   itemId: number,
  //   size: string,
  //   quantity: number
  // ) => {
  //   let cartData = structuredClone(cartItems || {});
  //   cartData[itemId][size] = quantity;
  //   setCartItems(cartData);
  // };

  // const getCartAmount = () => {
  //   let totalAmount = 0;
  //   for (const items in cartItems) {
  //     let itemInfo = products.find((product) => product.id === Number(items));
  //     for (const item in cartItems[items]) {
  //       try {
  //         if (cartItems[items][item] > 0 && itemInfo) {
  //           totalAmount += itemInfo.price * cartItems[items][item];
  //         }
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   }
  //   return totalAmount;
  // };

  const [cartItems, setCartItems] = useState<any>(() => {
    // Retrieve cart data from localStorage on initial render
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : {}; // Use stored cart or an empty object
  });

  useEffect(() => {
    // Save cart data to localStorage whenever cartItems state changes
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (itemId: number, size: string) => {
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
    itemId: number,
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
      let itemInfo = products.find((product) => product.id === Number(items));
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

  const [wishLists, setWishLists] = useState(() => {
    const storedWishLists = localStorage.getItem("wishLists");
    return storedWishLists ? JSON.parse(storedWishLists) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishLists", JSON.stringify(wishLists));
  }, [wishLists]);

  const manageWishLists = (productId: any) => {
    setWishLists((prevWishLists: any) => {
      if (prevWishLists.includes(productId)) {
        // Remove the product if it's already in the wishlist
        return prevWishLists.filter((id: any) => id !== Number(productId));
      } else {
        // Add the product if it's not in the wishlist
        return [...prevWishLists, productId];
      }
    });
  };

  const [isActive, setIsActive] = useState(false);

  return (
    <ShopContext.Provider
      value={{
        products,
        cartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        wishLists,
        manageWishLists,
        isActive,
        setIsActive,
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
