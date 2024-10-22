// import React, { useState } from "react";

// const AdminOrders: React.FC = () => {
//   // Sample data for orders
//   const orders = [
//     {
//       orderId: "ORD001",
//       customerName: "John Doe",
//       totalAmount: 150.0,
//       status: "Shipped",
//       date: "01.01.2024",
//     },
//     {
//       orderId: "ORD002",
//       customerName: "Jane Smith",
//       totalAmount: 75.99,
//       status: "Processing",
//       date: "02.01.2024",
//     },
//     {
//       orderId: "ORD003",
//       customerName: "Alice Johnson",
//       totalAmount: 200.5,
//       status: "Delivered",
//       date: "03.01.2024",
//     },
//     {
//       orderId: "ORD004",
//       customerName: "Bob Brown",
//       totalAmount: 50.0,
//       status: "Cancelled",
//       date: "04.01.2024",
//     },
//     {
//       orderId: "ORD005",
//       customerName: "Charlie Davis",
//       totalAmount: 120.0,
//       status: "Shipped",
//       date: "05.01.2024",
//     },
//     {
//       orderId: "ORD006",
//       customerName: "Eve Adams",
//       totalAmount: 60.0,
//       status: "Processing",
//       date: "06.01.2024",
//     },
//     {
//       orderId: "ORD001",
//       customerName: "John Doe",
//       totalAmount: 150.0,
//       status: "Shipped",
//       date: "01.01.2024",
//     },
//     {
//       orderId: "ORD002",
//       customerName: "Jane Smith",
//       totalAmount: 75.99,
//       status: "Processing",
//       date: "02.01.2024",
//     },
//     {
//       orderId: "ORD003",
//       customerName: "Alice Johnson",
//       totalAmount: 200.5,
//       status: "Delivered",
//       date: "03.01.2024",
//     },
//     {
//       orderId: "ORD004",
//       customerName: "Bob Brown",
//       totalAmount: 50.0,
//       status: "Cancelled",
//       date: "04.01.2024",
//     },
//     {
//       orderId: "ORD005",
//       customerName: "Charlie Davis",
//       totalAmount: 120.0,
//       status: "Shipped",
//       date: "05.01.2024",
//     },
//     {
//       orderId: "ORD006",
//       customerName: "Eve Adams",
//       totalAmount: 60.0,
//       status: "Processing",
//       date: "06.01.2024",
//     },
//     {
//       orderId: "ORD001",
//       customerName: "John Doe",
//       totalAmount: 150.0,
//       status: "Shipped",
//       date: "01.01.2024",
//     },
//     {
//       orderId: "ORD002",
//       customerName: "Jane Smith",
//       totalAmount: 75.99,
//       status: "Processing",
//       date: "02.01.2024",
//     },
//     {
//       orderId: "ORD003",
//       customerName: "Alice Johnson",
//       totalAmount: 200.5,
//       status: "Delivered",
//       date: "03.01.2024",
//     },
//     {
//       orderId: "ORD004",
//       customerName: "Bob Brown",
//       totalAmount: 50.0,
//       status: "Cancelled",
//       date: "04.01.2024",
//     },
//     {
//       orderId: "ORD005",
//       customerName: "Charlie Davis",
//       totalAmount: 120.0,
//       status: "Shipped",
//       date: "05.01.2024",
//     },
//     {
//       orderId: "ORD006",
//       customerName: "Eve Adams",
//       totalAmount: 60.0,
//       status: "Processing",
//       date: "06.01.2024",
//     },
//     {
//       orderId: "ORD001",
//       customerName: "John Doe",
//       totalAmount: 150.0,
//       status: "Shipped",
//       date: "01.01.2024",
//     },
//     {
//       orderId: "ORD002",
//       customerName: "Jane Smith",
//       totalAmount: 75.99,
//       status: "Processing",
//       date: "02.01.2024",
//     },
//     {
//       orderId: "ORD003",
//       customerName: "Alice Johnson",
//       totalAmount: 200.5,
//       status: "Delivered",
//       date: "03.01.2024",
//     },
//     {
//       orderId: "ORD004",
//       customerName: "Bob Brown",
//       totalAmount: 50.0,
//       status: "Cancelled",
//       date: "04.01.2024",
//     },
//     {
//       orderId: "ORD005",
//       customerName: "Charlie Davis",
//       totalAmount: 120.0,
//       status: "Shipped",
//       date: "05.01.2024",
//     },
//     {
//       orderId: "ORD006",
//       customerName: "Eve Adams",
//       totalAmount: 60.0,
//       status: "Processing",
//       date: "06.01.2024",
//     },
//     {
//       orderId: "ORD001",
//       customerName: "John Doe",
//       totalAmount: 150.0,
//       status: "Shipped",
//       date: "01.01.2024",
//     },
//     {
//       orderId: "ORD002",
//       customerName: "Jane Smith",
//       totalAmount: 75.99,
//       status: "Processing",
//       date: "02.01.2024",
//     },
//     {
//       orderId: "ORD003",
//       customerName: "Alice Johnson",
//       totalAmount: 200.5,
//       status: "Delivered",
//       date: "03.01.2024",
//     },
//     {
//       orderId: "ORD004",
//       customerName: "Bob Brown",
//       totalAmount: 50.0,
//       status: "Cancelled",
//       date: "04.01.2024",
//     },
//     {
//       orderId: "ORD005",
//       customerName: "Charlie Davis",
//       totalAmount: 120.0,
//       status: "Shipped",
//       date: "05.01.2024",
//     },
//     {
//       orderId: "ORD006",
//       customerName: "Eve Adams",
//       totalAmount: 60.0,
//       status: "Processing",
//       date: "06.01.2024",
//     },
//     {
//       orderId: "ORD001",
//       customerName: "John Doe",
//       totalAmount: 150.0,
//       status: "Shipped",
//       date: "01.01.2024",
//     },
//     {
//       orderId: "ORD002",
//       customerName: "Jane Smith",
//       totalAmount: 75.99,
//       status: "Processing",
//       date: "02.01.2024",
//     },
//     {
//       orderId: "ORD003",
//       customerName: "Alice Johnson",
//       totalAmount: 200.5,
//       status: "Delivered",
//       date: "03.01.2024",
//     },
//     {
//       orderId: "ORD004",
//       customerName: "Bob Brown",
//       totalAmount: 50.0,
//       status: "Cancelled",
//       date: "04.01.2024",
//     },
//     {
//       orderId: "ORD005",
//       customerName: "Charlie Davis",
//       totalAmount: 120.0,
//       status: "Shipped",
//       date: "05.01.2024",
//     },
//     {
//       orderId: "ORD006",
//       customerName: "Eve Adams",
//       totalAmount: 60.0,
//       status: "Processing",
//       date: "06.01.2024",
//     },
//     // Add more orders here for better pagination testing
//   ];

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 8; // Change this to however many items you want per page

//   // Calculate the total number of pages
//   const totalPages = Math.ceil(orders.length / itemsPerPage);

//   // Calculate the index of the first and last items on the current page
//   const indexOfLastOrder = currentPage * itemsPerPage;
//   const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;

//   // Get the orders for the current page
//   const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

//   // Pagination function
//   const paginate = (pageNumber: number) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   return (
//     <div className="w-full">
//       {/* Order List */}
//       <div className="w-full bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
//         <h3 className="text-xl font-semibold mb-4">Order List</h3>

//         <div className="overflow-x-auto">
//           <table className="w-full bg-white">
//             <thead>
//               <tr className="bg-gray-100 rounded-t-xl font-extrabold bricolage-grotesque">
//                 <th className="text-left p-4 font-semibold first:rounded-tl-xl last:rounded-tr-xl">
//                   Order ID
//                 </th>
//                 <th className="text-left p-4 font-semibold">Customer Name</th>
//                 <th className="text-left p-4 font-semibold">Total Amount</th>
//                 <th className="text-left p-4 font-semibold">Status</th>
//                 <th className="text-left p-4 font-semibold rounded-tr-xl">
//                   Date
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentOrders.map((order, index) => (
//                 <tr
//                   key={index}
//                   className="border-b hover:bg-gray-50 transition-colors duration-150 poppins"
//                 >
//                   <td className="p-4 font-semibold">{order.orderId}</td>
//                   <td className="p-4">{order.customerName}</td>
//                   <td className="p-4">${order.totalAmount.toFixed(2)}</td>
//                   <td className="p-4">
//                     <span
//                       className={`px-4 py-1 rounded-full text-sm ${
//                         order.status === "Shipped"
//                           ? "bg-green-200 text-green-800"
//                           : order.status === "Processing"
//                           ? "bg-yellow-200 text-yellow-800"
//                           : order.status === "Delivered"
//                           ? "bg-blue-200 text-blue-800"
//                           : "bg-red-200 text-red-800"
//                       }`}
//                     >
//                       {order.status}
//                     </span>
//                   </td>
//                   <td className="p-4 text-base font-semibold">{order.date}</td>
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

// export default AdminOrders;

import React, { useState } from "react";

const AdminOrders: React.FC = () => {
  // Sample data for orders
  const initialOrders = [
    {
      orderId: "ORD001",
      customerName: "John Doe",
      totalAmount: 150.0,
      status: "Shipped",
      date: "01.01.2024",
    },
    {
      orderId: "ORD002",
      customerName: "Jane Smith",
      totalAmount: 75.99,
      status: "Processing",
      date: "02.01.2024",
    },
    {
      orderId: "ORD001",
      customerName: "John Doe",
      totalAmount: 150.0,
      status: "Shipped",
      date: "01.01.2024",
    },
    {
      orderId: "ORD002",
      customerName: "Jane Smith",
      totalAmount: 75.99,
      status: "Processing",
      date: "02.01.2024",
    },
    {
      orderId: "ORD003",
      customerName: "Alice Johnson",
      totalAmount: 200.5,
      status: "Delivered",
      date: "03.01.2024",
    },
    {
      orderId: "ORD004",
      customerName: "Bob Brown",
      totalAmount: 50.0,
      status: "Cancelled",
      date: "04.01.2024",
    },
    {
      orderId: "ORD005",
      customerName: "Charlie Davis",
      totalAmount: 120.0,
      status: "Shipped",
      date: "05.01.2024",
    },
    {
      orderId: "ORD006",
      customerName: "Eve Adams",
      totalAmount: 60.0,
      status: "Processing",
      date: "06.01.2024",
    },
    {
      orderId: "ORD001",
      customerName: "John Doe",
      totalAmount: 150.0,
      status: "Shipped",
      date: "01.01.2024",
    },
    {
      orderId: "ORD002",
      customerName: "Jane Smith",
      totalAmount: 75.99,
      status: "Processing",
      date: "02.01.2024",
    },
    {
      orderId: "ORD003",
      customerName: "Alice Johnson",
      totalAmount: 200.5,
      status: "Delivered",
      date: "03.01.2024",
    },
    {
      orderId: "ORD004",
      customerName: "Bob Brown",
      totalAmount: 50.0,
      status: "Cancelled",
      date: "04.01.2024",
    },
    {
      orderId: "ORD005",
      customerName: "Charlie Davis",
      totalAmount: 120.0,
      status: "Shipped",
      date: "05.01.2024",
    },
    {
      orderId: "ORD006",
      customerName: "Eve Adams",
      totalAmount: 60.0,
      status: "Processing",
      date: "06.01.2024",
    },
    {
      orderId: "ORD001",
      customerName: "John Doe",
      totalAmount: 150.0,
      status: "Shipped",
      date: "01.01.2024",
    },
    {
      orderId: "ORD002",
      customerName: "Jane Smith",
      totalAmount: 75.99,
      status: "Processing",
      date: "02.01.2024",
    },
    {
      orderId: "ORD003",
      customerName: "Alice Johnson",
      totalAmount: 200.5,
      status: "Delivered",
      date: "03.01.2024",
    },
    {
      orderId: "ORD004",
      customerName: "Bob Brown",
      totalAmount: 50.0,
      status: "Cancelled",
      date: "04.01.2024",
    },
    {
      orderId: "ORD005",
      customerName: "Charlie Davis",
      totalAmount: 120.0,
      status: "Shipped",
      date: "05.01.2024",
    },
    {
      orderId: "ORD006",
      customerName: "Eve Adams",
      totalAmount: 60.0,
      status: "Processing",
      date: "06.01.2024",
    },
    {
      orderId: "ORD001",
      customerName: "John Doe",
      totalAmount: 150.0,
      status: "Shipped",
      date: "01.01.2024",
    },
    {
      orderId: "ORD002",
      customerName: "Jane Smith",
      totalAmount: 75.99,
      status: "Processing",
      date: "02.01.2024",
    },
    {
      orderId: "ORD003",
      customerName: "Alice Johnson",
      totalAmount: 200.5,
      status: "Delivered",
      date: "03.01.2024",
    },
    {
      orderId: "ORD004",
      customerName: "Bob Brown",
      totalAmount: 50.0,
      status: "Cancelled",
      date: "04.01.2024",
    },
    {
      orderId: "ORD005",
      customerName: "Charlie Davis",
      totalAmount: 120.0,
      status: "Shipped",
      date: "05.01.2024",
    },
    {
      orderId: "ORD006",
      customerName: "Eve Adams",
      totalAmount: 60.0,
      status: "Processing",
      date: "06.01.2024",
    },
    {
      orderId: "ORD001",
      customerName: "John Doe",
      totalAmount: 150.0,
      status: "Shipped",
      date: "01.01.2024",
    },
    {
      orderId: "ORD002",
      customerName: "Jane Smith",
      totalAmount: 75.99,
      status: "Processing",
      date: "02.01.2024",
    },
    {
      orderId: "ORD003",
      customerName: "Alice Johnson",
      totalAmount: 200.5,
      status: "Delivered",
      date: "03.01.2024",
    },
    {
      orderId: "ORD004",
      customerName: "Bob Brown",
      totalAmount: 50.0,
      status: "Cancelled",
      date: "04.01.2024",
    },
    {
      orderId: "ORD005",
      customerName: "Charlie Davis",
      totalAmount: 120.0,
      status: "Shipped",
      date: "05.01.2024",
    },
    {
      orderId: "ORD006",
      customerName: "Eve Adams",
      totalAmount: 60.0,
      status: "Processing",
      date: "06.01.2024",
    },
    {
      orderId: "ORD001",
      customerName: "John Doe",
      totalAmount: 150.0,
      status: "Shipped",
      date: "01.01.2024",
    },
    {
      orderId: "ORD002",
      customerName: "Jane Smith",
      totalAmount: 75.99,
      status: "Processing",
      date: "02.01.2024",
    },
    // ... (other orders)
  ];

  const [orders, setOrders] = useState(initialOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="w-full">
      <div className="w-full bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold mb-4">Order List</h3>
        <div className="overflow-x-auto">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-gray-100 rounded-t-xl font-extrabold bricolage-grotesque">
                <th className="text-left p-4">Order ID</th>
                <th className="text-left p-4">Customer Name</th>
                <th className="text-left p-4">Total Amount</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4 rounded-tr-xl">Date</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition-colors duration-150 poppins"
                >
                  <td className="p-4 font-semibold">{order.orderId}</td>
                  <td className="p-4">{order.customerName}</td>
                  <td className="p-4">${order.totalAmount.toFixed(2)}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.orderId, e.target.value)
                      }
                      className="border border-gray-300  p-1 focus:ring-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 text-base font-semibold">{order.date}</td>
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

export default AdminOrders;
