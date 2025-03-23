import React, { useEffect, useRef, useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import Axios from "axios";
import { URL } from "../../lib/constants";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { formatAmountDefault } from "../../lib/utils";

const getCompletionPercentage = (value: number, max: number) => {
  return Math.min(100, Math.round((value / max) * 100));
};

const CircularLoader = ({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) => {
  const percentage = getCompletionPercentage(value, max);

  return (
    <div
      className="relative w-20 h-20 md:w-[95px] md:h-[95px] rounded-full flex items-center justify-center"
      style={{
        background: `conic-gradient(${color} ${percentage}%, #eee ${percentage}%)`,
      }}
    >
      <div className="absolute bg-white w-16 h-16 md:w-20 md:h-20 rounded-full"></div>
      <span className="text-sm font-bold">{percentage}%</span>
    </div>
  );
};

const DashboardStats = ({
  users,
  products,
  transactions,
}: {
  users: any[];
  products: any[];
  transactions: any[];
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4 lg:mb-8">
      <div className="bg-white p-6 rounded-lg hover:shadow-2xl transition-shadow duration-300 flex items-center space-x-6">
        <CircularLoader
          value={users?.length + 10}
          max={users?.length + 50}
          color="#13034bef"
        />
        <div>
          <h3 className="text-lg md:text-xl font-semibold">Total Users</h3>
          <p className="text-2xl md:text-4xl font-bold">{users?.length}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg hover:shadow-2xl transition-shadow duration-300 flex items-center space-x-6">
        <CircularLoader
          value={products?.length + 10}
          max={products?.length + 50}
          color="#DA5B14"
        />
        <div>
          <h3 className="text-lg md:text-xl font-semibold">Products</h3>
          <p className="text-2xl md:text-4xl font-bold">{products?.length}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg hover:shadow-2xl transition-shadow duration-300 flex items-center space-x-6">
        <CircularLoader
          value={transactions?.length + 10}
          max={transactions?.length + 50}
          color="#04BB6E"
        />
        <div>
          <h3 className="text-lg md:text-xl font-semibold">Orders</h3>
          <p className="text-2xl md:text-4xl font-bold">
            {transactions?.length}
          </p>
        </div>
      </div>
    </div>
  );
};

const AdminHome: React.FC = () => {
  const [transactions, setTransactions] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `${URL}/orders/page/orders?page=${page}`,
        {
          withCredentials: true,
        }
      );
      setTransactions(response.data.orders);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      toast.error("Error while fetching transactions. Please refresh the page");
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await Axios.get(`${URL}/users`, {
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (error) {
      toast.error("Error fetching users!");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await Axios.get(`${URL}/products`);
      setProducts(response.data);
    } catch (error) {
      toast.error("Error fetching users!");
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
    <section className="container ">
      <div className="w-full">
        {/* Header stats with doughnut charts */}

        <DashboardStats
          users={users}
          products={products}
          transactions={transactions}
        />
        <div className="w-full" ref={scrollRef}>
          {/* Latest Orders */}
          <div className="w-full bg-white p-6 rounded-lg hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-4">Latest Transactions</h3>

            <div className="overflow-x-auto">
              <table className="w-full bg-white poppins">
                <thead className="text-sm">
                  <tr className="bg-gray-100 font-extrabold">
                    <th className="text-left p-4 font-semibold">S/N</th>
                    <th className="text-left p-4 font-semibold">Order ID</th>
                    <th className="text-left p-4 font-semibold">Full name</th>
                    <th className="text-left p-4 font-semibold">
                      Email address
                    </th>
                    <th className="text-left p-4 font-semibold">
                      Order status
                    </th>
                    <th className="text-left p-4 font-semibold">Amount</th>
                    <th className="text-left p-4 font-semibold">
                      Date ordered
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 20 }).map((_, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-6 h-6 bg-gray-200 animate-pulse" />
                        <td className="p-6 h-6 bg-gray-200 animate-pulse" />
                        <td className="p-6 h-6 bg-gray-200 animate-pulse" />
                        <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                        <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                        <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                        <td className="p-4 h-6 bg-gray-200 animate-pulse" />
                      </tr>
                    ))
                  ) : transactions.length > 0 ? (
                    transactions?.map((transaction: any, index: number) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-50 transition-colors duration-150 text-sm"
                      >
                        <td className="py-5 pl-6 text-start">{index + 1}</td>
                        <td className="px-3 py-5 flex items-center gap-2 ">
                          {transaction._id.split("").slice(0, 6)}....
                          <FaRegCopy
                            className="text-xl cursor-pointer"
                            onClick={() => copyId(transaction._id)}
                          />
                        </td>

                        <td className="p-5 cursor-pointer">
                          <Link
                            to={`/admin/order_details/${transaction._id}`}
                          >{`${transaction.shippingAddress.firstName} ${transaction.shippingAddress.lastName}`}</Link>
                        </td>
                        <td className="p-5">{transaction.email}</td>
                        <td className="p-5">
                          {transaction.isDelivered === "Delivered" ? (
                            <span className="text-green-500 font-semibold">
                              Delivered
                            </span>
                          ) : (
                            <span className="text-brand-secondary font-semibold">
                              {transaction.isDelivered}
                            </span>
                          )}
                        </td>
                        <td className="p-5">
                          {formatAmountDefault(
                            transaction.currency,
                            transaction.totalPrice
                          )}
                        </td>
                        <td className="p-5">
                          {new Date(transaction.paidAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <p className="text-base sm:text-xl py-5">
                      No transactions made
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
      </div>
    </section>
  );
};

export default AdminHome;
