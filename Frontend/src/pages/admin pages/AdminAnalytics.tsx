// import React, { useState, useEffect } from "react";
// import {
//   TrendingUp,
//   TrendingDown,
//   DollarSign,
//   ShoppingCart,
//   Users,
//   Package,
//   Tag,
//   Clock,
// } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";

// // Mock data
// const mockData = {
//   summaryCards: {
//     totalRevenue: 124500.5,
//     thisMonthRevenue: 18750.25,
//     revenueChange: 15.5,
//     totalOrders: 342,
//     totalUsers: 1250,
//     userGrowth: 8.3,
//     totalProducts: 156,
//   },
//   orders: {
//     deliveredOrders: 298,
//     pendingOrders: 44,
//   },
//   products: {
//     bestSellers: [
//       { _id: "1", name: "Pro Yoga Mat", price: 45.0 },
//       { _id: "2", name: "Resistance Bands Set", price: 32.0 },
//       { _id: "3", name: "Fitness Tracker", price: 89.0 },
//       { _id: "4", name: "Water Bottle", price: 18.0 },
//       { _id: "5", name: "Gym Bag", price: 65.0 },
//     ],
//     topSelling: [
//       { _id: "Yoga Mat", totalSold: 145 },
//       { _id: "Resistance Bands", totalSold: 132 },
//       { _id: "Tracker", totalSold: 98 },
//       { _id: "Water Bottle", totalSold: 167 },
//       { _id: "Gym Bag", totalSold: 89 },
//     ],
//   },
//   coupons: {
//     totalCoupons: 12,
//     activeCoupons: 8,
//     usedCoupons: 234,
//   },
//   trends: {
//     monthlyRevenue: [
//       { month: "Jan", revenue: 12500 },
//       { month: "Feb", revenue: 15200 },
//       { month: "Mar", revenue: 14800 },
//       { month: "Apr", revenue: 17300 },
//       { month: "May", revenue: 16900 },
//       { month: "Jun", revenue: 19400 },
//       { month: "Jul", revenue: 18200 },
//       { month: "Aug", revenue: 20100 },
//       { month: "Sep", revenue: 22500 },
//       { month: "Oct", revenue: 21800 },
//       { month: "Nov", revenue: 18750 },
//     ],
//   },
// };

// const AdminAnalytics: React.FC = () => {
//   //   const [analytics, setAnalytics] = useState(mockData);
//   //   const [loading, setLoading] = useState(false);

//   const [analytics, _] = useState(mockData);
//   const [loading] = useState(false);

//   useEffect(() => {
//     // fetchAnalytics();
//   }, []);

//   const formatCurrency = (amount: any) => {
//     return new Intl.NumberFormat("en-GB", {
//       style: "currency",
//       currency: "GBP",
//     }).format(amount);
//   };

//   const orderStatusData = [
//     {
//       name: "Delivered",
//       value: analytics.orders.deliveredOrders,
//       fill: "hsl(var(--chart-1))",
//     },
//     {
//       name: "Pending",
//       value: analytics.orders.pendingOrders,
//       fill: "hsl(var(--chart-2))",
//     },
//   ];

//   const chartConfig = {
//     revenue: {
//       label: "Revenue",
//       color: "hsl(var(--chart-1))",
//     },
//     totalSold: {
//       label: "Units Sold",
//       color: "hsl(var(--chart-1))",
//     },
//   };

//   // Stat Card Component
//   const StatCard = ({ title, value, change, icon: Icon, prefix = "" }: any) => (
//     <div className="border p-4">
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-xs uppercase text-muted-foreground">{title}</p>
//           <p className="mt-2 text-2xl font-light tracking-tight">
//             {prefix}
//             {typeof value === "number" && prefix === "£"
//               ? formatCurrency(value).replace("£", "")
//               : value}
//           </p>
//           {change !== undefined && (
//             <div className="mt-2 flex items-center gap-1 text-sm">
//               {change >= 0 ? (
//                 <>
//                   <TrendingUp
//                     size={16}
//                     className="text-green-600"
//                     strokeWidth={1.5}
//                   />
//                   <span className="text-green-600">+{change.toFixed(1)}%</span>
//                 </>
//               ) : (
//                 <>
//                   <TrendingDown
//                     size={16}
//                     className="text-red-600"
//                     strokeWidth={1.5}
//                   />
//                   <span className="text-red-600">{change.toFixed(1)}%</span>
//                 </>
//               )}
//               <span className="text-gray-500">vs last month</span>
//             </div>
//           )}
//         </div>
//         <div className="rounded-full bg-muted p-3 border flex items-center justify-center">
//           <Icon
//             size={24}
//             className="text-accent-foreground"
//             strokeWidth={1.5}
//           />
//         </div>

//         {/* <div className="rounded-full p-3 bg-muted flex items-center justify-center">
//           <Icon size={24} className="text-muted-foreground" />
//         </div> */}
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <p className="text-sm text-muted-foreground">Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 space-y-4 p-4 bg-background">
//       {/* HEADER */}
//       <div className="mb-5 border-b border-border pb-8">
//         <h1 className="text-2xl lg:text-5xl font-light tracking-tight mb-3">
//           Dashboard Analytics
//         </h1>
//         <p className="text-sm text-muted-foreground">
//           Overview of your store performance
//         </p>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <StatCard
//           title="Total Revenue"
//           value={analytics.summaryCards.totalRevenue}
//           prefix="£"
//           icon={DollarSign}
//         />
//         <StatCard
//           title="This Month"
//           value={analytics.summaryCards.thisMonthRevenue}
//           change={analytics.summaryCards.revenueChange}
//           prefix="£"
//           icon={TrendingUp}
//         />
//         <StatCard
//           title="Orders"
//           value={analytics.summaryCards.totalOrders}
//           icon={ShoppingCart}
//         />
//         <StatCard
//           title="Customers"
//           value={analytics.summaryCards.totalUsers}
//           change={analytics.summaryCards.userGrowth}
//           icon={Users}
//         />
//       </div>

//       {/* Secondary Stats */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         <StatCard
//           title="Products"
//           value={analytics.summaryCards.totalProducts}
//           icon={Package}
//         />
//         <StatCard
//           title="Active Coupons"
//           value={`${analytics.coupons.activeCoupons}/${analytics.coupons.totalCoupons}`}
//           icon={Tag}
//         />
//         <StatCard
//           title="Pending Orders"
//           value={analytics.orders.pendingOrders}
//           icon={Clock}
//         />
//       </div>

//       {/* Charts Grid */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//         {/* Revenue Trend - Takes 4 columns */}
//         <Card className="col-span-4 rounded-none">
//           <CardHeader>
//             <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
//               Revenue Overview
//             </CardTitle>
//             <CardDescription>Monthly revenue for 2024</CardDescription>
//           </CardHeader>
//           <CardContent className="pl-2">
//             <ChartContainer config={chartConfig}>
//               <ResponsiveContainer width="100%" height={350}>
//                 <LineChart data={analytics.trends.monthlyRevenue}>
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     className="stroke-muted"
//                   />
//                   <XAxis
//                     dataKey="month"
//                     tickLine={false}
//                     axisLine={false}
//                     tickMargin={8}
//                     className="text-xs"
//                   />
//                   <YAxis
//                     tickLine={false}
//                     axisLine={false}
//                     tickMargin={8}
//                     tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
//                     className="text-xs"
//                   />
//                   <ChartTooltip
//                     content={<ChartTooltipContent hideLabel />}
//                     cursor={false}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="revenue"
//                     stroke="hsl(var(--chart-1))"
//                     strokeWidth={2}
//                     dot={false}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </ChartContainer>
//           </CardContent>
//         </Card>

//         {/* Order Status - Takes 3 columns */}
//         <Card className="col-span-3 rounded-none">
//           <CardHeader>
//             <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
//               Order Status
//             </CardTitle>
//             <CardDescription>Distribution of orders</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ChartContainer config={chartConfig}>
//               <ResponsiveContainer width="100%" height={350}>
//                 <PieChart>
//                   <ChartTooltip content={<ChartTooltipContent hideLabel />} />
//                   <Pie
//                     data={orderStatusData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={100}
//                     paddingAngle={2}
//                     dataKey="value"
//                   >
//                     {orderStatusData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.fill} />
//                     ))}
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//             </ChartContainer>
//             <div className="mt-4 flex justify-center gap-4">
//               {orderStatusData.map((entry) => (
//                 <div key={entry.name} className="flex items-center gap-2">
//                   <div
//                     className="h-3 w-3 rounded-sm"
//                     style={{ backgroundColor: entry.fill }}
//                   />
//                   <span className="text-xs text-muted-foreground">
//                     {entry.name}: {entry.value}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Bottom Row */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//         {/* Top Products */}
//         <Card className="col-span-4 rounded-none">
//           <CardHeader>
//             <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
//               Top Products
//             </CardTitle>
//             <CardDescription>
//               Best selling products by units sold
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="pl-2">
//             <ChartContainer config={chartConfig}>
//               <ResponsiveContainer width="100%" height={350}>
//                 <BarChart data={analytics.products.topSelling}>
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     className="stroke-muted"
//                   />
//                   <XAxis
//                     dataKey="_id"
//                     tickLine={false}
//                     axisLine={false}
//                     tickMargin={8}
//                     className="text-xs"
//                   />
//                   <YAxis
//                     tickLine={false}
//                     axisLine={false}
//                     tickMargin={8}
//                     className="text-xs"
//                   />
//                   <ChartTooltip content={<ChartTooltipContent hideLabel />} />
//                   <Bar
//                     dataKey="totalSold"
//                     fill="hsl(var(--chart-3))"
//                     radius={[4, 4, 0, 0]}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </ChartContainer>
//           </CardContent>
//         </Card>

//         {/* Recent Sales */}
//         <Card className="col-span-3 rounded-none">
//           <CardHeader>
//             <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
//               Best Sellers
//             </CardTitle>
//             <CardDescription>Top 5 performing products</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-6">
//               {analytics.products.bestSellers.map((product, index) => (
//                 <div key={product._id} className="flex items-center">
//                   <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
//                     {index + 1}
//                   </div>
//                   <div className="ml-4 space-y-1 flex-1">
//                     <p className="text-sm font-medium leading-none">
//                       {product.name}
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       {formatCurrency(product.price)}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default AdminAnalytics;

// // import React, { useState, useEffect } from "react";
// // import {
// //   TrendingUp,
// //   TrendingDown,
// //   DollarSign,
// //   ShoppingCart,
// //   Users,
// //   Package,
// //   Tag,
// //   Clock,
// // } from "lucide-react";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import {
// //   ChartContainer,
// //   ChartTooltip,
// //   ChartTooltipContent,
// // } from "@/components/ui/chart";
// // import {
// //   LineChart,
// //   Line,
// //   BarChart,
// //   Bar,
// //   PieChart,
// //   Pie,
// //   Cell,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   ResponsiveContainer,
// // } from "recharts";

// // // Mock data
// // const mockData = {
// //   summaryCards: {
// //     totalRevenue: 124500.5,
// //     thisMonthRevenue: 18750.25,
// //     revenueChange: 15.5,
// //     totalOrders: 342,
// //     totalUsers: 1250,
// //     userGrowth: 8.3,
// //     totalProducts: 156,
// //   },
// //   orders: {
// //     deliveredOrders: 298,
// //     pendingOrders: 44,
// //   },
// //   products: {
// //     bestSellers: [
// //       { _id: "1", name: "Pro Yoga Mat", price: 45.0 },
// //       { _id: "2", name: "Resistance Bands Set", price: 32.0 },
// //       { _id: "3", name: "Fitness Tracker", price: 89.0 },
// //       { _id: "4", name: "Water Bottle", price: 18.0 },
// //       { _id: "5", name: "Gym Bag", price: 65.0 },
// //     ],
// //     topSelling: [
// //       { _id: "Yoga Mat", totalSold: 145 },
// //       { _id: "Resistance Bands", totalSold: 132 },
// //       { _id: "Tracker", totalSold: 98 },
// //       { _id: "Water Bottle", totalSold: 167 },
// //       { _id: "Gym Bag", totalSold: 89 },
// //     ],
// //   },
// //   coupons: {
// //     totalCoupons: 12,
// //     activeCoupons: 8,
// //     usedCoupons: 234,
// //   },
// //   trends: {
// //     monthlyRevenue: [
// //       { month: "Jan", revenue: 12500 },
// //       { month: "Feb", revenue: 15200 },
// //       { month: "Mar", revenue: 14800 },
// //       { month: "Apr", revenue: 17300 },
// //       { month: "May", revenue: 16900 },
// //       { month: "Jun", revenue: 19400 },
// //       { month: "Jul", revenue: 18200 },
// //       { month: "Aug", revenue: 20100 },
// //       { month: "Sep", revenue: 22500 },
// //       { month: "Oct", revenue: 21800 },
// //       { month: "Nov", revenue: 18750 },
// //     ],
// //   },
// // };

// // const AdminAnalytics: React.FC = () => {
// //   //   const [analytics, setAnalytics] = useState(mockData);
// //   //   const [loading, setLoading] = useState(false);

// //   const [analytics, _] = useState(mockData);
// //   const [loading] = useState(false);

// //   useEffect(() => {
// //     // fetchAnalytics();
// //   }, []);

// //   const formatCurrency = (amount: any) => {
// //     return new Intl.NumberFormat("en-GB", {
// //       style: "currency",
// //       currency: "GBP",
// //     }).format(amount);
// //   };

// //   const orderStatusData = [
// //     {
// //       name: "Delivered",
// //       value: analytics.orders.deliveredOrders,
// //       fill: "hsl(var(--chart-1))",
// //     },
// //     {
// //       name: "Pending",
// //       value: analytics.orders.pendingOrders,
// //       fill: "hsl(var(--chart-2))",
// //     },
// //   ];

// //   const chartConfig = {
// //     revenue: {
// //       label: "Revenue",
// //       color: "hsl(var(--chart-1))",
// //     },
// //     totalSold: {
// //       label: "Units Sold",
// //       color: "hsl(var(--chart-1))",
// //     },
// //   };

// //   // Stat Card Component
// //   const StatCard = ({ title, value, change, icon: Icon, prefix = "" }: any) => (
// //     <div className="border bg-primary-foreground p-4">
// //       <div className="flex items-start justify-between">
// //         <div>
// //           <p className="text-xs uppercase tracking-widest text-text-primary dark:text-gray-200">
// //             {title}
// //           </p>
// //           <p className="mt-2 text-2xl font-light tracking-tight">
// //             {prefix}
// //             {typeof value === "number" && prefix === "£"
// //               ? formatCurrency(value).replace("£", "")
// //               : value}
// //           </p>
// //           {change !== undefined && (
// //             <div className="mt-2 flex items-center gap-1 text-sm">
// //               {change >= 0 ? (
// //                 <>
// //                   <TrendingUp
// //                     size={16}
// //                     className="text-green-600"
// //                     strokeWidth={1.5}
// //                   />
// //                   <span className="text-green-600">+{change.toFixed(1)}%</span>
// //                 </>
// //               ) : (
// //                 <>
// //                   <TrendingDown
// //                     size={16}
// //                     className="text-red-600"
// //                     strokeWidth={1.5}
// //                   />
// //                   <span className="text-red-600">{change.toFixed(1)}%</span>
// //                 </>
// //               )}
// //               <span className="text-gray-500">vs last month</span>
// //             </div>
// //           )}
// //         </div>
// //         <div className="rounded-full bg-muted p-3 border flex items-center justify-center">
// //           <Icon
// //             size={24}
// //             className="text-accent-foreground"
// //             strokeWidth={1.5}
// //           />
// //         </div>

// //         {/* <div className="rounded-full p-3 bg-muted flex items-center justify-center">
// //           <Icon size={24} className="text-muted-foreground" />
// //         </div> */}
// //       </div>
// //     </div>
// //   );

// //   if (loading) {
// //     return (
// //       <div className="flex h-screen items-center justify-center">
// //         <p className="text-sm text-muted-foreground">Loading...</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="flex-1 space-y-4 p-4 bg-background">
// //       {/* HEADER */}
// //       <div className="mb-12 border-b border-border pb-8">
// //         <h1 className="text-2xl lg:text-5xl font-light tracking-tight">
// //           Dashboard Analytics
// //         </h1>
// //         <p className="text-sm text-muted-foreground">
// //           Overview of your store performance
// //         </p>
// //       </div>

// //       {/* Summary Cards */}
// //       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
// //         <StatCard
// //           title="Total Revenue"
// //           value={analytics.summaryCards.totalRevenue}
// //           prefix="£"
// //           icon={DollarSign}
// //         />
// //         <StatCard
// //           title="This Month"
// //           value={analytics.summaryCards.thisMonthRevenue}
// //           change={analytics.summaryCards.revenueChange}
// //           prefix="£"
// //           icon={TrendingUp}
// //         />
// //         <StatCard
// //           title="Orders"
// //           value={analytics.summaryCards.totalOrders}
// //           icon={ShoppingCart}
// //         />
// //         <StatCard
// //           title="Customers"
// //           value={analytics.summaryCards.totalUsers}
// //           change={analytics.summaryCards.userGrowth}
// //           icon={Users}
// //         />
// //       </div>

// //       {/* Secondary Stats */}
// //       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
// //         <StatCard
// //           title="Products"
// //           value={analytics.summaryCards.totalProducts}
// //           icon={Package}
// //         />
// //         <StatCard
// //           title="Active Coupons"
// //           value={`${analytics.coupons.activeCoupons}/${analytics.coupons.totalCoupons}`}
// //           icon={Tag}
// //         />
// //         <StatCard
// //           title="Pending Orders"
// //           value={analytics.orders.pendingOrders}
// //           icon={Clock}
// //         />
// //       </div>

// //       {/* Charts Grid */}
// //       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
// //         {/* Revenue Trend - Takes 4 columns */}
// //         <Card className="col-span-4 rounded-none bg-primary-foreground">
// //           <CardHeader>
// //             <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
// //               Revenue Overview
// //             </CardTitle>
// //             <CardDescription>Monthly revenue for 2024</CardDescription>
// //           </CardHeader>
// //           <CardContent className="pl-2">
// //             <ChartContainer config={chartConfig}>
// //               <ResponsiveContainer width="100%" height={350}>
// //                 <LineChart data={analytics.trends.monthlyRevenue}>
// //                   <CartesianGrid
// //                     strokeDasharray="3 3"
// //                     className="stroke-muted"
// //                   />
// //                   <XAxis
// //                     dataKey="month"
// //                     tickLine={false}
// //                     axisLine={false}
// //                     tickMargin={8}
// //                     className="text-xs"
// //                   />
// //                   <YAxis
// //                     tickLine={false}
// //                     axisLine={false}
// //                     tickMargin={8}
// //                     tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
// //                     className="text-xs"
// //                   />
// //                   <ChartTooltip
// //                     content={<ChartTooltipContent hideLabel />}
// //                     cursor={false}
// //                   />
// //                   <Line
// //                     type="monotone"
// //                     dataKey="revenue"
// //                     stroke="hsl(var(--chart-1))"
// //                     strokeWidth={2}
// //                     dot={false}
// //                   />
// //                 </LineChart>
// //               </ResponsiveContainer>
// //             </ChartContainer>
// //           </CardContent>
// //         </Card>

// //         {/* Order Status - Takes 3 columns */}
// //         <Card className="col-span-3 rounded-none bg-primary-foreground">
// //           <CardHeader>
// //             <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
// //               Order Status
// //             </CardTitle>
// //             <CardDescription>Distribution of orders</CardDescription>
// //           </CardHeader>
// //           <CardContent>
// //             <ChartContainer config={chartConfig}>
// //               <ResponsiveContainer width="100%" height={350}>
// //                 <PieChart>
// //                   <ChartTooltip content={<ChartTooltipContent hideLabel />} />
// //                   <Pie
// //                     data={orderStatusData}
// //                     cx="50%"
// //                     cy="50%"
// //                     innerRadius={60}
// //                     outerRadius={100}
// //                     paddingAngle={2}
// //                     dataKey="value"
// //                   >
// //                     {orderStatusData.map((entry, index) => (
// //                       <Cell key={`cell-${index}`} fill={entry.fill} />
// //                     ))}
// //                   </Pie>
// //                 </PieChart>
// //               </ResponsiveContainer>
// //             </ChartContainer>
// //             <div className="mt-4 flex justify-center gap-4">
// //               {orderStatusData.map((entry) => (
// //                 <div key={entry.name} className="flex items-center gap-2">
// //                   <div
// //                     className="h-3 w-3 rounded-sm"
// //                     style={{ backgroundColor: entry.fill }}
// //                   />
// //                   <span className="text-xs text-muted-foreground">
// //                     {entry.name}: {entry.value}
// //                   </span>
// //                 </div>
// //               ))}
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </div>

// //       {/* Bottom Row */}
// //       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
// //         {/* Top Products */}
// //         <Card className="col-span-4 rounded-none bg-primary-foreground">
// //           <CardHeader>
// //             <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
// //               Top Products
// //             </CardTitle>
// //             <CardDescription>
// //               Best selling products by units sold
// //             </CardDescription>
// //           </CardHeader>
// //           <CardContent className="pl-2">
// //             <ChartContainer config={chartConfig}>
// //               <ResponsiveContainer width="100%" height={350}>
// //                 <BarChart data={analytics.products.topSelling}>
// //                   <CartesianGrid
// //                     strokeDasharray="3 3"
// //                     className="stroke-muted"
// //                   />
// //                   <XAxis
// //                     dataKey="_id"
// //                     tickLine={false}
// //                     axisLine={false}
// //                     tickMargin={8}
// //                     className="text-xs"
// //                   />
// //                   <YAxis
// //                     tickLine={false}
// //                     axisLine={false}
// //                     tickMargin={8}
// //                     className="text-xs"
// //                   />
// //                   <ChartTooltip content={<ChartTooltipContent hideLabel />} />
// //                   <Bar
// //                     dataKey="totalSold"
// //                     fill="hsl(var(--chart-3))"
// //                     radius={[4, 4, 0, 0]}
// //                   />
// //                 </BarChart>
// //               </ResponsiveContainer>
// //             </ChartContainer>
// //           </CardContent>
// //         </Card>

// //         {/* Recent Sales */}
// //         <Card className="col-span-3 rounded-none bg-primary-foreground">
// //           <CardHeader>
// //             <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
// //               Best Sellers
// //             </CardTitle>
// //             <CardDescription>Top 5 performing products</CardDescription>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="space-y-6">
// //               {analytics.products.bestSellers.map((product, index) => (
// //                 <div key={product._id} className="flex items-center">
// //                   <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
// //                     {index + 1}
// //                   </div>
// //                   <div className="ml-4 space-y-1 flex-1">
// //                     <p className="text-sm font-medium leading-none">
// //                       {product.name}
// //                     </p>
// //                     <p className="text-sm text-muted-foreground">
// //                       {formatCurrency(product.price)}
// //                     </p>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminAnalytics;

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Tag,
  Clock,
  Percent,
  Target,
  Activity,
} from "lucide-react";
// import Axios from "axios";
// import { URL } from "@/lib/constants";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Enhanced Mock Data
const mockData = {
  summaryCards: {
    totalRevenue: 124500.5,
    thisMonthRevenue: 18750.25,
    revenueChange: 15.5,
    totalOrders: 342,
    thisMonthOrders: 48,
    ordersChange: 12.3,
    totalUsers: 1250,
    thisMonthUsers: 87,
    userGrowth: 8.3,
    totalProducts: 156,
    averageOrderValue: 364.33,
    aovChange: 5.2,
    conversionRate: 3.8,
    conversionChange: 0.5,
  },
  orders: {
    deliveredOrders: 298,
    pendingOrders: 44,
    processingOrders: 28,
    shippedOrders: 15,
    cancelledOrders: 12,
  },
  products: {
    bestSellers: [
      { _id: "1", name: "Pro Yoga Mat", price: 45.0, sales: 145 },
      { _id: "2", name: "Resistance Bands Set", price: 32.0, sales: 132 },
      { _id: "3", name: "Fitness Tracker", price: 89.0, sales: 98 },
      { _id: "4", name: "Water Bottle", price: 18.0, sales: 167 },
      { _id: "5", name: "Gym Bag", price: 65.0, sales: 89 },
    ],
    topSelling: [
      { name: "Yoga Mat", totalSold: 145, revenue: 6525 },
      { name: "Resistance Bands", totalSold: 132, revenue: 4224 },
      { name: "Tracker", totalSold: 98, revenue: 8722 },
      { name: "Water Bottle", totalSold: 167, revenue: 3006 },
      { name: "Gym Bag", totalSold: 89, revenue: 5785 },
    ],
    lowStock: [
      { name: "Yoga Mat", stock: 5 },
      { name: "Dumbbells", stock: 3 },
      { name: "Resistance Bands", stock: 8 },
    ],
  },
  coupons: {
    totalCoupons: 12,
    activeCoupons: 8,
    usedCoupons: 234,
    totalDiscount: 3450.75,
    mostUsedCoupon: { code: "SUMMER20", uses: 89 },
  },
  trends: {
    monthlyRevenue: [
      { month: "Jan", revenue: 12500, orders: 45 },
      { month: "Feb", revenue: 15200, orders: 52 },
      { month: "Mar", revenue: 14800, orders: 48 },
      { month: "Apr", revenue: 17300, orders: 61 },
      { month: "May", revenue: 16900, orders: 58 },
      { month: "Jun", revenue: 19400, orders: 67 },
      { month: "Jul", revenue: 18200, orders: 63 },
      { month: "Aug", revenue: 20100, orders: 71 },
      { month: "Sep", revenue: 22500, orders: 78 },
      { month: "Oct", revenue: 21800, orders: 75 },
      { month: "Nov", revenue: 18750, orders: 48 },
    ],
    dailyRevenue: [
      { day: "Mon", revenue: 2100 },
      { day: "Tue", revenue: 2800 },
      { day: "Wed", revenue: 2400 },
      { day: "Thu", revenue: 3200 },
      { day: "Fri", revenue: 4100 },
      { day: "Sat", revenue: 3800 },
      { day: "Sun", revenue: 2900 },
    ],
  },
  userMetrics: {
    newUsers: 87,
    returningCustomers: 163,
    userRetentionRate: 65.2,
    averageLifetimeValue: 892.45,
  },
  geography: {
    topCities: [
      { city: "London", orders: 89, revenue: 32450 },
      { city: "Manchester", orders: 56, revenue: 20340 },
      { city: "Birmingham", orders: 43, revenue: 15670 },
      { city: "Leeds", orders: 38, revenue: 13890 },
      { city: "Liverpool", orders: 32, revenue: 11650 },
    ],
  },
  performance: {
    categories: [
      { category: "Yoga", performance: 85 },
      { category: "Fitness", performance: 92 },
      { category: "Accessories", performance: 78 },
      { category: "Apparel", performance: 88 },
      { category: "Equipment", performance: 81 },
    ],
  },
  hourlyActivity: [
    { hour: "12 AM", orders: 2 },
    { hour: "3 AM", orders: 1 },
    { hour: "6 AM", orders: 5 },
    { hour: "9 AM", orders: 18 },
    { hour: "12 PM", orders: 28 },
    { hour: "3 PM", orders: 32 },
    { hour: "6 PM", orders: 41 },
    { hour: "9 PM", orders: 25 },
  ],
  paymentMethods: [
    { method: "Credit Card", value: 215, fill: "hsl(var(--chart-1))" },
    { method: "Debit Card", value: 89, fill: "hsl(var(--chart-2))" },
    { method: "PayPal", value: 38, fill: "hsl(var(--chart-3))" },
  ],
};

const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState(mockData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Uncomment when API is ready
      // const response = await Axios.get(`${URL}/analytics/dashboard`, {
      //   withCredentials: true,
      // });
      // if (response.status === 200) {
      //   setAnalytics(response.data);
      // }

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAnalytics(mockData);
    } catch (error) {
      toast.error("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  const orderStatusData = [
    {
      name: "Delivered",
      value: analytics.orders.deliveredOrders,
      fill: "hsl(var(--chart-1))",
    },
    {
      name: "Processing",
      value: analytics.orders.processingOrders,
      fill: "hsl(var(--chart-2))",
    },
    {
      name: "Pending",
      value: analytics.orders.pendingOrders,
      fill: "hsl(var(--chart-3))",
    },
    {
      name: "Shipped",
      value: analytics.orders.shippedOrders,
      fill: "hsl(var(--chart-4))",
    },
    {
      name: "Cancelled",
      value: analytics.orders.cancelledOrders,
      fill: "hsl(var(--chart-5))",
    },
  ];

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
    orders: {
      label: "Orders",
      color: "hsl(var(--chart-2))",
    },
    totalSold: {
      label: "Units Sold",
      color: "hsl(var(--chart-1))",
    },
  };

  // Stat Card Component
  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    prefix = "",
    suffix = "",
  }: any) => (
    <div className="border p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs uppercase text-muted-foreground tracking-wider">
            {title}
          </p>
          <p className="mt-2 text-3xl font-light tracking-tight">
            {prefix}
            {typeof value === "number" && prefix === "£"
              ? formatCurrency(value).replace("£", "")
              : value}
            {suffix}
          </p>
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1 text-sm">
              {change >= 0 ? (
                <>
                  <TrendingUp size={14} className="text-green-600" />
                  <span className="text-green-600">+{change.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown size={14} className="text-red-600" />
                  <span className="text-red-600">{change.toFixed(1)}%</span>
                </>
              )}
              <span className="text-muted-foreground text-xs">
                vs last month
              </span>
            </div>
          )}
        </div>
        <div className="rounded-full bg-muted p-3 border flex items-center justify-center">
          <Icon
            size={20}
            className="text-accent-foreground"
            strokeWidth={1.5}
          />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 bg-background">
      {/* HEADER */}
      <div className="mb-5 border-b border-border pb-8">
        <h1 className="text-2xl lg:text-5xl font-light tracking-tight mb-3">
          Dashboard Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Comprehensive overview of your store performance and metrics
        </p>
      </div>

      {/* Primary Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={analytics.summaryCards.totalRevenue}
          change={analytics.summaryCards.revenueChange}
          prefix="£"
          icon={DollarSign}
        />
        <StatCard
          title="Total Orders"
          value={analytics.summaryCards.totalOrders}
          change={analytics.summaryCards.ordersChange}
          icon={ShoppingCart}
        />
        <StatCard
          title="Customers"
          value={analytics.summaryCards.totalUsers}
          change={analytics.summaryCards.userGrowth}
          icon={Users}
        />
        <StatCard
          title="Avg Order Value"
          value={analytics.summaryCards.averageOrderValue}
          change={analytics.summaryCards.aovChange}
          prefix="£"
          icon={Target}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Conversion Rate"
          value={analytics.summaryCards.conversionRate}
          change={analytics.summaryCards.conversionChange}
          suffix="%"
          icon={Percent}
        />
        <StatCard
          title="Products"
          value={analytics.summaryCards.totalProducts}
          icon={Package}
        />
        <StatCard
          title="Active Coupons"
          value={`${analytics.coupons.activeCoupons}/${analytics.coupons.totalCoupons}`}
          icon={Tag}
        />
        <StatCard
          title="Pending Orders"
          value={analytics.orders.pendingOrders}
          icon={Clock}
        />

        {/* <StatCard
          title="Retention Rate"
          value={analytics.userMetrics.userRetentionRate}
          suffix="%"
          icon={Award}
        /> */}
      </div>

      {/* Revenue & Orders Trend */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 sm:col-span-4 rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Revenue & Orders Overview
            </CardTitle>
            <CardDescription>Monthly performance trends</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={analytics.trends.monthlyRevenue}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorOrders"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--chart-2))"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--chart-2))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                  />
                  <YAxis
                    yAxisId="left"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                    className="text-xs"
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--chart-1))"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="hsl(var(--chart-2))"
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card className="col-span-1 sm:col-span-3 rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Order Status
            </CardTitle>
            <CardDescription>Current order distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {orderStatusData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-sm"
                    style={{ backgroundColor: entry.fill }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Revenue & Hourly Activity */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Weekly Revenue Pattern
            </CardTitle>
            <CardDescription>Revenue by day of week</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.trends.dailyRevenue}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `£${(value / 1000).toFixed(1)}k`}
                    className="text-xs"
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Bar
                    dataKey="revenue"
                    fill="hsl(var(--chart-1))"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Hourly Order Activity
            </CardTitle>
            <CardDescription>Orders throughout the day</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.hourlyActivity}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="hour"
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance & Top Cities */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 sm:col-span-3 rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Category Performance
            </CardTitle>
            <CardDescription>Performance metrics by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={analytics.performance.categories}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" className="text-xs" />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    className="text-xs"
                  />
                  <Radar
                    name="Performance"
                    dataKey="performance"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.6}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 sm:col-span-4 rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Top Performing Cities
            </CardTitle>
            <CardDescription>Revenue by location</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={analytics.geography.topCities}
                  layout="vertical"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                    className="text-xs"
                  />
                  <YAxis
                    type="category"
                    dataKey="city"
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="revenue"
                    fill="hsl(var(--chart-2))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products & Payment Methods */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 sm:col-span-4 rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Top Selling Products
            </CardTitle>
            <CardDescription>Best performers by revenue</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={analytics.products.topSelling}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `£${(value / 1000).toFixed(1)}k`}
                    className="text-xs"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="revenue"
                    fill="hsl(var(--chart-3))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 sm:col-span-3 rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Payment Methods
            </CardTitle>
            <CardDescription>Transaction breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={analytics.paymentMethods}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {analytics.paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {analytics.paymentMethods.map((entry) => (
                <div
                  key={entry.method}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: entry.fill }}
                    />
                    <span className="text-sm">{entry.method}</span>
                  </div>
                  <span className="text-sm font-medium">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Insights & Low Stock Alert */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Customer Insights
            </CardTitle>
            <CardDescription>User behavior metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-sm text-muted-foreground">New Customers</p>
                  <p className="text-2xl font-light mt-1">
                    {analytics.userMetrics.newUsers}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Returning Customers
                  </p>
                  <p className="text-2xl font-light mt-1">
                    {analytics.userMetrics.returningCustomers}
                  </p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Avg Lifetime Value
                  </p>
                  <p className="text-2xl font-light mt-1">
                    {formatCurrency(analytics.userMetrics.averageLifetimeValue)}
                  </p>
                </div>
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Low Stock Alert
            </CardTitle>
            <CardDescription>Products requiring restocking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.products.lowStock.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Low inventory
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-red-600">
                      {product.stock}
                    </p>
                    <p className="text-xs text-muted-foreground">units left</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
