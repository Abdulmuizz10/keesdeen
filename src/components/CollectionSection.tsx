import { useRef, useState } from "react";
import { useShop } from "../context/ShopContext";
import { LuHeart } from "react-icons/lu";
import { BsFillHeartFill } from "react-icons/bs";
import { formatAmount, useInView } from "../lib/utils";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

type Props = {
  heading: string;
  description: string;
};

export type Gallery5Props = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const Gallery5 = (props: Gallery5Props) => {
  const { heading, description } = {
    ...Gallery5Defaults,
    ...props,
  } as Props;
  const { products } = useShop();
  const collections = products.slice(21, 29);

  const ref = useRef(null);
  const isInView = useInView(ref);
  const [image, setImage] = useState<boolean>(false);
  const { manageWishLists, wishLists } = useShop();
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28" ref={ref}>
      <div className="container">
        <div className="rb-12 mb-12 text-center md:mb-18 lg:mb-20">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            {heading}
          </h2>
          <p className="md:text-md">{description}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 items-start justify-center gap-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
          {collections &&
            collections.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: index * 0.4,
                }}
                className="max-w-xs mx-auto bg-white rounded-b-lg shadow-large overflow-hidden relative text-center"
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
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 bricolage-grotesque">
                    {product.name}
                  </h3>
                  <p className="text-gray-500">{formatAmount(product.price)}</p>

                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1 items-center justify-center">
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
                          className={`border border-gray-300 rounded-sm text-gray-600 text-[10px] px-1 py-1 h-6 w-8 hover:bg-gray-100 transition poppins ${
                            product.size.includes(size) ? "" : "opacity-[0.3]"
                          }`}
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
    </section>
  );
};

export const Gallery5Defaults: Gallery5Props = {
  heading: "Collections",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};
