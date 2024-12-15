import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useShop } from "../../context/ShopContext";
import ProductItem from "../../components/ProductItem";

interface ProductListProps {
  products: any;
}

const WishLists: React.FC<ProductListProps> = ({ products }) => {
  const { wishLists, isActive } = useShop();
  const [lists, setLists] = useState<any>();

  useEffect(() => {
    const filteredProducts = products?.filter((product: any) =>
      wishLists.includes(product._id)
    );
    setLists(filteredProducts);
  }, [wishLists, products]);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="relume" className="px-[5%] py-24 md:py-30" ref={ref}>
      <div className="container">
        <div className="rb-12 mb-12 md:mb-5">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
            Wishlists
          </h2>
        </div>

        <div
          className={`mt-4 border-t border-border-secondary ${
            isActive && "opacity-0 transition-opacity"
          } `}
        >
          {lists && lists?.length < 1 ? (
            <p className="mt-4 text-3xl text-text-secondary">
              Your wishlists is empty.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
              {lists &&
                lists?.map((product: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{
                      opacity: isInView ? 1 : 0,
                      y: isInView ? 0 : 50,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                      delay: index * 0.6,
                    }}
                  >
                    <ProductItem product={product} />
                  </motion.div>
                ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WishLists;
