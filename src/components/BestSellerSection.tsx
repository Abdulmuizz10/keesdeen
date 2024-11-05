import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@relume_io/relume-ui";
import type { CarouselApi } from "@relume_io/relume-ui";
import ProductItem from "./ProductItem";
import { Product } from "../lib/types";
import { getProducts } from "../context/ProductContext/ProductApiCalls";
import { useProducts } from "../context/ProductContext/ProductContext";
import Spinner from "./Spinner";

export const Gallery19: React.FC = () => {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [_, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state

  const { products, dispatch } = useProducts();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getProducts(dispatch);
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (api) {
      setCurrent(api.selectedScrollSnap() + 1);
      api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));

      // Automatically scroll to next item every 6 seconds
      const autoScroll = setInterval(() => api.scrollNext(), 6000);
      return () => clearInterval(autoScroll);
    }
  }, [api, products]); // Add products to the dependency array

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <Spinner />
      </div>
    );
  }

  return (
    <section>
      <div className="px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container">
          <div className="mb-12 text-center md:mb-18 lg:mb-10">
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Best Sellers
            </h2>
          </div>
          {products && products.length > 0 && (
            <Carousel
              setApi={setApi}
              opts={{
                loop: true,
                align: "start",
              }}
            >
              <div className="relative">
                <CarouselContent className="ml-0">
                  {products
                    .filter((product: Product) => product.bestSeller === true)
                    .map((product: Product, index) => (
                      <CarouselItem
                        key={index}
                        className="basis-2/2 md:basis-2/4 lg:basis-1/4"
                      >
                        <ProductItem product={product} />
                      </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex md:size-12 lg:size-14" />
                <CarouselNext className="hidden md:flex md:size-12 lg:size-14" />
              </div>
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
};

// import React, { useState, useEffect } from "react";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@relume_io/relume-ui";
// import type { CarouselApi } from "@relume_io/relume-ui";
// import ProductItem from "./ProductItem";
// import { Product } from "../lib/types";
// import { getProducts } from "../context/ProductContext/ProductApiCalls";
// import { useProducts } from "../context/ProductContext/ProductContext";

// export const Gallery19: React.FC = () => {
//   const [api, setApi] = useState<CarouselApi>();
//   const [_, setCurrent] = useState(0);

//   const { products, dispatch } = useProducts();

//   useEffect(() => {
//     getProducts(dispatch);
//   }, [dispatch]);

//   useEffect(() => {
//     if (!api) {
//       return;
//     }

//     setCurrent(api.selectedScrollSnap() + 1);
//     api.on("select", () => {
//       setCurrent(api.selectedScrollSnap() + 1);
//     });

//     // Automatically scroll to next item every 3 seconds
//     const autoScroll = setInterval(() => {
//       api.scrollNext(); // Scroll to the next item
//     }, 6000); // Adjust the interval time as needed (3 seconds here)

//     return () => clearInterval(autoScroll); // Clear the interval when the component unmounts
//   }, [api]);

//   // const bestSellers = products;

//   return (
//     <section>
//       <div className="px-[5%] py-16 md:py-24 lg:py-28">
//         <div className="container">
//           <div className="mb-12 text-center md:mb-18 lg:mb-10">
//             <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
//               Best Sellers
//             </h2>
//           </div>
//           <Carousel
//             setApi={setApi}
//             opts={{
//               loop: true,
//               align: "start",
//             }}
//           >
//             <div className="relative">
//               <CarouselContent className="ml-0">
//                 {products &&
//                   products
//                     ?.filter((product: Product) => product.bestSeller === true)
//                     .map((product: Product, index) => (
//                       <CarouselItem
//                         key={index}
//                         className="basis-2/2 md:basis-2/4 lg:basis-1/4"
//                       >
//                         <ProductItem product={product} key={index} />
//                       </CarouselItem>
//                     ))}
//               </CarouselContent>
//               <CarouselPrevious className="hidden md:flex md:size-12 lg:size-14" />
//               <CarouselNext className="hidden md:flex md:size-12 lg:size-14" />
//             </div>
//           </Carousel>
//         </div>
//       </div>
//     </section>
//   );
// };
