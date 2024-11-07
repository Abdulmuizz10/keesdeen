import { Link } from "react-router-dom";
import { formatAmount } from "../lib/utils";
import { useState } from "react";
import { RiHeartLine } from "react-icons/ri";
import { RiHeartFill } from "react-icons/ri";
import { useShop } from "../context/ShopContext";
import { Product } from "../lib/types";
import { useNavigate } from "react-router-dom";

const ProductItem = ({ product }: { product: Product }) => {
  const [image, setImage] = useState<boolean>(false);
  const { manageWishLists, wishLists } = useShop();

  const navigate = useNavigate();

  return (
    <div
      className="max-w-xs mx-auto bg-white  shadow-large overflow-hidden relative z-[1px]"
      onMouseOver={() => setImage(true)}
      onMouseLeave={() => setImage(false)}
    >
      <div className="absolute top-3 right-3 z-50 cursor-pointer">
        {wishLists.includes(product._id) ? (
          <RiHeartFill
            onClick={() => manageWishLists(product._id)}
            className="text-xl text-text-primary"
          />
        ) : (
          <RiHeartLine
            onClick={() => manageWishLists(product._id)}
            className="text-xl text-text-primary"
          />
        )}
      </div>
      <div className="relative">
        <Link to={`/product_details/${product._id}`}>
          <img
            src={image ? product.imageUrls[1] : product.imageUrls[0]}
            alt="Product"
            className="w-full h-auto"
            onClick={() => navigate(`/product_details/${product._id}`)}
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
