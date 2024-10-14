import { Link } from "react-router-dom";
import { formatAmount } from "../lib/utils";
// import { useEffect, useRef, useState } from "react";
// import { useState } from "react";
import { LuHeart } from "react-icons/lu";
// import { useInView } from "framer-motion";
// import gsap from "gsap";

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
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

const CollectionItem = ({
  product,
  className,
}: {
  product: Product;
  className: string;
}) => {
  // const [image, setImage] = useState<string>(product.imageUrl[0]);
  return (
    <div
      className={`max-w-xs mx-auto bg-white rounded-xl  shadow-md overflow-hidden relative ${className}`}
      // onMouseOver={() => setImage(product.imageUrl[1])}
      // onMouseLeave={() => setImage(product.imageUrl[0])}
    >
      <div className="absolute top-3 right-3 z-50 cursor-pointer">
        <LuHeart className="text-2xl text-text-primary" />
      </div>
      <div className="relative">
        <Link to={`/product_details/${product.id}`}>
          <img
            src={product.imageUrl[0]}
            alt="Product"
            className="w-full h-auto"
          />
        </Link>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 bricolage-grotesque">
          {product.name}
        </h3>
        <p className="text-gray-500">{formatAmount(product.price)}</p>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Sizes:</h4>
          <div className="grid grid-cols-6 gap-2">
            {["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"].map(
              (size) => (
                <button
                  key={size}
                  className="border border-gray-300 rounded-lg text-gray-600 text-sm px-2 py-1 hover:bg-gray-100 transition"
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

export default CollectionItem;
