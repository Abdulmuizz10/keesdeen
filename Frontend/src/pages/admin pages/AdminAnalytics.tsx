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
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartLegend,
  ChartLegendContent,
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
  XAxis,
  YAxis,
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Mock data
const mockData = {
  summaryCards: {
    totalRevenue: 124500.5,
    thisMonthRevenue: 18750.25,
    revenueChange: 15.5,
    totalOrders: 342,
    totalUsers: 1250,
    userGrowth: 8.3,
    totalProducts: 156,
  },
  orders: {
    deliveredOrders: 298,
    pendingOrders: 44,
  },
  products: {
    bestSellers: [
      { _id: "1", name: "Pro Yoga Mat", price: 45.0 },
      { _id: "2", name: "Resistance Bands Set", price: 32.0 },
      { _id: "3", name: "Fitness Tracker", price: 89.0 },
      { _id: "4", name: "Water Bottle", price: 18.0 },
      { _id: "5", name: "Gym Bag", price: 65.0 },
    ],
    topSelling: [
      { _id: "Yoga Mat", totalSold: 145 },
      { _id: "Resistance Bands", totalSold: 132 },
      { _id: "Tracker", totalSold: 98 },
      { _id: "Water Bottle", totalSold: 167 },
      { _id: "Gym Bag", totalSold: 89 },
    ],
  },
  coupons: {
    totalCoupons: 12,
    activeCoupons: 8,
    usedCoupons: 234,
  },
  trends: {
    monthlyRevenue: [
      { month: "Jan", revenue: 12500 },
      { month: "Feb", revenue: 15200 },
      { month: "Mar", revenue: 14800 },
      { month: "Apr", revenue: 17300 },
      { month: "May", revenue: 16900 },
      { month: "Jun", revenue: 19400 },
      { month: "Jul", revenue: 18200 },
      { month: "Aug", revenue: 20100 },
      { month: "Sep", revenue: 22500 },
      { month: "Oct", revenue: 21800 },
      { month: "Nov", revenue: 18750 },
    ],
  },
  totalVisitors: [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ],
};

const AdminAnalytics: React.FC = () => {
  //   const [analytics, setAnalytics] = useState(mockData);
  //   const [loading, setLoading] = useState(false);

  const [analytics, _] = useState(mockData);
  const [loading] = useState(false);

  useEffect(() => {
    // fetchAnalytics();
  }, []);

  const formatCurrency = (amount: any) => {
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
      name: "Pending",
      value: analytics.orders.pendingOrders,
      fill: "hsl(var(--chart-2))",
    },
  ];

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
    totalSold: {
      label: "Units Sold",
      color: "hsl(var(--chart-1))",
    },
    desktop: {
      label: "Desktop Visitors",
      color: "hsl(var(--chart-2))",
    },
    mobile: {
      label: "Mobile Visitors",
      color: "hsl(var(--chart-3))",
    },
  };

  // Stat Card Component
  const StatCard = ({ title, value, change, icon: Icon, prefix = "" }: any) => (
    <div className="border bg-primary-foreground p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-500">
            {title}
          </p>
          <p className="mt-2 text-2xl font-light tracking-tight">
            {prefix}
            {typeof value === "number" && prefix === "£"
              ? formatCurrency(value).replace("£", "")
              : value}
          </p>
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1 text-sm">
              {change >= 0 ? (
                <>
                  <TrendingUp
                    size={16}
                    className="text-green-600"
                    strokeWidth={1.5}
                  />
                  <span className="text-green-600">+{change.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown
                    size={16}
                    className="text-red-600"
                    strokeWidth={1.5}
                  />
                  <span className="text-red-600">{change.toFixed(1)}%</span>
                </>
              )}
              <span className="text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className="rounded-full bg-muted p-3 border flex items-center justify-center">
          <Icon size={24} className="text-muted-foreground" strokeWidth={1.5} />
        </div>

        {/* <div className="rounded-full p-3 bg-muted flex items-center justify-center">
          <Icon size={24} className="text-muted-foreground" />
        </div> */}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 bg-background">
      {/* HEADER */}
      <div className="mb-12 border-b border-border pb-8">
        <h1 className="text-2xl lg:text-5xl font-light tracking-tight">
          Dashboard Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Overview of your store performance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={analytics.summaryCards.totalRevenue}
          prefix="£"
          icon={DollarSign}
        />
        <StatCard
          title="This Month"
          value={analytics.summaryCards.thisMonthRevenue}
          change={analytics.summaryCards.revenueChange}
          prefix="£"
          icon={TrendingUp}
        />
        <StatCard
          title="Orders"
          value={analytics.summaryCards.totalOrders}
          icon={ShoppingCart}
        />
        <StatCard
          title="Customers"
          value={analytics.summaryCards.totalUsers}
          change={analytics.summaryCards.userGrowth}
          icon={Users}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue Trend - Takes 4 columns */}
        <Card className="col-span-4 rounded-none bg-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Revenue Overview
            </CardTitle>
            <CardDescription>Monthly revenue for 2024</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={analytics.trends.monthlyRevenue}>
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
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                    className="text-xs"
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent hideLabel />}
                    cursor={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Order Status - Takes 3 columns */}
        <Card className="col-span-3 rounded-none bg-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Order Status
            </CardTitle>
            <CardDescription>Distribution of orders</CardDescription>
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
            <div className="mt-4 flex justify-center gap-4">
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

      {/* Bottom Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Top Products */}
        <Card className="col-span-4 rounded-none bg-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Top Products
            </CardTitle>
            <CardDescription>
              Best selling products by units sold
            </CardDescription>
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
                    dataKey="_id"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Bar
                    dataKey="totalSold"
                    fill="hsl(var(--chart-3))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="col-span-3 rounded-none bg-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Best Sellers
            </CardTitle>
            <CardDescription>Top 5 performing products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analytics.products.bestSellers.map((product, index) => (
                <div key={product._id} className="flex items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="ml-4 space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">
                      {product.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Total visitors */}
        <Card className="col-span-4 rounded-none bg-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Total Visitors
            </CardTitle>
            <CardDescription>All data for visitors</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart accessibilityLayer data={analytics.totalVisitors}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <defs>
                    <linearGradient
                      id="fillDesktop"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={chartConfig.desktop.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartConfig.mobile.color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>

                    <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={`hsl(var(--color-mobile))`} // make sure --color-mobile is defined
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={`hsl(var(--color-mobile))`}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>

                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="url(#fillDesktop)"
                    stroke={chartConfig.desktop.color}
                    fillOpacity={0.4}
                    stackId="a"
                  />

                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="url(#fillMobile)"
                    stroke={chartConfig.mobile.color}
                    fillOpacity={0.4}
                    stackId="a"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="col-span-3 rounded-none bg-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Best Sellers
            </CardTitle>
            <CardDescription>Top 5 performing products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analytics.products.bestSellers.map((product, index) => (
                <div key={product._id} className="flex items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="ml-4 space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">
                      {product.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(product.price)}
                    </p>
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
