export interface AuthState {
  user: any | User;
  isFetching: boolean;
  error: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: string;
  token: string;
}

export type AuthAction =
  | { type: "ACCESS_START" }
  | { type: "ACCESS_SUCCESS"; payload: User }
  | { type: "ACCESS_FAILURE" }
  | { type: "LOGOUT" };

export interface Review {
  name: string;
  rating: number;
  comment: string;
  user?: string; // Optional since not all reviews include the user ID
}

export interface Product {
  _id: string;
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

export interface Review {
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// import React, { useState } from "react";
// import { ChangeEvent, FormEvent } from "react";
// import {
//   Button,
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@relume_io/relume-ui";
// import { Review } from "../lib/types";
// import { createReview } from "../context/ProductContext/ProductApiCalls";
// import { useProducts } from "../context/ProductContext/ProductContext";

// interface ReviewsProps {
//   reviews: Review[];
//   id: string;
// }

// const Reviews: React.FC<ReviewsProps> = ({ reviews, id }) => {
//   const [change, setChange] = useState<boolean>(true);
//   const [sortOption, setSortOption] = useState<string>("all");
//   const { dispatch } = useProducts();
//   const [currentReviews, setCurrentReviews] = useState<Review[]>(reviews);

//   const [newReview, setNewReview] = useState<Omit<Review, "date">>({
//     name: "",
//     rating: 0,
//     comment: "",
//     createdAt: "",
//     updatedAt: "",
//   });

//   const handleInputChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setNewReview((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     // const today = new Date().toLocaleDateString("en-US", {
//     //   year: "numeric",
//     //   month: "long",
//     //   day: "numeric",
//     // });

//     setCurrentReviews([...currentReviews, { ...newReview }]);
//     createReview({ ...newReview }, id, dispatch);
//     setNewReview({
//       name: "",
//       rating: 0,
//       comment: "",
//       createdAt: "",
//       updatedAt: "",
//     });
//   };

//   const sortReviews = () => {
//     let sortedReviews = [...currentReviews];
//     if (sortOption === "highest") {
//       sortedReviews = sortedReviews.sort((a, b) => b.rating - a.rating);
//     } else if (sortOption === "lowest") {
//       sortedReviews = sortedReviews.sort((a, b) => a.rating - b.rating);
//     } else if (sortOption === "latest") {
//       sortedReviews = sortedReviews.sort(
//         (a, b) =>
//           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//       );
//     } else if (sortOption === "oldest") {
//       sortedReviews = sortedReviews.sort(
//         (a, b) =>
//           new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//       );
//     }
//     return sortedReviews;
//   };

//   return (
//     <>
//       <div className="flex gap-2">
//         <h3
//           className="border border-border-secondary px-5 py-3 text-sm cursor-pointer rounded-md"
//           onClick={() => setChange(false)}
//         >
//           Write your Reviews
//         </h3>
//         <p
//           className="border border-border-secondary px-5 py-3 text-sm cursor-pointer rounded-md"
//           onClick={() => setChange(true)}
//         >
//           All Reviews ({currentReviews && currentReviews?.length})
//         </p>
//       </div>

//       {change ? (
//         <div className="mx-auto shadow-md rounded-lg mt-10">
//           {currentReviews && currentReviews.length > 0 ? (
//             <>
//               <div className="mb-4">
//                 <h2 className="text-2xl font-bold mb-4">All Reviews</h2>
//                 {/* <select
//                   value={sortOption}
//                   onChange={(e) => setSortOption(e.target.value)}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                 >
//                   <option value="all">All</option>
//                   <option value="highest">Highest Rating</option>
//                   <option value="lowest">Lowest Rating</option>
//                   <option value="latest">Latest</option>
//                   <option value="oldest">Oldest</option>
//                 </select> */}

//                 <div className="w-full md:w-1/2 mt-1">
//                   <Select onValueChange={setSortOption}>
//                     <SelectTrigger className="rounded-md">
//                       <SelectValue placeholder="Sort Reviews" />
//                     </SelectTrigger>
//                     <SelectContent className=" bg-background-light rounded-lg border border-border-secondary">
//                       <SelectItem
//                         value="all"
//                         className=" cursor-pointer hover:text-text-secondary
//                       "
//                       >
//                         All
//                       </SelectItem>
//                       <SelectItem
//                         value="highest"
//                         className=" cursor-pointer  hover:text-text-secondary"
//                       >
//                         Highest Rating
//                       </SelectItem>
//                       <SelectItem
//                         value="lowest"
//                         className=" cursor-pointer  hover:text-text-secondary"
//                       >
//                         Lowest Rating
//                       </SelectItem>
//                       <SelectItem
//                         value="latest"
//                         className=" cursor-pointer  hover:text-text-secondary"
//                       >
//                         Latest
//                       </SelectItem>
//                       <SelectItem
//                         value="oldest"
//                         className=" cursor-pointer  hover:text-text-secondary"
//                       >
//                         Oldest
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <ul>
//                 {sortReviews().map((review, index) => (
//                   <li
//                     key={index}
//                     className="mb-6 border-b border-border-secondary pb-4"
//                   >
//                     <div className="flex justify-between">
//                       <h3 className="font-semibold text-lg">{review.name}</h3>
//                       <div className="flex gap-2">
//                         <p className="text-sm text-gray-500 ">
//                           {review.createdAt.split("T")[0]}
//                         </p>
//                         <p className="text-sm text-gray-500 ">
//                           {review.createdAt.split("T")[1]}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center mt-2">
//                       <span className="text-yellow-500 text-xl mr-2">
//                         {"★".repeat(review.rating)}
//                       </span>
//                       <span className="text-gray-400 text-xl">
//                         {"★".repeat(5 - review.rating)}
//                       </span>
//                     </div>
//                     <p className="mt-2 text-gray-700">{review.comment}</p>
//                   </li>
//                 ))}
//               </ul>
//             </>
//           ) : (
//             <p className="text-gray-500">
//               No reviews yet. Be the first to write one!
//             </p>
//           )}
//         </div>
//       ) : (
//         <div className="mx-auto shadow-md rounded-lg mt-10">
//           <h2 className="text-2xl font-bold mb-4">Customer Review</h2>

//           {/* Review Form */}
//           <form onSubmit={handleSubmit} className="mb-8">
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={newReview.name}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                 required
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Rating
//               </label>
//               <input
//                 type="number"
//                 name="rating"
//                 value={newReview.rating}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                 required
//                 min="1"
//                 max="5"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Comment
//               </label>
//               <textarea
//                 name="comment"
//                 value={newReview.comment}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                 rows={4}
//                 required
//               ></textarea>
//             </div>

//             <Button className="rounded-md bg-brand-neutral border-none poppins text-white">
//               Submit Review
//             </Button>
//           </form>
//         </div>
//       )}
//     </>
//   );
// };

// export default Reviews;
