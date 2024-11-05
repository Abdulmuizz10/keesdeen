import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useProducts } from "../context/ProductContext/ProductContext";
import { getProducts } from "../context/ProductContext/ProductApiCalls";
import { Product } from "../lib/types";
import ProductItem from "./ProductItem";
import Spinner from "./Spinner";

type Props = {
  heading: string;
  description: string;
};

export type Gallery5Props = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const Gallery5 = (props: Gallery5Props) => {
  const { heading, description } = {
    ...Gallery5Defaults,
    ...props,
  } as Props;

  const { products, dispatch } = useProducts();
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getProducts(dispatch);
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28" ref={ref}>
      <div className="container">
        <div className="rb-12 mb-12 text-center md:mb-18 lg:mb-20">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            {heading}
          </h2>
          <p className="md:text-md">{description}</p>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div> // Display a loading message or spinner
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 items-start justify-center gap-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
            {products &&
              products.slice(0, 8).map((product: Product, index) => (
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
                    delay: index * 0.4, // Adjust delay for smoother animation
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

export const Gallery5Defaults: Gallery5Props = {
  heading: "Collections",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

// import { useEffect, useRef } from "react";
// import { motion, useInView } from "framer-motion";
// import { useProducts } from "../context/ProductContext/ProductContext";
// import { getProducts } from "../context/ProductContext/ProductApiCalls";
// import { Product } from "../lib/types";
// import ProductItem from "./ProductItem";

// type Props = {
//   heading: string;
//   description: string;
// };

// export type Gallery5Props = React.ComponentPropsWithoutRef<"section"> &
//   Partial<Props>;

// export const Gallery5 = (props: Gallery5Props) => {
//   const { heading, description } = {
//     ...Gallery5Defaults,
//     ...props,
//   } as Props;

//   const { products, dispatch } = useProducts();

//   useEffect(() => {
//     getProducts(dispatch);
//   }, [dispatch]);

//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: true });

//   return (
//     <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28" ref={ref}>
//       <div className="container">
//         <div className="rb-12 mb-12 text-center md:mb-18 lg:mb-20">
//           <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
//             {heading}
//           </h2>
//           <p className="md:text-md">{description}</p>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 items-start justify-center gap-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
//           {products &&
//             products?.slice(0, 8)?.map((product: Product, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 50 }}
//                 animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
//                 transition={{
//                   duration: 0.5,
//                   ease: "easeOut",
//                   delay: index * 0.6,
//                 }}
//               >
//                 <ProductItem product={product} />
//               </motion.div>
//             ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export const Gallery5Defaults: Gallery5Props = {
//   heading: "Collections",
//   description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
// };
