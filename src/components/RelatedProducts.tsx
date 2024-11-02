import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Product } from "../lib/types";
import ProductItem from "./ProductItem";
import { useProducts } from "../context/ProductContext/ProductContext";
import { getProducts } from "../context/ProductContext/ProductApiCalls";

interface ProductListProps {
  category: string;
  id: string;
}

const RelatedProducts: React.FC<ProductListProps> = ({ category, id }) => {
  const { products, dispatch } = useProducts();
  const [related, setRelated] = useState<Product[]>();

  useEffect(() => {
    getProducts(dispatch);
    const relatedProducts = products
      .filter((p) => p.category === category)
      .filter((p) => p._id !== id);
    setRelated(relatedProducts);
  }, [products, dispatch]);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="my-10" ref={ref}>
      <div className="rb-12 mb-12 md:mb-5">
        <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
          Related Products
        </h2>
      </div>
      <div className="grid gird-cols md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6">
        {related &&
          related.slice(0, 8).map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
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
    </div>
  );
};

export default RelatedProducts;
