import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Axios from "axios";
import { URL } from "../lib/constants";
import ProductCard from "./ProductCard";

interface ProductListProps {
  id: string;
}

const RelatedProducts: React.FC<ProductListProps> = ({ id }) => {
  const [products, setProducts] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(
          `${URL}/products/collections/products/${id}/related-products`,
          {
            validateStatus: (status) => status < 600,
          }
        );
        if (response.status === 200) {
          setProducts(response.data);
        }
      } catch (error) {
        setError("Unable to get products!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="my-10" ref={ref}>
      <div className="mb-12 md:mb-5">
        <h2 className="mb-5 text-3xl md:text-5xl font-bold md:mb-6">
          <span>Related Products</span>
        </h2>
      </div>
      <div className="grid gird-cols grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xxl:grid-cols-5 gap-4 gap-y-6">
        {products?.length > 0 ? (
          products?.slice(0, 8).map((product: any, index: number) => (
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
              <ProductCard product={product} loading={loading} key={index} />
            </motion.div>
          ))
        ) : error ? (
          <div className="col-span-4">
            <p className="text-base sm:text-xl text-center mt-10 sm:mt-0">
              {error}
            </p>
          </div>
        ) : (
          <div className="col-span-4">
            <p className="text-base sm:text-xl text-center mt-10 sm:mt-0">
              No related products!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
