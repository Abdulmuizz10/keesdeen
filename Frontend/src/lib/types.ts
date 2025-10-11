export interface AuthState {
  user: any;
  isFetching: boolean;
  error: boolean;
}

export type AuthAction =
  | { type: "ACCESS_START" }
  | { type: "ACCESS_SUCCESS"; payload: any }
  | { type: "ACCESS_FAILURE" }
  | { type: "LOGOUT" };

export interface Review {
  name: string;
  rating: number;
  comment: string;
  user?: string; // Optional since not all reviews include the user ID
}

export interface Product {
  _id: any;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  type: string;
  price: number;
  size: string[]; // Array of size strings, e.g., ["XS", "S", "M", "XL"]
  color: string;
  reviews: Review[];
  bestSeller: boolean;
  newArrival: boolean; // Array of review objects
  isAvailable: boolean;
  gender?: string; // Optional in case it's not always specified
  imageUrls: string[]; // Array of image URLs
  description?: string; // Optional description of the product
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductState {
  products: Product[];
  product: any;
  isFetching: boolean;
  error: boolean;
}

export type ProductAction =
  | { type: "GET_PRODUCTS_START" }
  | { type: "GET_PRODUCTS_SUCCESS"; payload: any[] } // Replace `any[]` with a specific product array type if available
  | { type: "GET_PRODUCTS_FAILURE" }
  | { type: "GET_PRODUCT_START" }
  | { type: "GET_PRODUCT_SUCCESS"; payload: any } // Replace `any[]` with a specific product array type if available
  | { type: "GET_PRODUCT_FAILURE" }
  | { type: "CREATE_PRODUCT_START" }
  | { type: "CREATE_PRODUCT_SUCCESS"; payload: any } // Replace `any` with specific product type if available
  | { type: "CREATE_PRODUCT_FAILURE" }
  | { type: "UPDATE_PRODUCT_START" }
  | { type: "UPDATE_PRODUCT_SUCCESS"; payload: any } // Replace `any` with specific product type if available
  | { type: "UPDATE_PRODUCT_FAILURE" }
  | { type: "CREATE_REVIEW_START" }
  | { type: "CREATE_REVIEW_SUCCESS"; payload: any } // Replace `any` with specific product type if available
  | { type: "CREATE_REVIEW_FAILURE" }
  | { type: "DELETE_PRODUCT_START" }
  | { type: "DELETE_PRODUCT_SUCCESS"; payload: string } // Assuming payload is a product ID (string)
  | { type: "DELETE_PRODUCT_FAILURE" };

export interface OrderState {
  orders: any;
  order: any;
  isFetching: boolean;
  error: boolean;
}

export type OrderAction =
  | { type: "GET_ORDERS_START" }
  | { type: "GET_ORDERS_SUCCESS"; payload: any[] } // Replace `any[]` with a specific product array type if available
  | { type: "GET_ORDERS_FAILURE" }
  | { type: "GET_ORDER_START" }
  | { type: "GET_ORDER_SUCCESS"; payload: any } // Replace `any[]` with a specific product array type if available
  | { type: "GET_ORDER_FAILURE" }
  | { type: "CREATE_ORDER_START" }
  | { type: "CREATE_ORDER_SUCCESS"; payload: any } // Replace `any` with specific product type if available
  | { type: "CREATE_ORDER_FAILURE" }
  | { type: "UPDATE_ORDER_TO_DELIVERED_START" }
  | { type: "UPDATE_ORDER_TO_DELIVERED_SUCCESS"; payload: any } // Replace `any` with specific product type if available
  | { type: "UPDATE_ORDER_TO_DELIVERED_FAILURE" }
  | { type: "LINK_GUEST_ORDERS_START" }
  | { type: "LINK_GUEST_ORDERS_SUCCESS"; payload: any } // Replace `any` with specific product type if available
  | { type: "LINK_GUEST_ORDERS_FAILURE" }
  | { type: "GET_PROFILE_ORDERS_START" }
  | { type: "GET_PROFILE_ORDERS_SUCCESS"; payload: any[] }
  | { type: "GET_PROFILE_ORDERS_FAILURE" }
  | { type: "GET_ORDERS_BY_GUEST_START" }
  | { type: "GET_ORDERS_BY_GUEST_SUCCESS"; payload: any[] } // Assuming payload is a product ID (string)
  | { type: "GET_ORDERS_BY_GUEST_FAILURE" }
  | { type: "LOGOUT_ORDER" };

export interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

// import React, { useEffect, useRef, useState } from "react";
// import { RxChevronDown } from "react-icons/rx";
// import { useShop } from "../../context/ShopContext";
// import {
//   Button,
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@relume_io/relume-ui";
// import ProductItem from "../../components/ProductItem";
// import { useProducts } from "../../context/ProductContext/ProductContext";
// import { Product } from "../../lib/types";
// import Spinner from "../../components/Spinner";
// import { getProducts } from "../../context/ProductContext/ProductApiCalls";

// const ShopAll: React.FC = () => {
//   const { isActive } = useShop();
//   const { products, dispatch, isFetching } = useProducts();
//   useEffect(() => {
//     getProducts(dispatch);
//   }, []);

//   const [showFilter, setShowFilter] = useState(false);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

//   const [category, setCategory] = useState<string[]>([]);
//   const [sizeCategory, setSizeCategory] = useState<string[]>([]);
//   const [colorCategory, setColorCategory] = useState<string[]>([]);
//   const [sortType, setSortType] = useState<string>("Relevance");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 12;

//   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
//   const indexOfLastProduct = currentPage * itemsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
//   const currentProducts = filteredProducts.slice(
//     indexOfFirstProduct,
//     indexOfLastProduct
//   );

//   const paginate = (pageNumber: number) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   const toggleCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (category.includes(e.target.value)) {
//       setCategory((prev) => prev.filter((item) => item !== e.target.value));
//     } else {
//       setCategory((prev) => [...prev, e.target.value]);
//     }
//   };

//   const toggleSizeCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (sizeCategory.includes(e.target.value)) {
//       setSizeCategory((prev) => prev.filter((item) => item !== e.target.value));
//     } else {
//       setSizeCategory((prev) => [...prev, e.target.value]);
//     }
//   };

//   const toggleColorCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (colorCategory.includes(e.target.value)) {
//       setColorCategory((prev) =>
//         prev.filter((item) => item !== e.target.value)
//       );
//     } else {
//       setColorCategory((prev) => [...prev, e.target.value]);
//     }
//   };

//   const applyFilter = () => {
//     let productsCopy = [...(products || [])];

//     if (category.length)
//       productsCopy = productsCopy.filter((item) =>
//         category.includes(item.category)
//       );
//     if (sizeCategory.length)
//       productsCopy = productsCopy.filter((item) =>
//         item.size.some((s: string) => sizeCategory.includes(s))
//       );
//     if (colorCategory.length)
//       productsCopy = productsCopy.filter((item) =>
//         colorCategory.includes(item.color)
//       );

//     setFilteredProducts(productsCopy);
//   };

//   const sortProducts = () => {
//     let spCopy = [...filteredProducts];
//     spCopy.sort((a, b) =>
//       sortType === "Low - High" ? a.price - b.price : b.price - a.price
//     );
//     setFilteredProducts(spCopy);
//   };

//   useEffect(() => {
//     applyFilter();
//   }, [category, sizeCategory, colorCategory, products]);

//   useEffect(() => {
//     sortProducts();
//   }, [sortType]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [currentPage]);

//   const checkboxesRef = useRef<HTMLInputElement[]>([]);

//   const clearFilters = () => {
//     setCategory([]);
//     setSizeCategory([]);
//     setColorCategory([]);
//     checkboxesRef.current.forEach((checkbox) => (checkbox.checked = false));
//   };

//   return (
//     <section className="px-[5%] py-24 md:py-30">
//       <div className="container">
//         <div className="rb-12 mb-12 md:mb-5">
//           <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
//             Shop All
//           </h2>
//           <p className="md:text-md">
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//           </p>
//         </div>
//         <div className="w-full">
//           <div
//             className={`flex flex-col lg:flex-row gap-5 sm:gap-10 pt-5 border-t border-border-secondary ${
//               isActive && "opacity-0 transition-opacity"
//             }`}
//           >
//             {/* Left Side */}
//             <div className="min-w-60">
//               <div
//                 className="flex items-center gap-2"
//                 onClick={() => setShowFilter(!showFilter)}
//               >
//                 <p className="my-2 text-xl flex items-center cursor-pointer gap-2">
//                   Filters
//                 </p>
//                 <RxChevronDown
//                   className={`text-2xl lg:hidden ${
//                     showFilter ? "" : "rotate-180"
//                   }`}
//                 />
//               </div>
//               {/* category Filter */}
//               <div
//                 className={`border border-border-secondary pl-5 py-3 mt-2 ${
//                   showFilter ? "" : "hidden"
//                 } lg:block shadow-medium rounded`}
//               >
//                 <p className="text-base md:text-md pb-3">Product Type</p>
//                 <div className="flex flex-col gap-2 text-sm font-light text-text-primary">
//                   {["Active Wear", "Fitness Accessories"].map((wear, index) => (
//                     <p className="flex gap-2" key={index}>
//                       <input
//                         type="checkbox"
//                         className="w-3 my"
//                         value={wear}
//                         onChange={toggleCategory}
//                         ref={(el) => {
//                           if (el) checkboxesRef.current.push(el);
//                         }}
//                       />
//                       {wear}
//                     </p>
//                   ))}
//                 </div>
//               </div>

//               {/* Size Filter */}
//               <div
//                 className={`border border-border-secondary pl-5 py-3 mt-2 ${
//                   showFilter ? "" : "hidden"
//                 } lg:block shadow-medium rounded`}
//               >
//                 <p className="text-base md:text-md pb-3">Size</p>
//                 <div className="flex flex-col gap-2 text-sm font-light text-text-primary">
//                   {[
//                     "XXS",
//                     "XS",
//                     "S",
//                     "M",
//                     "L",
//                     "XL",
//                     "2XL",
//                     "3XL",
//                     "4XL",
//                     "5XL",
//                   ].map((size, index) => (
//                     <p className="flex gap-2" key={index}>
//                       <input
//                         type="checkbox"
//                         className="w-3"
//                         value={size}
//                         onChange={toggleSizeCategory}
//                         ref={(el) => {
//                           if (el) checkboxesRef.current.push(el);
//                         }}
//                       />
//                       {size}
//                     </p>
//                   ))}
//                 </div>
//               </div>

//               {/* Color Filter */}
//               <div
//                 className={`border border-border-secondary pl-5 py-3 mt-2 ${
//                   showFilter ? "" : "hidden"
//                 } lg:block shadow-medium rounded`}
//               >
//                 <p className="text-base md:text-md pb-3">Colour</p>
//                 <div className="flex flex-col gap-2 text-sm font-light text-text-primary">
//                   {[
//                     "Black",
//                     "Blue",
//                     "Brown",
//                     "Cream",
//                     "Green",
//                     "Grey",
//                     "Pink",
//                     "Purple",
//                     "Red",
//                     "White",
//                   ].map((color, index) => (
//                     <p className="flex gap-2 items-center" key={index}>
//                       <input
//                         type="checkbox"
//                         className="w-3"
//                         value={color}
//                         onChange={toggleColorCategory}
//                         ref={(el) => {
//                           if (el) checkboxesRef.current.push(el);
//                         }}
//                       />
//                       <div
//                         style={{ background: color }}
//                         className={`h-3 w-3 rounded-full ${
//                           color === "WHITE" || "CREAM"
//                             ? "border border-border-primary"
//                             : ""
//                         }`}
//                       ></div>
//                       {color}
//                     </p>
//                   ))}
//                 </div>
//               </div>
//               <Button
//                 className={`my-4 w-full active:bg-gray-700 bg-brand-neutral text-text-light border-none rounded-md ${
//                   showFilter ? "" : "hidden"
//                 } lg:block`}
//                 variant="primary"
//                 onClick={() => {
//                   clearFilters();
//                 }}
//               >
//                 Clear filter
//               </Button>
//             </div>
//             {/* Right Side */}
//             <div className="w-full">
//               <div className="flex-1 flex flex-col gap-5 w-full">
//                 <div className="flex justify-between text-base items-center">
//                   <h3 className="text-base md:text-md">All Collections</h3>
//                   {/* {Product Sort} */}

//                   <p className="info-text hidden xl:flex">
//                     Showing 1 . {filteredProducts.length} of 31 Products
//                   </p>

//                   <div className="md:max-w-xxs max-w-[200px] w-full hidden lg:flex">
//                     <Select onValueChange={setSortType}>
//                       <SelectTrigger className="rounded-md">
//                         <SelectValue placeholder="Sort by price" />
//                       </SelectTrigger>
//                       <SelectContent className=" bg-background-light rounded-lg border border-border-secondary">
//                         <SelectItem
//                           value="relevant"
//                           className=" cursor-pointer hover:text-text-secondary"
//                         >
//                           Sort by: Relevance
//                         </SelectItem>
//                         <SelectItem
//                           value="Low - High"
//                           className=" cursor-pointer  hover:text-text-secondary"
//                         >
//                           Sort by: Low to High
//                         </SelectItem>
//                         <SelectItem
//                           value="High - Low"
//                           className=" cursor-pointer  hover:text-text-secondary"
//                         >
//                           Sort by: High to Low
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className=" max-w-[200px] w-full flex lg:hidden">
//                     <select
//                       className="border-[0.5px] border-border-secondary bg-white py-2 px-4 rounded-sm"
//                       onChange={(e) => setSortType(e.target.value)}
//                     >
//                       <option value="relevant">Sort by: Relevance</option>
//                       <option value="Low - High">Sort by: Low to High</option>
//                       <option value="High - Low">Sort by: High to Low</option>
//                     </select>
//                   </div>
//                 </div>
//                 {/* {Map Products} */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4 gap-4 gap-y-6 w-full">
//                   {products &&
//                     currentProducts?.map((product, index) => (
//                       <ProductItem product={product} key={index} />
//                     ))}
//                 </div>
//               </div>
//               <div className="w-full flex justify-center mt-10">
//                 {isFetching && <Spinner />}
//                 {/* {!isFetching && filteredProducts.length < 1 ? (
//                   <ProductUnavailable />
//                 ) : null} */}
//               </div>
//               {currentProducts.length > 0 && (
//                 <div className="flex justify-center mt-4 poppins">
//                   <button
//                     onClick={() => paginate(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className={`px-4 py-2 mr-2 ${
//                       currentPage === 1 ? "bg-gray-300" : "bg-brand-neutral"
//                     } text-white rounded-lg`}
//                   >
//                     Previous
//                   </button>

//                   {currentPage > 3 && (
//                     <>
//                       <button
//                         onClick={() => paginate(1)}
//                         className="px-4 py-2 bg-white border border-border-primary text-text-primary rounded-lg"
//                       >
//                         1
//                       </button>
//                       <span className="px-4 py-2">...</span>
//                     </>
//                   )}

//                   {Array.from({ length: totalPages }, (_, i) => i + 1)
//                     .filter(
//                       (pageNumber) =>
//                         pageNumber === 1 ||
//                         pageNumber === totalPages ||
//                         (pageNumber >= currentPage - 2 &&
//                           pageNumber <= currentPage + 2)
//                     )
//                     .map((pageNumber) => (
//                       <button
//                         key={pageNumber}
//                         onClick={() => paginate(pageNumber)}
//                         className={`px-4 py-2 ${
//                           currentPage === pageNumber
//                             ? "bg-brand-neutral text-white"
//                             : "bg-white border border-border-primary text-text-primary"
//                         } mx-1 rounded-lg`}
//                       >
//                         {pageNumber}
//                       </button>
//                     ))}

//                   {currentPage < totalPages - 2 && (
//                     <>
//                       <span className="px-4 py-2">...</span>
//                       <button
//                         onClick={() => paginate(totalPages)}
//                         className="px-4 py-2 bg-white border border-border-primary text-text-primary rounded-lg"
//                       >
//                         {totalPages}
//                       </button>
//                     </>
//                   )}

//                   <button
//                     onClick={() => paginate(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className={`px-4 py-2 ml-2 ${
//                       currentPage === totalPages
//                         ? "bg-gray-300"
//                         : "bg-brand-neutral"
//                     } text-white rounded-lg`}
//                   >
//                     Next
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// const ProductUnavailable = () => {
//   return (
//     <p className="text-2xl w-full text-center">Product is not available...</p>
//   );
// };

// export default ShopAll;
