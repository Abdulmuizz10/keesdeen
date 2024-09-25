import { useRef } from "react";
import { useShop } from "../context/ShopContext";
// import { useInView } from "framer-motion";
// import gsap from "gsap";
// import CollectionItem from "./CollectionItem";
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

  // const Container = useRef(null);
  // const inView = useInView(Container, { once: true });

  // useEffect(() => {
  //   gsap.fromTo(
  //     ".block-container",
  //     {
  //       opacity: 0,
  //       y: 100,
  //       scale: 0.5,
  //     },
  //     {
  //       opacity: 1,
  //       y: 0,
  //       scale: 1,
  //       ease: "power3.in",
  //       stagger: 0.4,
  //       delay: 0.2,
  //     }
  //   );
  // }, [inView]);

  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <section
      id="relume"
      className="px-[5%] py-16 md:py-24 lg:py-28"
      // ref={Container}
      ref={ref}
    >
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
              // <Link key={index} to={`/product_details/${product.id}`}>
              //   <img
              //     src={product.imageUrl[0]}
              //     alt="best seller image"
              //     className="size-full object-cover"
              //   />
              // </Link>
              // <CollectionItem
              //   product={product}
              //   key={index}
              //   className="block-container"
              // />
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
                // onMouseOver={() => setImage(product.imageUrl[1])}
                // onMouseLeave={() => setImage(product.imageUrl[0])}
              >
                <div className="absolute top-3 right-3 z-50 cursor-pointer">
                  {/* <LuHeart /> */}
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
                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                      Sizes:
                    </h4>
                    <div className="grid grid-cols-6 gap-2">
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
                          className="border border-gray-300 rounded-lg text-gray-600 text-sm px-2 py-1 hover:bg-gray-100 transition"
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
