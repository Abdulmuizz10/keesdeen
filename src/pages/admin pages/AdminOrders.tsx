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
    <section className="container">
      <div className="rb-12 mb-12 md:mb-5">
        <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
          Orders
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
              <th className="p-4 border-b border-gray-200 text-left">Status</th>
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
    </section>
  );
};

export default AdminOrders;
