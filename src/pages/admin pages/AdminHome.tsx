import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";

Chart.register(ArcElement);

const AdminHome: React.FC = () => {
  return (
    <section className="container ">
      <h2 className=" mb-10 text-4xl font-bold md:text-6xl lg:text-7xl bricolage-grotesque">
        Admin
      </h2>
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
        backgroundColor: ["#04BB6E", "#eee"],
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Transactions */}
        <div className="col-span-2 bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-4">Latest Transactions</h3>
          <div className="space-y-4">
            {[
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
            ].map((transaction, index) => (
              <div
                key={index}
                className="flex flex-wrap md:flex-nowrap justify-between items-center"
              >
                <div className="flex items-center space-x-4 mb-2 md:mb-0">
                  <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                  <span className="font-semibold">{transaction.name}</span>
                </div>
                <span
                  className={`px-4 py-1 rounded-full ${
                    transaction.status === "done"
                      ? "bg-green-200 text-green-800"
                      : transaction.status === "canceled"
                      ? "bg-red-200 text-red-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {transaction.status}
                </span>
                <span className="mt-2 md:mt-0">{transaction.date}</span>
                <span className="font-semibold mt-2 md:mt-0">
                  {transaction.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Recap */}
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-4">Weekly Recap</h3>
          <div className="h-40 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
