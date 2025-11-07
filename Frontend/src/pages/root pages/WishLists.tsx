import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useShop } from "../../context/ShopContext";
import ProductCard from "../../components/ProductCard";

const WishLists: React.FC = () => {
  const { wishLists } = useShop();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    setLists(wishLists);
    setLoading(false);
  }, [wishLists]);

  return (
    <section className="placing" ref={ref}>
      <div className="">
        <div className="mb-2 md:mb-5">
          <h2 className="mb-2 text-5xl font-bold md:mb-4 md:text-7xl lg:text-8xl">
            <span>Wishlists</span>
          </h2>
          <p className="md:text-md">Your wishlists.</p>
        </div>

        <div className="mt-4 border-t">
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
                    duration: 0.8,
                    ease: "easeOut",
                    delay: index * 0.8,
                  }}
                >
                  <ProductCard product={product} loading={loading} />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-base md:text-3xl text-text-secondary">
              No products in your wishlist yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default WishLists;
