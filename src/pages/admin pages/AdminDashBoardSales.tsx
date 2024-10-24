import React from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample data for the composed sales chart
const salesData = [
  { month: "January", sales: 3000 },
  { month: "February", sales: 2000 },
  { month: "March", sales: 4000 },
  { month: "April", sales: 5000 },
  { month: "May", sales: 6000 },
  { month: "June", sales: 7000 },
  { month: "July", sales: 8000 },
  { month: "August", sales: 7500 },
  { month: "September", sales: 6800 },
  { month: "October", sales: 8500 },
  { month: "November", sales: 9000 },
  { month: "December", sales: 9500 },
];

const AdminDashBoardSales: React.FC = () => {
  return (
    <section className="container">
      <div className="rb-12 mb-12 md:mb-5">
        <h2 className="rb-5 mb-5 text-4xl font-bold md:mb-6  bricolage-grotesque">
          Sales Dashboard
        </h2>
        <p className="md:text-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={salesData}
            margin={{
              top: 20,
              right: 30,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" barSize={20} fill="#3c3c3c" />
            <Line type="monotone" dataKey="sales" stroke="#3c3c3c" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default AdminDashBoardSales;
