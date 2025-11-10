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
      <div className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="mb-2 text-5xl font-bold md:mb-4 md:text-7xl lg:text-8xl">
          <span>Wishlists</span>
        </h1>
        <p className="text-sm text-text-secondary">
          {lists.length} {lists.length === 1 ? "item" : "items"}
        </p>
      </div>

      <div>
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
    </section>
  );
};

export default WishLists;
