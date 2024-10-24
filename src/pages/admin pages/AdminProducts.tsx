// import React, { useState } from "react";

// const AdminProducts: React.FC = () => {
//   // Sample data for products
//   const products = [
//     {
//       name: "Men's T-Shirt",
//       category: "Clothing",
//       price: 25.99,
//       isAvailable: true,
//       date: "01.01.2024",
//     },
//     {
//       name: "Women's Jacket",
//       category: "Clothing",
//       price: 49.99,
//       isAvailable: false,
//       date: "12.12.2023",
//     },
//     {
//       name: "Sneakers",
//       category: "Footwear",
//       price: 79.99,
//       isAvailable: true,
//       date: "15.11.2023",
//     },
//     {
//       name: "Leather Handbag",
//       category: "Accessories",
//       price: 120.0,
//       isAvailable: true,
//       date: "18.10.2023",
//     },
//     {
//       name: "Wool Scarf",
//       category: "Accessories",
//       price: 19.99,
//       isAvailable: false,
//       date: "25.09.2023",
//     },
//     {
//       name: "Men's T-Shirt",
//       category: "Clothing",
//       price: 25.99,
//       isAvailable: true,
//       date: "01.01.2024",
//     },
//     {
//       name: "Women's Jacket",
//       category: "Clothing",
//       price: 49.99,
//       isAvailable: false,
//       date: "12.12.2023",
//     },
//     {
//       name: "Sneakers",
//       category: "Footwear",
//       price: 79.99,
//       isAvailable: true,
//       date: "15.11.2023",
//     },
//     {
//       name: "Leather Handbag",
//       category: "Accessories",
//       price: 120.0,
//       isAvailable: true,
//       date: "18.10.2023",
//     },
//     {
//       name: "Wool Scarf",
//       category: "Accessories",
//       price: 19.99,
//       isAvailable: false,
//       date: "25.09.2023",
//     },
//     {
//       name: "Men's T-Shirt",
//       category: "Clothing",
//       price: 25.99,
//       isAvailable: true,
//       date: "01.01.2024",
//     },
//     {
//       name: "Women's Jacket",
//       category: "Clothing",
//       price: 49.99,
//       isAvailable: false,
//       date: "12.12.2023",
//     },
//     {
//       name: "Sneakers",
//       category: "Footwear",
//       price: 79.99,
//       isAvailable: true,
//       date: "15.11.2023",
//     },
//     {
//       name: "Leather Handbag",
//       category: "Accessories",
//       price: 120.0,
//       isAvailable: true,
//       date: "18.10.2023",
//     },
//     {
//       name: "Wool Scarf",
//       category: "Accessories",
//       price: 19.99,
//       isAvailable: false,
//       date: "25.09.2023",
//     },
//     {
//       name: "Men's T-Shirt",
//       category: "Clothing",
//       price: 25.99,
//       isAvailable: true,
//       date: "01.01.2024",
//     },
//     {
//       name: "Women's Jacket",
//       category: "Clothing",
//       price: 49.99,
//       isAvailable: false,
//       date: "12.12.2023",
//     },
//     {
//       name: "Sneakers",
//       category: "Footwear",
//       price: 79.99,
//       isAvailable: true,
//       date: "15.11.2023",
//     },
//     {
//       name: "Leather Handbag",
//       category: "Accessories",
//       price: 120.0,
//       isAvailable: true,
//       date: "18.10.2023",
//     },
//     {
//       name: "Wool Scarf",
//       category: "Accessories",
//       price: 19.99,
//       isAvailable: false,
//       date: "25.09.2023",
//     },
//     {
//       name: "Men's T-Shirt",
//       category: "Clothing",
//       price: 25.99,
//       isAvailable: true,
//       date: "01.01.2024",
//     },
//     {
//       name: "Women's Jacket",
//       category: "Clothing",
//       price: 49.99,
//       isAvailable: false,
//       date: "12.12.2023",
//     },
//     {
//       name: "Sneakers",
//       category: "Footwear",
//       price: 79.99,
//       isAvailable: true,
//       date: "15.11.2023",
//     },
//     {
//       name: "Leather Handbag",
//       category: "Accessories",
//       price: 120.0,
//       isAvailable: true,
//       date: "18.10.2023",
//     },
//     {
//       name: "Wool Scarf",
//       category: "Accessories",
//       price: 19.99,
//       isAvailable: false,
//       date: "25.09.2023",
//     },
//     {
//       name: "Men's T-Shirt",
//       category: "Clothing",
//       price: 25.99,
//       isAvailable: true,
//       date: "01.01.2024",
//     },
//     {
//       name: "Women's Jacket",
//       category: "Clothing",
//       price: 49.99,
//       isAvailable: false,
//       date: "12.12.2023",
//     },
//     {
//       name: "Sneakers",
//       category: "Footwear",
//       price: 79.99,
//       isAvailable: true,
//       date: "15.11.2023",
//     },
//     {
//       name: "Leather Handbag",
//       category: "Accessories",
//       price: 120.0,
//       isAvailable: true,
//       date: "18.10.2023",
//     },
//     {
//       name: "Wool Scarf",
//       category: "Accessories",
//       price: 19.99,
//       isAvailable: false,
//       date: "25.09.2023",
//     },
//     {
//       name: "Men's T-Shirt",
//       category: "Clothing",
//       price: 25.99,
//       isAvailable: true,
//       date: "01.01.2024",
//     },
//     {
//       name: "Women's Jacket",
//       category: "Clothing",
//       price: 49.99,
//       isAvailable: false,
//       date: "12.12.2023",
//     },
//     {
//       name: "Sneakers",
//       category: "Footwear",
//       price: 79.99,
//       isAvailable: true,
//       date: "15.11.2023",
//     },
//     {
//       name: "Leather Handbag",
//       category: "Accessories",
//       price: 120.0,
//       isAvailable: true,
//       date: "18.10.2023",
//     },
//     {
//       name: "Wool Scarf",
//       category: "Accessories",
//       price: 19.99,
//       isAvailable: false,
//       date: "25.09.2023",
//     },
//     {
//       name: "Men's T-Shirt",
//       category: "Clothing",
//       price: 25.99,
//       isAvailable: true,
//       date: "01.01.2024",
//     },
//     {
//       name: "Women's Jacket",
//       category: "Clothing",
//       price: 49.99,
//       isAvailable: false,
//       date: "12.12.2023",
//     },
//     {
//       name: "Sneakers",
//       category: "Footwear",
//       price: 79.99,
//       isAvailable: true,
//       date: "15.11.2023",
//     },
//     {
//       name: "Leather Handbag",
//       category: "Accessories",
//       price: 120.0,
//       isAvailable: true,
//       date: "18.10.2023",
//     },
//     {
//       name: "Wool Scarf",
//       category: "Accessories",
//       price: 19.99,
//       isAvailable: false,
//       date: "25.09.2023",
//     },
//     {
//       name: "Men's T-Shirt",
//       category: "Clothing",
//       price: 25.99,
//       isAvailable: true,
//       date: "01.01.2024",
//     },
//     {
//       name: "Women's Jacket",
//       category: "Clothing",
//       price: 49.99,
//       isAvailable: false,
//       date: "12.12.2023",
//     },
//     {
//       name: "Sneakers",
//       category: "Footwear",
//       price: 79.99,
//       isAvailable: true,
//       date: "15.11.2023",
//     },
//     {
//       name: "Leather Handbag",
//       category: "Accessories",
//       price: 120.0,
//       isAvailable: true,
//       date: "18.10.2023",
//     },
//     {
//       name: "Wool Scarf",
//       category: "Accessories",
//       price: 19.99,
//       isAvailable: false,
//       date: "25.09.2023",
//     },
//     // You can add more products here for better pagination testing
//   ];

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10; // Change this to however many items you want per page

//   // Calculate the total number of pages
//   const totalPages = Math.ceil(products.length / itemsPerPage);

//   // Calculate the index of the first and last items on the current page
//   const indexOfLastProduct = currentPage * itemsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;

//   // Get the products for the current page
//   const currentProducts = products.slice(
//     indexOfFirstProduct,
//     indexOfLastProduct
//   );

//   // Pagination function
//   const paginate = (pageNumber: number) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   return (
//     <div className="w-full">
//       {/* Product List */}
//       <div className="w-full bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
//         <h3 className="text-xl font-semibold mb-4">Product List</h3>

//         <div className="overflow-x-auto">
//           <table className="w-full bg-white">
//             <thead>
//               <tr className="bg-gray-100 rounded-t-xl font-extrabold bricolage-grotesque">
//                 <th className="text-left p-4 font-semibold first:rounded-tl-xl last:rounded-tr-xl">
//                   Product
//                 </th>
//                 <th className="text-left p-4 font-semibold">Category</th>
//                 <th className="text-left p-4 font-semibold">Price</th>
//                 <th className="text-left p-4 font-semibold">Availability</th>
//                 <th className="text-left p-4 font-semibold rounded-tr-xl">
//                   Date Added
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentProducts.map((product, index) => (
//                 <tr
//                   key={index}
//                   className="border-b hover:bg-gray-50 transition-colors duration-150 poppins"
//                 >
//                   <td className="flex items-center space-x-4 p-4">
//                     <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
//                     <p className="font-semibold">{product.name}</p>
//                   </td>
//                   <td className="p-4 text-sm">{product.category}</td>
//                   <td className="p-4 text-sm">${product.price.toFixed(2)}</td>
//                   <td className="p-4">
//                     <span
//                       className={`px-4 py-1 rounded-full text-sm ${
//                         product.isAvailable
//                           ? "bg-green-200 text-green-800"
//                           : "bg-red-200 text-red-800"
//                       }`}
//                     >
//                       {product.isAvailable ? "Available" : "Out of Stock"}
//                     </span>
//                   </td>
//                   <td className="p-4 text-base font-semibold">
//                     {product.date}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination Controls */}
//         <div className="flex justify-end mt-4 poppins">
//           <button
//             onClick={() => paginate(currentPage - 1)}
//             disabled={currentPage === 1}
//             className={`px-4 py-2 mr-2 ${
//               currentPage === 1 ? "bg-gray-300" : "bg-brand-neutral"
//             } text-white rounded-lg`}
//           >
//             Previous
//           </button>

//           {currentPage > 3 && (
//             <>
//               <button className="px-4 py-2 bg-white border border-border-primary text-text-primary rounded-lg">
//                 1
//               </button>
//               <span className="px-4 py-2">...</span>
//             </>
//           )}

//           {Array.from({ length: totalPages }, (_, i) => i + 1)
//             .filter(
//               (pageNumber) =>
//                 pageNumber === 1 ||
//                 pageNumber === totalPages ||
//                 (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
//             )
//             .map((pageNumber) => (
//               <button
//                 key={pageNumber}
//                 onClick={() => paginate(pageNumber)}
//                 className={`px-4 py-2 ${
//                   currentPage === pageNumber
//                     ? "bg-brand-neutral text-white"
//                     : "bg-white border border-border-primary text-text-primary"
//                 } mx-1 rounded-lg`}
//               >
//                 {pageNumber}
//               </button>
//             ))}

//           {currentPage < totalPages - 2 && (
//             <>
//               <span className="px-4 py-2">...</span>
//               <button
//                 onClick={() => paginate(totalPages)}
//                 className="px-4 py-2 bg-white border border-border-primary text-text-primary rounded-lg"
//               >
//                 {totalPages}
//               </button>
//             </>
//           )}

//           <button
//             onClick={() => paginate(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className={`px-4 py-2 ml-2 ${
//               currentPage === totalPages ? "bg-gray-300" : "bg-brand-neutral"
//             } text-white rounded-lg`}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminProducts;

import React, { useState } from "react";
import { formatAmount } from "../../lib/utils";

const AdminProducts: React.FC = () => {
  // Sample data for products with initial availability state
  const [products, setProducts] = useState([
    {
      name: "Men's T-Shirt",
      category: "Clothing",
      price: 25.99,
      isAvailable: true,
      date: "01.01.2024",
    },
    {
      name: "Women's Jacket",
      category: "Clothing",
      price: 49.99,
      isAvailable: false,
      date: "12.12.2023",
    },
    {
      name: "Sneakers",
      category: "Footwear",
      price: 79.99,
      isAvailable: true,
      date: "15.11.2023",
    },
    {
      name: "Leather Handbag",
      category: "Accessories",
      price: 120.0,
      isAvailable: true,
      date: "18.10.2023",
    },
    {
      name: "Wool Scarf",
      category: "Accessories",
      price: 19.99,
      isAvailable: false,
      date: "25.09.2023",
    },
    {
      name: "Men's T-Shirt",
      category: "Clothing",
      price: 25.99,
      isAvailable: true,
      date: "01.01.2024",
    },
    {
      name: "Women's Jacket",
      category: "Clothing",
      price: 49.99,
      isAvailable: false,
      date: "12.12.2023",
    },
    {
      name: "Sneakers",
      category: "Footwear",
      price: 79.99,
      isAvailable: true,
      date: "15.11.2023",
    },
    {
      name: "Leather Handbag",
      category: "Accessories",
      price: 120.0,
      isAvailable: true,
      date: "18.10.2023",
    },
    {
      name: "Wool Scarf",
      category: "Accessories",
      price: 19.99,
      isAvailable: false,
      date: "25.09.2023",
    },
    {
      name: "Men's T-Shirt",
      category: "Clothing",
      price: 25.99,
      isAvailable: true,
      date: "01.01.2024",
    },
    {
      name: "Women's Jacket",
      category: "Clothing",
      price: 49.99,
      isAvailable: false,
      date: "12.12.2023",
    },
    {
      name: "Sneakers",
      category: "Footwear",
      price: 79.99,
      isAvailable: true,
      date: "15.11.2023",
    },
    {
      name: "Leather Handbag",
      category: "Accessories",
      price: 120.0,
      isAvailable: true,
      date: "18.10.2023",
    },
    {
      name: "Wool Scarf",
      category: "Accessories",
      price: 19.99,
      isAvailable: false,
      date: "25.09.2023",
    },
    {
      name: "Men's T-Shirt",
      category: "Clothing",
      price: 25.99,
      isAvailable: true,
      date: "01.01.2024",
    },
    {
      name: "Women's Jacket",
      category: "Clothing",
      price: 49.99,
      isAvailable: false,
      date: "12.12.2023",
    },
    {
      name: "Sneakers",
      category: "Footwear",
      price: 79.99,
      isAvailable: true,
      date: "15.11.2023",
    },
    {
      name: "Leather Handbag",
      category: "Accessories",
      price: 120.0,
      isAvailable: true,
      date: "18.10.2023",
    },
    {
      name: "Wool Scarf",
      category: "Accessories",
      price: 19.99,
      isAvailable: false,
      date: "25.09.2023",
    },
    {
      name: "Men's T-Shirt",
      category: "Clothing",
      price: 25.99,
      isAvailable: true,
      date: "01.01.2024",
    },
    {
      name: "Women's Jacket",
      category: "Clothing",
      price: 49.99,
      isAvailable: false,
      date: "12.12.2023",
    },
    {
      name: "Sneakers",
      category: "Footwear",
      price: 79.99,
      isAvailable: true,
      date: "15.11.2023",
    },
    {
      name: "Leather Handbag",
      category: "Accessories",
      price: 120.0,
      isAvailable: true,
      date: "18.10.2023",
    },
    {
      name: "Wool Scarf",
      category: "Accessories",
      price: 19.99,
      isAvailable: false,
      date: "25.09.2023",
    },
    {
      name: "Men's T-Shirt",
      category: "Clothing",
      price: 25.99,
      isAvailable: true,
      date: "01.01.2024",
    },
    {
      name: "Women's Jacket",
      category: "Clothing",
      price: 49.99,
      isAvailable: false,
      date: "12.12.2023",
    },
    {
      name: "Sneakers",
      category: "Footwear",
      price: 79.99,
      isAvailable: true,
      date: "15.11.2023",
    },
    {
      name: "Leather Handbag",
      category: "Accessories",
      price: 120.0,
      isAvailable: true,
      date: "18.10.2023",
    },
    {
      name: "Wool Scarf",
      category: "Accessories",
      price: 19.99,
      isAvailable: false,
      date: "25.09.2023",
    },
    {
      name: "Men's T-Shirt",
      category: "Clothing",
      price: 25.99,
      isAvailable: true,
      date: "01.01.2024",
    },
    {
      name: "Women's Jacket",
      category: "Clothing",
      price: 49.99,
      isAvailable: false,
      date: "12.12.2023",
    },
    {
      name: "Sneakers",
      category: "Footwear",
      price: 79.99,
      isAvailable: true,
      date: "15.11.2023",
    },
    {
      name: "Leather Handbag",
      category: "Accessories",
      price: 120.0,
      isAvailable: true,
      date: "18.10.2023",
    },
    {
      name: "Wool Scarf",
      category: "Accessories",
      price: 19.99,
      isAvailable: false,
      date: "25.09.2023",
    },
    {
      name: "Men's T-Shirt",
      category: "Clothing",
      price: 25.99,
      isAvailable: true,
      date: "01.01.2024",
    },
    {
      name: "Women's Jacket",
      category: "Clothing",
      price: 49.99,
      isAvailable: false,
      date: "12.12.2023",
    },
    {
      name: "Sneakers",
      category: "Footwear",
      price: 79.99,
      isAvailable: true,
      date: "15.11.2023",
    },
    {
      name: "Leather Handbag",
      category: "Accessories",
      price: 120.0,
      isAvailable: true,
      date: "18.10.2023",
    },
    {
      name: "Wool Scarf",
      category: "Accessories",
      price: 19.99,
      isAvailable: false,
      date: "25.09.2023",
    },
    {
      name: "Men's T-Shirt",
      category: "Clothing",
      price: 25.99,
      isAvailable: true,
      date: "01.01.2024",
    },
    {
      name: "Women's Jacket",
      category: "Clothing",
      price: 49.99,
      isAvailable: false,
      date: "12.12.2023",
    },
    {
      name: "Sneakers",
      category: "Footwear",
      price: 79.99,
      isAvailable: true,
      date: "15.11.2023",
    },
    {
      name: "Leather Handbag",
      category: "Accessories",
      price: 120.0,
      isAvailable: true,
      date: "18.10.2023",
    },
    {
      name: "Wool Scarf",
      category: "Accessories",
      price: 19.99,
      isAvailable: false,
      date: "25.09.2023",
    },
    {
      name: "Men's T-Shirt",
      category: "Clothing",
      price: 25.99,
      isAvailable: true,
      date: "01.01.2024",
    },
    {
      name: "Women's Jacket",
      category: "Clothing",
      price: 49.99,
      isAvailable: false,
      date: "12.12.2023",
    },
    {
      name: "Sneakers",
      category: "Footwear",
      price: 79.99,
      isAvailable: true,
      date: "15.11.2023",
    },
    {
      name: "Leather Handbag",
      category: "Accessories",
      price: 120.0,
      isAvailable: true,
      date: "18.10.2023",
    },
    {
      name: "Wool Scarf",
      category: "Accessories",
      price: 19.99,
      isAvailable: false,
      date: "25.09.2023",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Function to handle availability toggle
  const handleAvailabilityChange = (index: number, value: string) => {
    const updatedProducts = [...products];
    updatedProducts[index].isAvailable = value === "In Stock";
    setProducts(updatedProducts);
  };

  return (
    <div className="w-full">
      <div className="w-full bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold mb-4">Product List</h3>
        <div className="overflow-x-auto">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-gray-100 rounded-t-xl font-extrabold bricolage-grotesque">
                <th className="text-left p-4 font-semibold first:rounded-tl-xl last:rounded-tr-xl">
                  Product
                </th>
                <th className="text-left p-4 font-semibold">Category</th>
                <th className="text-left p-4 font-semibold">Price</th>
                <th className="text-left p-4 font-semibold">Availability</th>
                <th className="text-left p-4 font-semibold rounded-tr-xl">
                  Date Added
                </th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition-colors duration-150 poppins"
                >
                  <td className="flex items-center space-x-4 p-4">
                    <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                    <p className="font-semibold">{product.name}</p>
                  </td>
                  <td className="p-4 text-sm">{product.category}</td>
                  <td className="p-4 text-sm">{formatAmount(product.price)}</td>
                  <td className="p-4">
                    <select
                      value={product.isAvailable ? "In Stock" : "Out of Stock"}
                      onChange={(e) =>
                        handleAvailabilityChange(index, e.target.value)
                      }
                      className="border border-gray-300  p-1 focus:ring-none"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </td>
                  <td className="p-4 text-base font-semibold">
                    {product.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-end mt-4 poppins">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 mr-2 ${
              currentPage === 1 ? "bg-gray-300" : "bg-brand-neutral"
            } text-white rounded-lg`}
          >
            Previous
          </button>

          {currentPage > 3 && (
            <>
              <button className="px-4 py-2 bg-white border border-border-primary text-text-primary rounded-lg">
                1
              </button>
              <span className="px-4 py-2">...</span>
            </>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (pageNumber) =>
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
            )
            .map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`px-4 py-2 ${
                  currentPage === pageNumber
                    ? "bg-brand-neutral text-white"
                    : "bg-white border border-border-primary text-text-primary"
                } mx-1 rounded-lg`}
              >
                {pageNumber}
              </button>
            ))}

          {currentPage < totalPages - 2 && (
            <>
              <span className="px-4 py-2">...</span>
              <button
                onClick={() => paginate(totalPages)}
                className="px-4 py-2 bg-white border border-border-primary text-text-primary rounded-lg"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 ml-2 ${
              currentPage === totalPages ? "bg-gray-300" : "bg-brand-neutral"
            } text-white rounded-lg`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
