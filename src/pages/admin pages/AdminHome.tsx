import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import { formatAmount } from "../../lib/utils";
import Axios from "axios";
import { URL } from "../../lib/constants";
import { toast } from "react-toastify";

Chart.register(ArcElement);

const AdminHome: React.FC = () => {
  return (
    <section className="container ">
      <Dashboard />
    </section>
  );
};

const Dashboard = () => {
  // Chart data
  const userData = {
    datasets: [
      {
        data: [75, 25], // 75% completion
        backgroundColor: ["#13034bef", "#eee"],
        borderWidth: 0,
      },
    ],
  };

  const stockData = {
    datasets: [
      {
        data: [60, 40], // 60% completion
        backgroundColor: ["#DA5B14", "#eee"],
        borderWidth: 0,
      },
    ],
  };

  const revenueData = {
    datasets: [
      {
        data: [85, 15], // 85% completion
        backgroundColor: ["#04BB6E", "#eee"],
        borderWidth: 0,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    cutout: "70%",
    plugins: {
      tooltip: { enabled: false },
    },
  };

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchData = async (page: number) => {
    try {
      const userToken = JSON.parse(localStorage.getItem("user") || "{}").token;
      const response = await Axios.get(
        `${URL}/orders/page/orders?page=${page}`,
        {
          headers: {
            token: "Bearer " + userToken,
          },
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

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  return (
    <div className="">
      {/* Header stats with doughnut charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 flex items-center space-x-6">
          <div className="w-20 h-20 md:w-24 md:h-24 sm:hidden xl:flex">
            <Doughnut data={userData} options={chartOptions} />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-semibold">Total Users</h3>
            <p className="text-2xl md:text-4xl font-bold mt-2">10,928</p>
            <p className="text-green-600 text-sm md:text-base mt-1">
              12% more than previous week
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 flex items-center space-x-6">
          <div className="w-20 h-20 md:w-24 md:h-24 sm:hidden xl:flex">
            <Doughnut data={stockData} options={chartOptions} />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-semibold">Products</h3>
            <p className="text-2xl md:text-4xl font-bold mt-2">8,236</p>
            <p className="text-red-600 text-sm md:text-base mt-1">
              1% less than previous week
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 flex items-center space-x-6">
          <div className="w-20 h-20 md:w-24 md:h-24 sm:hidden xl:flex">
            <Doughnut data={revenueData} options={chartOptions} />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-semibold">Revenue</h3>
            <p className="text-2xl md:text-4xl font-bold mt-2">$6,642</p>
            <p className="text-green-600 text-sm md:text-base mt-1">
              18% more than previous week
            </p>
          </div>
        </div>
      </div>

      <div className="w-full">
        {/* Latest Orders */}
        <div className="w-full bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-4">Latest Transactions</h3>

          <div className="overflow-x-auto">
            <table className="w-full bg-white poppins">
              <thead className="text-sm">
                <tr className="bg-gray-100 font-extrabold">
                  <th className="text-left p-4 font-semibold">Order ID</th>
                  <th className="text-left p-4 font-semibold">Username</th>
                  <th className="text-left p-4 font-semibold">Email address</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Amount</th>
                  <th className="text-left p-4 font-semibold">Date</th>
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
                  : transactions?.map((transaction: any, index: number) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-50 transition-colors duration-150 text-sm"
                      >
                        <td className="p-4">
                          {transaction._id.split("").slice(0, 8)}....
                        </td>
                        <td className="p-5">{`${transaction.firstName} ${transaction.lastName}`}</td>
                        <td className="p-5">{transaction.email}</td>
                        <td className="p-5">
                          {transaction.isDelivered ? (
                            <span className="text-green-500 font-semibold">
                              Delivered
                            </span>
                          ) : (
                            <span className="text-brand-secondary font-semibold">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="p-5">
                          {formatAmount(transaction.totalPrice)}
                        </td>
                        <td className="p-5">
                          {transaction.paidAt?.split("").slice(0, 10)} at{" "}
                          {transaction.paidAt?.split("").slice(11, 19)}
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
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
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
      </div>
    </div>
  );
};

export default AdminHome;

// <div className="w-full">
//   {/* Latest Orders */}
//   <div className="w-full bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
//     <h3 className="text-xl font-semibold mb-4">Latest Transactions</h3>

//     <div className="overflow-x-auto">
//       <table className="w-full bg-white">
//         <thead>
//           <tr className="bg-gray-100 rounded-t-xl bricolage-grotesque font-extrabold">
//             <th className="text-left p-4 font-semibold first:rounded-tl-xl last:rounded-tr-xl">
//               Customer
//             </th>
//             <th className="text-left p-4 font-semibold">Email</th>
//             <th className="text-left p-4 font-semibold">Status</th>
//             <th className="text-left p-4 font-semibold">Date</th>
//             <th className="text-left p-4 font-semibold rounded-tr-xl">
//               Amount
//             </th>
//           </tr>
//         </thead>
//         <tbody className="poppins">
//           {loading
//             ? transactions?.map((_: any, index: number) => (
//                 <tr key={index} className="border-b">
//                   {/* Combine firstName and lastName */}
//                   <td className="p-6 h-6 w-full  bg-gray-200 animate-pulse" />

//                   {/* Display email */}

//                   <td className="p-4 h-6 w-full  bg-gray-200 animate-pulse" />

//                   {/* Show delivery status */}
//                   <td className="p-4 h-6 w-full  bg-gray-200 animate-pulse" />

//                   {/* Show paid date */}
//                   <td className="p-4 h-6 w-full  bg-gray-200 animate-pulse" />

//                   {/* Show total price */}
//                   <td className="p-4 h-6 w-full  bg-gray-200 animate-pulse" />
//                 </tr>
//               ))
//             : transactions?.map((transaction: any, index: number) => (
//                 <tr key={index} className="border-b">
//                   {/* Combine firstName and lastName */}
//                   <td className="p-4">
//                     {`${transaction.firstName} ${transaction.lastName}`}
//                   </td>

//                   {/* Display email */}
//                   <td className="p-4">{transaction.email}</td>

//                   {/* Show delivery status */}
//                   <td className="p-4">
//                     {transaction.isDelivered ? (
//                       <span className="text-green-500 font-semibold">
//                         Delivered
//                       </span>
//                     ) : (
//                       <span className="text-brand-secondary font-semibold">
//                         Pending
//                       </span>
//                     )}
//                   </td>

//                   {/* Show paid date */}
//                   <td className="p-4">
//                     {new Date(transaction.paidAt).toLocaleDateString()}
//                   </td>

//                   {/* Show total price */}
//                   <td className="p-4">
//                     {formatAmount(transaction.totalPrice)}
//                   </td>
//                 </tr>
//               ))}
//         </tbody>
//       </table>
//     </div>

//     {/* Pagination controls */}
//   </div>
// </div>;
