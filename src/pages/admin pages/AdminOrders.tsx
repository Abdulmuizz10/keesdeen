import React, { useEffect, useRef, useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import Axios from "axios";
import { URL } from "../../lib/constants";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { formatAmountDefault } from "../../lib/utils";

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `${URL}/orders/page/orders?page=${page}`,
        {
          withCredentials: true, // Include cookies in the request
        }
      );
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching orders. Please refresh the page");
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: any, status: string) => {
    setLoading(true);
    try {
      const response = await Axios.patch(
        `${URL}/orders/${orderId}/deliver`,
        { status },
        {
          withCredentials: true,
          validateStatus: (status: any) => status < 600,
        }
      );
      if (response.status === 200) {
        setLoading(false);
        fetchData(currentPage);
        toast.success(response.data.message);
      } else {
        setLoading(false);
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      setLoading(false);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const copyId = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast("Transaction ID copied to clipboard!");
      })
      .catch(() => {
        toast("Failed to copy transaction ID.");
      });
  };

  return (
    <section className="w-full" ref={scrollRef}>
      <div className="w-full">
        {/* Latest Orders */}
        <div className="w-full bg-white p-6 rounded-lg hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-4">All orders</h3>

          <div className="overflow-x-auto">
            <table className="w-full bg-white poppins">
              <thead className="text-sm">
                <tr className="bg-gray-100 font-extrabold">
                  <th className="text-left p-4 font-semibold">Order ID</th>
                  <th className="text-left p-4 font-semibold">Full name</th>
                  <th className="text-left p-4 font-semibold">Email address</th>
                  <th className="text-left p-4 font-semibold">Order status</th>
                  <th className="text-left p-4 font-semibold">Change status</th>
                  <th className="text-left p-4 font-semibold">Amount</th>
                  <th className="text-left p-4 font-semibold">Date ordered</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 20 }).map((_, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-6 h-6 bg-gray-200 animate-pulse" />
                      <td className="p-6 h-6 bg-gray-200 animate-pulse" />
                      <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                      <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                      <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                      <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                      <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                    </tr>
                  ))
                ) : orders.length > 0 ? (
                  orders?.map((order: any, index: number) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition-colors duration-150 text-sm"
                    >
                      <td className="px-3 py-5 flex gap-1 items-center">
                        {order._id.split("").slice(0, 7)}...
                        <FaRegCopy
                          className="text-xl cursor-pointer"
                          onClick={() => copyId(order._id)}
                        />
                      </td>
                      <td className="p-3 cursor-pointer">
                        <Link
                          to={`/admin/order_details/${order._id}`}
                        >{`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}</Link>
                      </td>

                      <td className="p-5">{order.email}</td>
                      <td className="p-5">
                        {order.isDelivered === "Delivered" ? (
                          <span className="text-green-500 font-semibold">
                            Delivered
                          </span>
                        ) : (
                          <span className="text-brand-secondary font-semibold">
                            {order.isDelivered}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <select
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="border border-gray-300  p-1 focus:ring-none"
                        >
                          <option value="">Select status</option>
                          <option value={"Pending"}>Pending</option>
                          <option value={"Processing"}>Processing</option>
                          <option value={"Shipped"}>Shipped</option>
                          <option value={"Delivered"}>Delivered</option>
                        </select>
                      </td>
                      <td className="p-5">
                        {formatAmountDefault(order.currency, order.totalPrice)}
                      </td>
                      <td className="p-5">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <p className="text-base sm:text-xl py-5">
                    No orders available
                  </p>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}

          <div className="flex justify-end mt-4 gap-3 poppins">
            <button
              className={`py-3 px-4 rounded-md bg-brand-neutral text-white ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((prev) => Math.max(prev - 1, 1));
                scrollRef.current.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Previous
            </button>

            <button
              className={`py-3 px-4 rounded-md bg-brand-neutral text-white ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                scrollRef.current.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminOrders;
