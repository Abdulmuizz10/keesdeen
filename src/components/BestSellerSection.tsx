import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@relume_io/relume-ui";
import type { CarouselApi } from "@relume_io/relume-ui";
import { Product } from "../lib/types";
import { getProducts } from "../context/ProductContext/ProductApiCalls";
import { useProducts } from "../context/ProductContext/ProductContext";
import { RiHeartLine } from "react-icons/ri";
import { RiHeartFill } from "react-icons/ri";
import { useShop } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { formatAmount } from "../lib/utils";

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

  return (
    <section>
      <div className="px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container">
          <div className="mb-12 text-center md:mb-18 lg:mb-10">
            <h2 className="mb-5 text-5xl font-semibold md:mb-6 md:text-7xl lg:text-8xl">
              Best Sellers
            </h2>
          </div>

          <Carousel
            setApi={setApi}
            opts={{
              loop: true,
              align: "start",
            }}
          >
            <div className="relative">
              <CarouselContent className="ml-0">
                {loading
                  ? Array(13)
                      .fill(null)
                      .map((product: Product, index) => (
                        <CarouselItem
                          key={index}
                          className="basis-2/2 md:basis-2/4 lg:basis-1/4"
                        >
                          <ProductItem product={product} loading={loading} />
                        </CarouselItem>
                      ))
                  : products
                      ?.filter(
                        (product: Product) => product.bestSeller === true
                      )
                      .map((product: Product, index) => (
                        <CarouselItem
                          key={index}
                          className="basis-2/2 md:basis-2/4 lg:basis-1/4"
                        >
                          <ProductItem product={product} loading={loading} />
                        </CarouselItem>
                      ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex md:size-12 lg:size-14" />
              <CarouselNext className="hidden md:flex md:size-12 lg:size-14" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

interface ProductProps {
  product: Product;
  loading: Boolean;
}

const ProductItem: React.FC<ProductProps> = ({ product, loading }) => {
  const [image, setImage] = useState<boolean>(false);
  const { manageWishLists, wishLists } = useShop();

  if (loading) {
    return (
      <div className="max-w-xs mx-auto bg-white shadow-large overflow-hidden relative z-[1]">
        <div className="relative">
          <div className="w-full h-[350px] bg-gray-200 animate-pulse" />
        </div>
        <div className="p-4 text-center">
          <div className="flex flex-col gap-2 items-center">
            <div className="h-6 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-6 w-3/5 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="mt-2">
            <div className="flex flex-wrap gap-1 items-center justify-center">
              {[
                "XXS",
                "XS",
                "S",
                "M",
                "L",
                "XL",
                "2XL",
                "3XL",
                "4XL",
                "5XL",
              ].map((size) => (
                <button
                  key={size}
                  className="rounded-sm px-1 py-1 h-6 w-8 bg-gray-200 animate-pulse"
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-xs mx-auto bg-white  shadow-large overflow-hidden relative z-[1px]"
      onMouseOver={() => setImage(true)}
      onMouseLeave={() => setImage(false)}
    >
      <div className="absolute top-3 right-3 z-50 cursor-pointer">
        {wishLists.includes(product._id) ? (
          <RiHeartFill
            onClick={() => manageWishLists(product._id)}
            className="text-xl text-text-primary"
          />
        ) : (
          <RiHeartLine
            onClick={() => manageWishLists(product._id)}
            className="text-xl text-text-primary"
          />
        )}
      </div>
      <div className="relative">
        <Link to={`/product_details/${product._id}`}>
          <img
            src={image ? product.imageUrls[1] : product.imageUrls[0]}
            alt="Product"
            className="w-full h-auto"
          />
        </Link>
      </div>
      <div className="p-4 text-center">
        <h3 className="text-md xl:text-lg font-semibold text-gray-800 bricolage-grotesque">
          {product.name}
        </h3>
        <p className="text-gray-500">{formatAmount(product.price)}</p>

        <div className="mt-2">
          <div className="flex flex-wrap gap-1 items-center justify-center">
            {["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"].map(
              (size) => (
                <button
                  key={size}
                  className={`border border-gray-300 rounded-sm text-gray-600 text-[10px] px-1 py-1 h-6 w-8 hover:bg-gray-100 transition poppins ${
                    product.size.includes(size) ? "" : "opacity-[0.3]"
                  }`}
                >
                  {size}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
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
