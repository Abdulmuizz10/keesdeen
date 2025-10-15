import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@relume_io/relume-ui";
import type { CarouselApi } from "@relume_io/relume-ui";
import clsx from "clsx";

import { URL } from "../lib/constants";
import Axios from "axios";
import LargeProductCard from "./LargeProductCard";

type Gallery21Props = React.ComponentPropsWithoutRef<"section"> & {
  heading?: string;
  description?: string;
};

export const Gallery21 = ({
  heading = "New Arrivals",
  description = "Discover the latest additions to our Arrivals.",
}: Gallery21Props) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  // Fetch products on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await Axios.get(`${URL}/products/new-arrivals`, {
          validateStatus: (status) => status < 600,
        });

        if (res.status === 200) {
          setProducts(res.data);
          setLoading(false);
        } else {
          // toast.error(res.data.message || "Something went wrong");
          setLoading(false);
        }
      } catch (error) {
        // toast.error("An unexpected error occurred. Please try again.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Set up carousel scroll state
  useEffect(() => {
    if (api) {
      const updateCurrentSlide = () => setCurrent(api.selectedScrollSnap() + 1);
      api.on("select", updateCurrentSlide);
      return () => {
        api.off("select", updateCurrentSlide); // Clean up listener on unmount
      };
    }
  }, [api]);

  // Filter products for new arrivals with valid images

  return (
    <section
      id="relume"
      className="overflow-hidden px-[5%] py-16 md:py-24 lg:py-28"
    >
      <div className="container">
        <div className="rb-12 mb-12 text-center md:mb-18 lg:mb-20">
          <h2 className="rb-5 mb-5 text-5xl font-semibold md:mb-6 md:text-7xl lg:text-8xl text-gradient">
            {heading}
          </h2>
          <p className="md:text-md">{description}</p>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
            align: "start",
          }}
        >
          <CarouselContent className="ml-0 gap-4">
            {loading
              ? Array(10)
                  .fill(null)
                  .map((_, index) => (
                    <LargeProductCard
                      product={""}
                      loading={loading}
                      key={index}
                    />
                  ))
              : products?.map((product: any, index) => (
                  <LargeProductCard
                    product={product}
                    loading={loading}
                    key={index}
                  />
                ))}
          </CarouselContent>
          <div className="mt-20 flex items-center justify-between">
            {/* Dot indicators for carousel */}
            <div className="mt-5 flex w-full items-start justify-start">
              {loading
                ? Array(10)
                    .fill(null)
                    .map((_, index) => (
                      <button
                        key={`dot-${index}`}
                        onClick={() => api?.scrollTo(index)}
                        aria-label={`Slide ${index + 1}`}
                        className={clsx(
                          "mx-[3px] inline-block size-2 rounded-full",
                          {
                            "bg-black": current === index + 1,
                            "bg-neutral-400": current !== index + 1,
                          }
                        )}
                      />
                    ))
                : products?.map((_, index) => (
                    <button
                      key={`dot-${index}`}
                      onClick={() => api?.scrollTo(index)}
                      aria-label={`Slide ${index + 1}`}
                      className={clsx(
                        "mx-[3px] inline-block size-2 rounded-full",
                        {
                          "bg-black": current === index + 1,
                          "bg-neutral-400": current !== index + 1,
                        }
                      )}
                    />
                  ))}
            </div>
            {/* Carousel navigation buttons */}
            <div className="flex items-end justify-end gap-2 md:gap-4">
              <CarouselPrevious
                aria-label="Previous slide"
                className="static right-0 top-0 size-12 -translate-y-0"
              />
              <CarouselNext
                aria-label="Next slide"
                className="static right-0 top-0 size-12 -translate-y-0"
              />
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
};

// import { useState, useEffect } from "react";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@relume_io/relume-ui";
// import type { CarouselApi } from "@relume_io/relume-ui";
// import clsx from "clsx";
// import { Link } from "react-router-dom";
// import { Product } from "../lib/types";
// import { getProducts } from "../context/ProductContext/ProductApiCalls";
// import { useProducts } from "../context/ProductContext/ProductContext";

// type Props = {
//   heading: string;
//   description: string;
// };

// export type Gallery21Props = React.ComponentPropsWithoutRef<"section"> &
//   Partial<Props>;

// export const Gallery21 = (props: Gallery21Props) => {
//   const { heading, description } = {
//     ...Gallery21Defaults,
//     ...props,
//   } as Props;

//   const { products, dispatch } = useProducts();

//   useEffect(() => {
//     getProducts(dispatch);
//   }, [dispatch]);

//   const [api, setApi] = useState<CarouselApi>();
//   const [current, setCurrent] = useState(0);

//   useEffect(() => {
//     if (!api) {
//       return;
//     }
//     setCurrent(api.selectedScrollSnap() + 1);
//     api.on("select", () => {
//       setCurrent(api.selectedScrollSnap() + 1);
//     });
//   }, [api]);

//   return (
//     <section
//       id="relume"
//       className="overflow-hidden px-[5%] py-16 md:py-24 lg:py-28"
//     >
//       <div className="container">
//         <div className="rb-12 mb-12 md:mb-18 lg:mb-20">
//           <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
//             {heading}
//           </h2>
//           <p className="md:text-md">{description}</p>
//         </div>
//         {/* for all available options: https://www.embla-carousel.com/api/options/ */}
//         <Carousel
//           setApi={setApi}
//           opts={{
//             loop: true,
//             align: "start",
//           }}
//         >
//           <CarouselContent className="ml-0">
//             {products &&
//               products
//                 ?.filter((product: Product) => product.newArrival === true)
//                 .map((product: Product, index) => (
//                   <CarouselItem
//                     key={index}
//                     className="basis-full pl-0 pr-6 md:basis-1/2 md:pr-8"
//                   >
//                     <Link to={`/product_details/${product._id}`}>
//                       <img
//                         src={product.imageUrls[0]}
//                         alt="arrival product"
//                         className="aspect-square size-full object-cover"
//                       />
//                     </Link>
//                   </CarouselItem>
//                 ))}
//           </CarouselContent>
//           <div className="rt-8 mt-8 flex items-center justify-between">
//             <div className="mt-5 flex w-full items-start justify-start">
//               {products &&
//                 products
//                   ?.filter((product: Product) => product.newArrival === true)
//                   .map((_, index) => (
//                     <button
//                       key={index}
//                       onClick={() => api?.scrollTo(index)}
//                       className={clsx(
//                         "mx-[3px] inline-block size-2 rounded-full",
//                         {
//                           "bg-black": current === index + 1,
//                           "bg-neutral-400": current !== index + 1,
//                         }
//                       )}
//                     />
//                   ))}
//             </div>
//             <div className="flex items-end justify-end gap-2 md:gap-4">
//               <CarouselPrevious className="static right-0 top-0 size-12 -translate-y-0" />
//               <CarouselNext className="static right-0 top-0 size-12 -translate-y-0" />
//             </div>
//           </div>
//         </Carousel>
//       </div>
//     </section>
//   );
// };

// export const Gallery21Defaults: Gallery21Props = {
//   heading: "New Arrivals",
//   description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
// };
