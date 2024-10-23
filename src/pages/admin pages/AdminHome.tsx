import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";

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

  const transactions = [
    {
      name: "Josephine Zimmerman",
      status: "pending",
      date: "14.01.2024",
      amount: "$3,200",
    },
    {
      name: "Cecilia Harriet",
      status: "done",
      date: "13.01.2024",
      amount: "$2,800",
    },
    {
      name: "Dennis Thomas",
      status: "canceled",
      date: "12.01.2024",
      amount: "$2,600",
    },
    {
      name: "Josephine Zimmerman",
      status: "pending",
      date: "14.01.2024",
      amount: "$3,200",
    },
    {
      name: "Cecilia Harriet",
      status: "done",
      date: "13.01.2024",
      amount: "$2,800",
    },
    {
      name: "Dennis Thomas",
      status: "canceled",
      date: "12.01.2024",
      amount: "$2,600",
    },
    {
      name: "Josephine Zimmerman",
      status: "pending",
      date: "14.01.2024",
      amount: "$3,200",
    },
    {
      name: "Cecilia Harriet",
      status: "done",
      date: "13.01.2024",
      amount: "$2,800",
    },
    {
      name: "Dennis Thomas",
      status: "canceled",
      date: "12.01.2024",
      amount: "$2,600",
    },
    {
      name: "Josephine Zimmerman",
      status: "pending",
      date: "14.01.2024",
      amount: "$3,200",
    },
    {
      name: "Cecilia Harriet",
      status: "done",
      date: "13.01.2024",
      amount: "$2,800",
    },
    {
      name: "Dennis Thomas",
      status: "canceled",
      date: "12.01.2024",
      amount: "$2,600",
    },
    {
      name: "Josephine Zimmerman",
      status: "pending",
      date: "14.01.2024",
      amount: "$3,200",
    },
    {
      name: "Cecilia Harriet",
      status: "done",
      date: "13.01.2024",
      amount: "$2,800",
    },
    {
      name: "Dennis Thomas",
      status: "canceled",
      date: "12.01.2024",
      amount: "$2,600",
    },
    {
      name: "Josephine Zimmerman",
      status: "pending",
      date: "14.01.2024",
      amount: "$3,200",
    },
    {
      name: "Cecilia Harriet",
      status: "done",
      date: "13.01.2024",
      amount: "$2,800",
    },
    {
      name: "Dennis Thomas",
      status: "canceled",
      date: "12.01.2024",
      amount: "$2,600",
    },
    {
      name: "Josephine Zimmerman",
      status: "pending",
      date: "14.01.2024",
      amount: "$3,200",
    },
    {
      name: "Cecilia Harriet",
      status: "done",
      date: "13.01.2024",
      amount: "$2,800",
    },
    {
      name: "Dennis Thomas",
      status: "canceled",
      date: "12.01.2024",
      amount: "$2,600",
    },
    {
      name: "Josephine Zimmerman",
      status: "pending",
      date: "14.01.2024",
      amount: "$3,200",
    },
    {
      name: "Cecilia Harriet",
      status: "done",
      date: "13.01.2024",
      amount: "$2,800",
    },
    {
      name: "Dennis Thomas",
      status: "canceled",
      date: "12.01.2024",
      amount: "$2,600",
    },
    {
      name: "Josephine Zimmerman",
      status: "pending",
      date: "14.01.2024",
      amount: "$3,200",
    },
    {
      name: "Cecilia Harriet",
      status: "done",
      date: "13.01.2024",
      amount: "$2,800",
    },
    {
      name: "Dennis Thomas",
      status: "canceled",
      date: "12.01.2024",
      amount: "$2,600",
    },
    {
      name: "Josephine Zimmerman",
      status: "pending",
      date: "14.01.2024",
      amount: "$3,200",
    },
    {
      name: "Cecilia Harriet",
      status: "done",
      date: "13.01.2024",
      amount: "$2,800",
    },
    {
      name: "Dennis Thomas",
      status: "canceled",
      date: "12.01.2024",
      amount: "$2,600",
    },
    {
      name: "Josephine Zimmerman",
      status: "pending",
      date: "14.01.2024",
      amount: "$3,200",
    },
    {
      name: "Cecilia Harriet",
      status: "done",
      date: "13.01.2024",
      amount: "$2,800",
    },
    {
      name: "Dennis Thomas",
      status: "canceled",
      date: "12.01.2024",
      amount: "$2,600",
    },
    {
      name: "Josephine Zimmerman",
      status: "pending",
      date: "14.01.2024",
      amount: "$3,200",
    },
    {
      name: "Cecilia Harriet",
      status: "done",
      date: "13.01.2024",
      amount: "$2,800",
    },
    {
      name: "Dennis Thomas",
      status: "canceled",
      date: "12.01.2024",
      amount: "$2,600",
    },
    {
      name: "Josephine Zimmerman",
      status: "pending",
      date: "14.01.2024",
      amount: "$3,200",
    },
    {
      name: "Cecilia Harriet",
      status: "done",
      date: "13.01.2024",
      amount: "$2,800",
    },
    {
      name: "Dennis Thomas",
      status: "canceled",
      date: "12.01.2024",
      amount: "$2,600",
    },
    {
      name: "Josephine Zimmerman",
      status: "pending",
      date: "14.01.2024",
      amount: "$3,200",
    },
    {
      name: "Cecilia Harriet",
      status: "done",
      date: "13.01.2024",
      amount: "$2,800",
    },
    {
      name: "Dennis Thomas",
      status: "canceled",
      date: "12.01.2024",
      amount: "$2,600",
    },
    {
      name: "Josephine Zimmerman",
      status: "pending",
      date: "14.01.2024",
      amount: "$3,200",
    },
    {
      name: "Cecilia Harriet",
      status: "done",
      date: "13.01.2024",
      amount: "$2,800",
    },
    {
      name: "Dennis Thomas",
      status: "canceled",
      date: "12.01.2024",
      amount: "$2,600",
    },
    {
      name: "Josephine Zimmerman",
      status: "pending",
      date: "14.01.2024",
      amount: "$3,200",
    },
    {
      name: "Cecilia Harriet",
      status: "done",
      date: "13.01.2024",
      amount: "$2,800",
    },
    {
      name: "Dennis Thomas",
      status: "canceled",
      date: "12.01.2024",
      amount: "$2,600",
    },
    {
      name: "Josephine Zimmerman",
      status: "pending",
      date: "14.01.2024",
      amount: "$3,200",
    },
    {
      name: "Cecilia Harriet",
      status: "done",
      date: "13.01.2024",
      amount: "$2,800",
    },
    {
      name: "Dennis Thomas",
      status: "canceled",
      date: "12.01.2024",
      amount: "$2,600",
    },
    {
      name: "Josephine Zimmerman",
      status: "pending",
      date: "14.01.2024",
      amount: "$3,200",
    },
    {
      name: "Cecilia Harriet",
      status: "done",
      date: "13.01.2024",
      amount: "$2,800",
    },
    {
      name: "Dennis Thomas",
      status: "canceled",
      date: "12.01.2024",
      amount: "$2,600",
    },
    {
      name: "Josephine Zimmerman",
      status: "pending",
      date: "14.01.2024",
      amount: "$3,200",
    },
    {
      name: "Cecilia Harriet",
      status: "done",
      date: "13.01.2024",
      amount: "$2,800",
    },
    {
      name: "Dennis Thomas",
      status: "canceled",
      date: "12.01.2024",
      amount: "$2,600",
    },
    {
      name: "Josephine Zimmerman",
      status: "pending",
      date: "14.01.2024",
      amount: "$3,200",
    },
    {
      name: "Cecilia Harriet",
      status: "done",
      date: "13.01.2024",
      amount: "$2,800",
    },
    {
      name: "Dennis Thomas",
      status: "canceled",
      date: "12.01.2024",
      amount: "$2,600",
    },
    {
      name: "Josephine Zimmerman",
      status: "pending",
      date: "14.01.2024",
      amount: "$3,200",
    },
    {
      name: "Cecilia Harriet",
      status: "done",
      date: "13.01.2024",
      amount: "$2,800",
    },
    {
      name: "Dennis Thomas",
      status: "canceled",
      date: "12.01.2024",
      amount: "$2,600",
    },
    {
      name: "Lula Neal",
      status: "pending",
      date: "11.01.2024",
      amount: "$3,200",
    },
    {
      name: "Jeff Montgomery",
      status: "done",
      date: "10.01.2024",
      amount: "$4,600",
    },
    {
      name: "Emily Scott",
      status: "pending",
      date: "09.01.2024",
      amount: "$1,900",
    },
    {
      name: "Henry Wallace",
      status: "done",
      date: "08.01.2024",
      amount: "$5,500",
    },
    {
      name: "Anna Watkins",
      status: "canceled",
      date: "07.01.2024",
      amount: "$3,400",
    },
    {
      name: "Peter Young",
      status: "pending",
      date: "06.01.2024",
      amount: "$4,000",
    },
    {
      name: "Grace Turner",
      status: "done",
      date: "05.01.2024",
      amount: "$2,200",
    },
    {
      name: "Robert Lee",
      status: "pending",
      date: "04.01.2024",
      amount: "$6,000",
    },
    {
      name: "Victoria Hayes",
      status: "done",
      date: "03.01.2024",
      amount: "$3,800",
    },
    {
      name: "Isaac Watson",
      status: "canceled",
      date: "02.01.2024",
      amount: "$2,500",
    },
    {
      name: "Sophia Barnes",
      status: "pending",
      date: "01.01.2024",
      amount: "$1,700",
    },
    {
      name: "Peter Young",
      status: "pending",
      date: "06.01.2024",
      amount: "$4,000",
    },
    {
      name: "Grace Turner",
      status: "done",
      date: "05.01.2024",
      amount: "$2,200",
    },
    {
      name: "Robert Lee",
      status: "pending",
      date: "04.01.2024",
      amount: "$6,000",
    },
    {
      name: "Victoria Hayes",
      status: "done",
      date: "03.01.2024",
      amount: "$3,800",
    },
    {
      name: "Isaac Watson",
      status: "canceled",
      date: "02.01.2024",
      amount: "$2,500",
    },
    {
      name: "Sophia Barnes",
      status: "pending",
      date: "01.01.2024",
      amount: "$1,700",
    },
    {
      name: "Peter Young",
      status: "pending",
      date: "06.01.2024",
      amount: "$4,000",
    },
    {
      name: "Grace Turner",
      status: "done",
      date: "05.01.2024",
      amount: "$2,200",
    },
    {
      name: "Robert Lee",
      status: "pending",
      date: "04.01.2024",
      amount: "$6,000",
    },
    {
      name: "Victoria Hayes",
      status: "done",
      date: "03.01.2024",
      amount: "$3,800",
    },
    {
      name: "Isaac Watson",
      status: "canceled",
      date: "02.01.2024",
      amount: "$2,500",
    },
    {
      name: "Sophia Barnes",
      status: "pending",
      date: "01.01.2024",
      amount: "$1,700",
    },
    {
      name: "Peter Young",
      status: "pending",
      date: "06.01.2024",
      amount: "$4,000",
    },
    {
      name: "Grace Turner",
      status: "done",
      date: "05.01.2024",
      amount: "$2,200",
    },
    {
      name: "Robert Lee",
      status: "pending",
      date: "04.01.2024",
      amount: "$6,000",
    },
    {
      name: "Victoria Hayes",
      status: "done",
      date: "03.01.2024",
      amount: "$3,800",
    },
    {
      name: "Isaac Watson",
      status: "canceled",
      date: "02.01.2024",
      amount: "$2,500",
    },
    {
      name: "Sophia Barnes",
      status: "pending",
      date: "01.01.2024",
      amount: "$1,700",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10; // Adjust this number as needed

  // Calculate total pages
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  // Get the transactions for the current page
  const currentTransactions = transactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  // Function to change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
            <h3 className="text-lg md:text-xl font-semibold">Stock</h3>
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
        {/* Latest Transactions */}
        <div className="w-full bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-4">Latest Transactions</h3>

          <div className="overflow-x-auto">
            <table className="w-full bg-white">
              <thead>
                <tr className="bg-gray-100 rounded-t-xl bricolage-grotesque font-extrabold">
                  <th className="text-left p-4 font-semibold first:rounded-tl-xl last:rounded-tr-xl ">
                    Customer
                  </th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Date</th>
                  <th className="text-left p-4 font-semibold rounded-tr-xl">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((transaction, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition-colors duration-150 poppins"
                  >
                    <td className="flex items-center space-x-4 p-4">
                      <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                      <span className="font-semibold">{transaction.name}</span>
                    </td>
                    <td className="p-4 poppins">
                      <span
                        className={`px-4 py-1 rounded-full text-sm ${
                          transaction.status === "done"
                            ? "bg-green-200 text-green-800"
                            : transaction.status === "canceled"
                            ? "bg-red-200 text-red-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm">{transaction.date}</td>
                    <td className="p-4 font-semibold text-md">
                      {transaction.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
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
                <button
                  onClick={() => paginate(1)}
                  className="px-4 py-2 bg-white border border-border-primary text-text-primary rounded-lg mx-1"
                >
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
                  (pageNumber >= currentPage - 2 &&
                    pageNumber <= currentPage + 2)
              )
              .map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={`px-4 py-2 ${
                    currentPage === pageNumber
                      ? "bg-brand-neutral text-white"
                      : "px-4 py-2 bg-white border border-border-primary text-text-primary rounded-lg"
                  }  rounded-lg mx-1`}
                >
                  {pageNumber}
                </button>
              ))}

            {currentPage < totalPages - 2 && (
              <>
                <span className="px-4 py-2">...</span>
                <button
                  onClick={() => paginate(totalPages)}
                  className="px-4 py-2 bg-white border border-border-primary text-text-primary rounded-lg mx-1"
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
    </div>
  );
};

export default AdminHome;
