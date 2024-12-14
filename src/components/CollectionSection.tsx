import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useProducts } from "../context/ProductContext/ProductContext";
import { Product } from "../lib/types";
import ProductItem from "./ProductItem";
import Spinner from "./Spinner";
import Axios from "axios";
import { URL } from "../lib/constants";

type Gallery5Props = React.ComponentPropsWithoutRef<"section"> & {
  heading?: string;
  description?: string;
};

export const Gallery5 = ({
  heading = "Collections",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
}: Gallery5Props) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const { dispatch } = useProducts();
  // Fetch products on component mount
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const res = await Axios.get(`${URL}/products`, {
          validateStatus: (status) => status < 600,
        });

        if (res.status === 200) {
          setProducts(res.data);
        } else {
          // toast.error(res.data.message || "Something went wrong");
        }
        if (isMounted) setLoading(false);
      } catch (error) {
        // toast.error("An unexpected error occurred. Please try again.");
      }
      setLoading(false);
    };
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28" ref={ref}>
      <div className="container">
        <div className="rb-12 mb-12 text-center md:mb-18 lg:mb-20">
          <h2 className="rb-5 mb-5 text-5xl font-semibold md:mb-6 md:text-7xl lg:text-8xl">
            {heading}
          </h2>
          <p className="md:text-md">{description}</p>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 items-start justify-center gap-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
            {products.slice(0, 8).map((product: Product, index) => (
              <motion.div
                key={product._id} // Use product ID as the unique key
                initial={{ opacity: 0, y: 50 }}
                animate={{
                  opacity: isInView ? 1 : 0,
                  y: isInView ? 0 : 50,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: index * 0.5, // Adjust delay for smoother staggered animation
                }}
              >
                <ProductItem product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
