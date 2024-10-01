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

// Sample data for the composed orders chart
const ordersData = [
  { month: "January", orders: 50 },
  { month: "February", orders: 70 },
  { month: "March", orders: 40 },
  { month: "April", orders: 90 },
  { month: "May", orders: 120 },
  { month: "June", orders: 150 },
  { month: "July", orders: 200 },
  { month: "August", orders: 180 },
  { month: "September", orders: 160 },
  { month: "October", orders: 210 },
  { month: "November", orders: 230 },
  { month: "December", orders: 250 },
];

const AdminDashBoardOrders: React.FC = () => {
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
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
              data={ordersData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="orders"
                barSize={20}
                fill="rgba(255, 99, 132, 0.6)"
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="rgba(255, 99, 132, 1)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default AdminDashBoardOrders;
