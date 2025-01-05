import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useShop } from "../../context/ShopContext";
import ProductItem from "../../components/ProductItem";

const WishLists: React.FC = () => {
  const { wishLists } = useShop();
  const [lists, setLists] = useState([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    setLists(wishLists);
  }, [wishLists]);

  return (
    <section className="px-[5%] py-24 md:py-30" ref={ref}>
      <div className="container">
        <div className="rb-12 mb-12 md:mb-5">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
            Wishlists
          </h2>
        </div>

        <div className="mt-4 border-t border-border-secondary">
          {lists?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
              {lists?.map((product: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{
                    opacity: isInView ? 1 : 0,
                    y: isInView ? 0 : 50,
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeOut",
                    delay: index * 0.4,
                  }}
                >
                  <ProductItem product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-3xl text-text-secondary">
              No products in your wishlist yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default WishLists;
