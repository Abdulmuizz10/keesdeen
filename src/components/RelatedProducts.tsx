import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import ProductItem from "./ProductItem";
import Axios from "axios";
import { URL } from "../lib/constants";

interface ProductListProps {
  category: string;
  id: string;
}

const RelatedProducts: React.FC<ProductListProps> = ({ category, id }) => {
  const [related, setRelated] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get(`${URL}/products`, {
          validateStatus: (status) => status < 600,
        });
        if (res.status === 200) {
          const relatedProducts = res.data
            .filter((p: any) => p.category === category)
            .filter((p: any) => p._id !== id);
          setRelated(relatedProducts);
        } else {
          // toast.error(res.data.message || "Something went wrong");
        }
      } catch (error) {
        // toast.error("An unexpected error occurred. Please try again.");
      }
    };
    fetchData();
  }, [id]);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="my-10" ref={ref}>
      <div className="rb-12 mb-12 md:mb-5">
        <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque text-gradient">
          Related Products
        </h2>
      </div>
      <div className="grid gird-cols grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xxl:grid-cols-5 gap-4 gap-y-6">
        {related ? (
          related.slice(0, 8).map((product: any, index: number) => (
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
              <ProductItem product={product} key={index} />
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">No related products!</p>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
