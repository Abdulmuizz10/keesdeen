import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@relume_io/relume-ui";
import type { CarouselApi } from "@relume_io/relume-ui";
import { RiHeartLine } from "react-icons/ri";
import { RiHeartFill } from "react-icons/ri";
import { useShop } from "../context/ShopContext";
import { Link } from "react-router-dom";
import Axios from "axios";
import { currency, URL } from "../lib/constants";
import { formatAmountDefault } from "../lib/utils";

export const Gallery19: React.FC = () => {
  // const { currentCurrency, formatAmount } = useShop();
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [_, setCurrent] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await Axios.get(`${URL}/products/best-sellers`, {
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

  useEffect(() => {
    if (api) {
      setCurrent(api.selectedScrollSnap() + 1);
      api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));

      // Automatically scroll to next item every 6 seconds
      const autoScroll = setInterval(() => api.scrollNext(), 6000);
      return () => clearInterval(autoScroll);
    }
  }, [api]); // Add products to the dependency array

  return (
    <section>
      <div className="px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container">
          <div className="mb-12 text-center md:mb-18 lg:mb-10">
            <h2 className="mb-5 text-5xl font-semibold md:mb-6 md:text-7xl lg:text-8xl text-gradient">
              Best Sellers
            </h2>
            <p>Our Best Sellers: Where Modesty Meets Unmatched Style.</p>
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
                  ? Array(10)
                      .fill(null)
                      .map((product: any, index: number) => (
                        <CarouselItem
                          key={index}
                          className="basis-full sm:basis-2/4 lg:basis-1/4"
                        >
                          <ProductItem
                            product={product}
                            loading={loading}
                            key={index}
                            formatAmountDefault={formatAmountDefault}
                          />
                        </CarouselItem>
                      ))
                  : products?.map((product: any, index: number) => (
                      <CarouselItem
                        key={index}
                        className="basis-full md:basis-2/4 lg:basis-1/4"
                      >
                        <ProductItem
                          product={product}
                          loading={loading}
                          key={index}
                          formatAmountDefault={formatAmountDefault}
                        />
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
  product: any;
  loading: Boolean;
  formatAmountDefault: any;
}

const ProductItem: React.FC<ProductProps> = ({
  product,
  loading,
  formatAmountDefault,
}) => {
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
            <div className="flex gap-2 items-center justify-center">
              <div className="h-6 w-16 rounded bg-gray-200 animate-pulse" />
              <div className="h-6 w-16 rounded bg-gray-200 animate-pulse" />
            </div>
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
        {wishLists.find((wish: any) => wish._id === product._id) ? (
          <RiHeartFill
            onClick={() => manageWishLists(product)}
            className="text-[22px] text-text-primary"
          />
        ) : (
          <RiHeartLine
            onClick={() => manageWishLists(product)}
            className="text-[22px] text-text-primary"
          />
        )}
      </div>
      <div className="relative">
        <Link to={`/product_details/${product._id}`}>
          <img
            src={image ? product.imageUrls[1] : product.imageUrls[0]}
            alt="Product"
            className="w-full h-auto"
            loading="lazy"
          />
        </Link>
      </div>
      <div className="p-4 text-center">
        <h3 className="text-md xl:text-lg font-semibold text-gray-800 bricolage-grotesque">
          {product.name}
        </h3>
        <div className="flex gap-2 items-center justify-center">
          {product.previousPrice && (
            <s className="text-gray-500">
              {formatAmountDefault(currency, product.previousPrice)}
            </s>
          )}
          <p className="text-gray-500">
            {formatAmountDefault(currency, product.price)}
          </p>
        </div>
        <div className="mt-2">
          <div className="flex flex-wrap gap-1 items-center justify-center">
            {["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"].map(
              (size) => (
                <button
                  key={size}
                  className={`flex items-center justify-center border border-gray-300 rounded-sm text-gray-600 text-[10px] px-1 py-1 h-6 w-8 hover:bg-gray-100 transition poppins ${
                    product.sizes.includes(size) ? "" : "opacity-[0.3]"
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
