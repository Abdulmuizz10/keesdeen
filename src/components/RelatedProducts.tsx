import { useEffect, useRef, useState } from "react";
import { useShop } from "../context/ShopContext";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { formatAmount } from "../lib/utils";
import { LuHeart } from "react-icons/lu";

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

const RelatedProducts = ({ category }: any) => {
  const { products } = useShop();
  const [related, setRelated] = useState<Product[]>();

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter((item) => category === item.category);
      setRelated(productsCopy);
    }
  }, [products]);

  const ref = useRef(null);
  const isInView = useInView(ref);
  const [image, setImage] = useState<boolean>(false);
  const { manageWishLists } = useShop();

  return (
    <div className="my-10" ref={ref}>
      <div className="rb-12 mb-12 md:mb-5">
        <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
          Related Products
        </h2>
        <p className="md:text-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>
      <div className="grid gird-cols md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6">
        {related &&
          related.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: index * 0.4,
              }}
              className="max-w-xs mx-auto bg-white rounded-b-lg shadow-large overflow-hidden relative"
              onMouseOver={() => setImage(true)}
              onMouseLeave={() => setImage(false)}
            >
              <div className="absolute top-3 right-3 z-50 cursor-pointer">
                <LuHeart
                  onClick={() => manageWishLists(product.id)}
                  className="text-2xl text-text-primary"
                />
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
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 bricolage-grotesque">
                  {product.name}
                </h3>
                <p className="text-gray-500">{formatAmount(product.price)}</p>

                <div className="mt-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    {[
                      "XXS",
                      "XS",
                      "S",
                      "M",
                      "L",
                      "XL",
                      "2XL",
                      "3XL",
                      "4XL",
                      "5XL",
                    ].map((size) => (
                      <button
                        key={size}
                        className="border border-gray-300 rounded-lg text-gray-600 text-sm px-2 py-1 h-8 w-10 hover:bg-gray-100 transition poppins"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
