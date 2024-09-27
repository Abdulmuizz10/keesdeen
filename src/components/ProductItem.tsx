import { Link } from "react-router-dom";
import { formatAmount } from "../lib/utils";
import { useState } from "react";
import { LuHeart } from "react-icons/lu";
// import { useInView } from "../lib/utils";
// import { motion } from "framer-motion";

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

// const ProductItem = ({ product }: { product: Product }) => {
//   return (
//     <Link
//       className="text-text-secondary cursor-pointer"
//       to={`/product_details/${product.id}`}
//     >
//       <div className="overflow-hidden">
//         <img
//           src={product.imageUrl[0]}
//           alt="product image"
//           className="transition ease-in-out hover:scale-110 w-full h-full"
//         />
//         <p className="pt-3 pb-1 text-sm">{product.name}</p>
//         <p className=" font-medium text-sm text-text-primary">
//           {formatAmount(product.price)}
//         </p>
//       </div>
//     </Link>
//   );
// };

const ProductItem = ({ product }: { product: Product }) => {
  const [image, setImage] = useState<boolean>(false);
  // const ref = useRef(null);
  // const isInView = useInView(ref);
  return (
    <div
      className="max-w-xs mx-auto bg-white rounded-b-lg shadow-large overflow-hidden relative"
      onMouseOver={() => setImage(true)}
      onMouseLeave={() => setImage(false)}
      // ref={ref}
      // initial={{ opacity: 0, y: 50 }}
      // animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      // transition={{
      //   duration: 0.5,
      //   ease: "easeOut",
      //   delay: product.id * 0.03,
      // }}
    >
      <div className="absolute top-3 right-3 z-50 cursor-pointer">
        <LuHeart />
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
        <h3 className="text-lg font-semibold text-gray-800 bricolage-grotesque">
          {product.name}
        </h3>
        <p className="text-gray-500">{formatAmount(product.price)}</p>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2 items-center justify-center">
            {["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"].map(
              (size) => (
                <button
                  key={size}
                  className="border border-gray-300 rounded-lg text-gray-600 text-xs px-2 py-1 h-8 w-10 hover:bg-gray-100 transition poppins"
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
