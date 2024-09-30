// import React from "react";
// import { useTable, Column } from "react-table";

// interface Order {
//   id: number;
//   customerName: string;
//   orderDate: string;
//   totalAmount: number;
//   status: "Pending" | "Shipped" | "Delivered";
// }

// const AdminOrders: React.FC = () => {
//   // Sample order data
//   const data: Order[] = [
//     {
//       id: 1,
//       customerName: "John Doe",
//       orderDate: "2024-01-01",
//       totalAmount: 100.0,
//       status: "Pending",
//     },
//     {
//       id: 2,
//       customerName: "Jane Smith",
//       orderDate: "2024-01-05",
//       totalAmount: 150.75,
//       status: "Shipped",
//     },
//     {
//       id: 3,
//       customerName: "Alice Johnson",
//       orderDate: "2024-01-10",
//       totalAmount: 200.0,
//       status: "Delivered",
//     },
//   ];

//   // Define columns for the table
//   const columns: Column<Order>[] = [
//     {
//       Header: "Order ID",
//       accessor: "id",
//     },
//     {
//       Header: "Customer Name",
//       accessor: "customerName",
//     },
//     {
//       Header: "Order Date",
//       accessor: "orderDate",
//     },
//     {
//       Header: "Total Amount",
//       accessor: "totalAmount",
//       Cell: ({ value }) => `$${value.toFixed(2)}`,
//     },
//     {
//       Header: "Status",
//       accessor: "status",
//     },
//   ];

//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
//     useTable<Order>({ columns, data });

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
//       <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
//         Orders Dashboard
//       </h1>
//       <div className="overflow-x-auto bg-white rounded-lg shadow-md">
//         <table
//           {...getTableProps()}
//           className="min-w-full bg-white border border-gray-200"
//         >
//           <thead>
//             {headerGroups.map((headerGroup) => (
//               <tr
//                 {...headerGroup.getHeaderGroupProps()}
//                 className="bg-gray-200"
//               >
//                 {headerGroup.headers.map((column) => {
//                   const { key, ...rest } = column.getHeaderProps();
//                   return (
//                     <th
//                       key={key}
//                       {...rest}
//                       className="p-4 border-b border-gray-200 text-left"
//                     >
//                       {column.render("Header")}
//                     </th>
//                   );
//                 })}
//               </tr>
//             ))}
//           </thead>
//           <tbody {...getTableBodyProps()}>
//             {rows.map((row) => {
//               prepareRow(row);
//               return (
//                 <tr {...row.getRowProps()} className="hover:bg-gray-100">
//                   {row.cells.map((cell) => {
//                     const { key, ...rest } = cell.getCellProps();
//                     return (
//                       <td
//                         key={key}
//                         {...rest}
//                         className="p-4 border-b border-gray-200"
//                       >
//                         {cell.render("Cell")}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminOrders;

import React, { useState } from "react";

interface Order {
  id: number;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: "Pending" | "Shipped" | "Delivered";
}

const AdminOrders: React.FC = () => {
  // Sample order data with useState
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      customerName: "John Doe",
      orderDate: "2024-01-01",
      totalAmount: 100.0,
      status: "Pending",
    },
    {
      id: 2,
      customerName: "Jane Smith",
      orderDate: "2024-01-05",
      totalAmount: 150.75,
      status: "Shipped",
    },
    {
      id: 3,
      customerName: "Alice Johnson",
      orderDate: "2024-01-10",
      totalAmount: 200.0,
      status: "Delivered",
    },
  ]);

  // Function to update order status
  const updateOrderStatus = (
    id: number,
    status: "Pending" | "Shipped" | "Delivered"
  ) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
  };

  return (
    <section className="px-[5%] py-30 md:py-24 lg:py-20">
      <div className="container">
        <div className="rb-12 mb-12 md:mb-5">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
            Orders Dashboard
          </h2>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4 border-b border-gray-200 text-left">
                  Order ID
                </th>
                <th className="p-4 border-b border-gray-200 text-left">
                  Customer Name
                </th>
                <th className="p-4 border-b border-gray-200 text-left">
                  Order Date
                </th>
                <th className="p-4 border-b border-gray-200 text-left">
                  Total Amount
                </th>
                <th className="p-4 border-b border-gray-200 text-left">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-100">
                  <td className="p-4 border-b border-gray-200">{order.id}</td>
                  <td className="p-4 border-b border-gray-200">
                    {order.customerName}
                  </td>
                  <td className="p-4 border-b border-gray-200">
                    {order.orderDate}
                  </td>
                  <td className="p-4 border-b border-gray-200">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-4 border-b border-gray-200">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(
                          order.id,
                          e.target.value as "Pending" | "Shipped" | "Delivered"
                        )
                      }
                      className="p-2 border rounded"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminOrders;
