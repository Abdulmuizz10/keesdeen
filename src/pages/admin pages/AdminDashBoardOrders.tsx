import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

// Register necessary components from Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const AdminDashBoardOrders: React.FC = () => {
  // Sample data for the orders chart
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Orders",
        data: [50, 70, 40, 90, 120, 150, 200],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        fill: false, // Do not fill under the line
        pointBackgroundColor: "rgba(255, 99, 132, 1)", // Dot color
        pointBorderColor: "#fff", // Dot border color
        pointBorderWidth: 2,
        pointRadius: 5, // Size of the dots
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly Orders Data",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <section className="px-[5%] py-30 md:py-24 lg:py-20">
      <div className="container">
        <div className="rb-12 mb-12 md:mb-5">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
            Orders Dashboard
          </h2>
          <p className="md:text-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <Line data={data} options={options} />
        </div>
      </div>
    </section>
  );
};

export default AdminDashBoardOrders;
