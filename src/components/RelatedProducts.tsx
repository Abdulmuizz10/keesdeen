import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Product } from "../lib/types";
import ProductItem from "./ProductItem";

interface ProductListProps {
  products: Product[];
  category: string;
}

const RelatedProducts: React.FC<ProductListProps> = ({
  products,
  category,
}) => {
  const [related, setRelated] = useState<Product[]>();

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter((item) => category === item.category);
      setRelated(productsCopy);
    }
  }, [products]);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

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
