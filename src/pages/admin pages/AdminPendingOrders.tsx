import React, { useEffect, useRef, useState } from "react";
import { formatAmount } from "../../lib/utils";
import Axios from "axios";
import { URL } from "../../lib/constants";
import { toast } from "react-toastify";

const AdminPendingOrders: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page: number) => {
    try {
      const userToken = JSON.parse(localStorage.getItem("user") || "{}").token;
      const response = await Axios.get(
        `${URL}/orders/page/pending-orders?page=${page}`,
        {
          headers: {
            token: "Bearer " + userToken,
          },
        }
      );
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      toast.error("Error while fetching transactions. Please refresh the page");
      setLoading(false);
    }
  };

  return (
    <section className="w-full" ref={scrollRef}>
      {/* Latest Orders */}
      <div className="w-full bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold mb-4">Pending orders</h3>

        <div className="overflow-x-auto">
          <table className="w-full bg-white poppins">
            <thead className="text-sm">
              <tr className="bg-gray-100 font-extrabold">
                <th className="text-left p-4 font-semibold">Order ID</th>
                <th className="text-left p-4 font-semibold">Username</th>
                <th className="text-left p-4 font-semibold">Email address</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Amount</th>
                <th className="text-left p-4 font-semibold">Date ordered</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 20 }).map((_, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-6 h-6 bg-gray-200 animate-pulse" />
                      <td className="p-6 h-6 bg-gray-200 animate-pulse" />
                      <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                      <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                      <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                      <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                    </tr>
                  ))
                : orders?.map((order: any, index: number) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition-colors duration-150 text-sm"
                    >
                      <td className="p-4">
                        {order._id.split("").slice(0, 10)}...
                      </td>
                      <td className="py-2">{`${order.firstName} ${order.lastName}`}</td>
                      <td className="p-5">{order.email}</td>
                      <td className="p-5">
                        {order.isDelivered ? (
                          <span className="text-green-500 font-semibold">
                            Delivered
                          </span>
                        ) : (
                          <span className="text-brand-secondary font-semibold">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-5">{formatAmount(order.totalPrice)}</td>
                      <td className="p-5">
                        {order.paidAt?.split("").slice(0, 10)} at{" "}
                        {order.paidAt?.split("").slice(11, 19)}
                      </td>
                    </tr>
                  ))}
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
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>

          <button
            className={`py-3 px-4 rounded-md bg-brand-neutral text-white ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdminPendingOrders;
