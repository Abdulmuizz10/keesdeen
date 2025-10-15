import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Product } from "../lib/types";
import Spinner from "./Spinner";
import Axios from "axios";
import { URL } from "../lib/constants";
import ProductCard from "./ProductCard";

type Gallery5Props = React.ComponentPropsWithoutRef<"section"> & {
  heading?: string;
  description?: string;
};

export const Gallery5 = ({
  heading = "Collections",
  description = "Discover the latest additions to our collections.",
}: Gallery5Props) => {
  // const { currentCurrency } = useShop();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await Axios.get(`${URL}/products/collections`, {
          validateStatus: (status) => status < 600,
        });
        if (res.status === 200) {
          setProducts(res.data);
          setLoading(false);
        } else {
          // toast.error(res.data.message || "Something went wrong");
          setLoading(false);
        }
        if (isMounted) setLoading(false);
      } catch (error) {
        // toast.error("An unexpected error occurred. Please try again.");
        setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28" ref={ref}>
      <div className="container">
        <div className="rb-12 mb-12 text-center md:mb-18 lg:mb-20">
          <h2 className="rb-5 mb-5 text-5xl font-semibold md:mb-6 md:text-7xl lg:text-8xl text-gradient">
            {heading}
          </h2>
          <p className="md:text-md text-text-primary">{description}</p>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 items-start justify-center gap-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
            {products?.map((product: Product, index) => (
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
        )}
      </div>
    </section>
  );
};
