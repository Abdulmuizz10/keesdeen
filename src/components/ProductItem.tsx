import { Link } from "react-router-dom";
import { formatAmount } from "../lib/utils";
import { useState } from "react";
import { LuHeart } from "react-icons/lu";
import { BsFillHeartFill } from "react-icons/bs";
import { useShop } from "../context/ShopContext";
// import { useInView } from "../lib/utils";
// import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  size: string[];
  color: string;
  rating: number;
  reviews: number;
  isAvailable: boolean;
  material: string;
  gender: string;
  imageUrl: string[];
  description: string;
}

const ProductItem = ({ product }: { product: Product }) => {
  const [image, setImage] = useState<boolean>(false);
  const { manageWishLists, wishLists } = useShop();

  return (
    <div
      className="max-w-xs mx-auto bg-white  shadow-large overflow-hidden relative"
      onMouseOver={() => setImage(true)}
      onMouseLeave={() => setImage(false)}
    >
      <div className="absolute top-3 right-3 z-50 cursor-pointer">
        {wishLists.includes(product.id) ? (
          <BsFillHeartFill
            onClick={() => manageWishLists(product.id)}
            className="text-xl text-text-primary"
          />
        ) : (
          <LuHeart
            onClick={() => manageWishLists(product.id)}
            className="text-xl text-text-primary"
          />
        )}
      </div>
      <div className="relative">
        <Link to={`/product_details/${product.id}`}>
          <img
            src={image ? product.imageUrl[1] : product.imageUrl[0]}
            alt="Product"
            className="w-full h-auto"
          />
        </Link>
      </div>
      <div className="p-4 text-center">
        <h3 className="text-md xl:text-lg font-semibold text-gray-800 bricolage-grotesque">
          {product.name}
        </h3>
        <p className="text-gray-500">{formatAmount(product.price)}</p>

        <div className="mt-2">
          <div className="flex flex-wrap gap-1 items-center justify-center">
            {["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"].map(
              (size) => (
                <button
                  key={size}
                  className={`border border-gray-300 rounded-sm text-gray-600 text-[10px] px-1 py-1 h-6 w-8 hover:bg-gray-100 transition poppins ${
                    product.size.includes(size) ? "" : "opacity-[0.3]"
                  }`}
                >
                  {size}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
