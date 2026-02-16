import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Tag,
  Percent,
  Target,
  Activity,
  Mail,
  CreditCard,
  Star,
  AlertTriangle,
  Truck,
} from "lucide-react";
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
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosConfig";

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
    unavailableProducts: 12,
    newArrivals: 23,
  },
  coupons: {
    totalCoupons: 12,
    activeCoupons: 8,
    usedCoupons: 234,
    totalDiscount: 3450.75,
    mostUsedCoupon: { code: "SUMMER20", uses: 89 },
    avgDiscountValue: 14.75,
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
    googleAuthUsers: 342,
    passwordAuthUsers: 908,
    adminUsers: 5,
  },
  geography: {
    topCountries: [
      { country: "United Kingdom", orders: 189, revenue: 68450 },
      { country: "United States", orders: 98, revenue: 35670 },
      { country: "Canada", orders: 43, revenue: 15890 },
      { country: "Australia", orders: 28, revenue: 10230 },
      { country: "Nigeria", orders: 45, revenue: 16890 },
    ],
    topStates: [
      { state: "London", orders: 89, revenue: 32450 },
      { state: "Manchester", orders: 56, revenue: 20340 },
      { state: "California", orders: 43, revenue: 15670 },
      { state: "Lagos", orders: 38, revenue: 13890 },
      { state: "Ontario", orders: 32, revenue: 11650 },
    ],
  },
  performance: {
    categories: [
      { category: "Yoga", performance: 85, revenue: 45230 },
      { category: "Fitness", performance: 92, revenue: 52340 },
      { category: "Accessories", performance: 78, revenue: 38670 },
      { category: "Apparel", performance: 88, revenue: 47890 },
      { category: "Equipment", performance: 81, revenue: 41250 },
    ],
    subcategories: [
      { name: "Mats", sales: 234 },
      { name: "Bands", sales: 189 },
      { name: "Weights", sales: 156 },
      { name: "Trackers", sales: 143 },
      { name: "Bottles", sales: 267 },
    ],
    types: [
      { type: "Premium", orders: 145 },
      { type: "Standard", orders: 198 },
      { type: "Basic", orders: 87 },
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
    { method: "Square", value: 342, fill: "hsl(var(--chart-1))" },
  ],
  paymentDetails: {
    totalTransactions: 342,
    successfulPayments: 325,
    failedPayments: 17,
    averageTransactionValue: 364.33,
    totalAmountPaid: 124500.5,
    cardPayments: 298,
    otherPayments: 27,
    highRiskTransactions: 8,
  },
  subscribers: {
    totalSubscribers: 2340,
    activeSubscribers: 2198,
    unsubscribed: 112,
    bounced: 30,
    thisMonthSubscribers: 156,
    subscriberGrowth: 7.2,
    emailsSent: 12450,
    emailsOpened: 8934,
    emailsClicked: 3421,
    openRate: 71.8,
    clickRate: 27.5,
  },
  reviews: {
    totalReviews: 892,
    averageRating: 4.6,
    thisMonthReviews: 67,
    ratingDistribution: [
      { rating: 5, count: 567 },
      { rating: 4, count: 234 },
      { rating: 3, count: 67 },
      { rating: 2, count: 18 },
      { rating: 1, count: 6 },
    ],
  },
  shipping: {
    averageShippingCost: 8.5,
    totalShippingRevenue: 2907,
    freeShippingOrders: 145,
    paidShippingOrders: 197,
  },
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
      const response = await axiosInstance.get(`/analytics/dashboard`);
      if (response.status === 200) {
        setAnalytics(response.data);
      }
      // Simulating API call
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      // setAnalytics(mockData);
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
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

  const authMethodData = [
    {
      name: "Password Auth",
      value: analytics.userMetrics.passwordAuthUsers,
      fill: "hsl(var(--chart-1))",
    },
    {
      name: "Google Auth",
      value: analytics.userMetrics.googleAuthUsers,
      fill: "hsl(var(--chart-2))",
    },
  ];

  const subscriberStatusData = [
    {
      name: "Active",
      value: analytics.subscribers.activeSubscribers,
      fill: "hsl(var(--chart-1))",
    },
    {
      name: "Unsubscribed",
      value: analytics.subscribers.unsubscribed,
      fill: "hsl(var(--chart-3))",
    },
    {
      name: "Bounced",
      value: analytics.subscribers.bounced,
      fill: "hsl(var(--chart-5))",
    },
  ];

  const chartConfig = {
    revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
    orders: { label: "Orders", color: "hsl(var(--chart-2))" },
  };

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
      <div className="mb-5 border-b border-border pb-8">
        <h1 className="text-2xl lg:text-5xl font-light tracking-tight mb-3">
          Dashboard Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Comprehensive overview of your store performance and metrics
        </p>
      </div>

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
          title="Active Subscribers"
          value={analytics.subscribers.activeSubscribers}
          change={analytics.subscribers.subscriberGrowth}
          icon={Mail}
        />
      </div>

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
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                    className="text-xs"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--chart-1))"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 sm:col-span-3 rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Order Status
            </CardTitle>
            <CardDescription>Current order distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
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

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Category Performance
            </CardTitle>
            <CardDescription>Revenue by category</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
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

        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Top Products
            </CardTitle>
            <CardDescription>Best sellers by revenue</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
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
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Top Countries
            </CardTitle>
            <CardDescription>Revenue by country</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={analytics.geography.topCountries}
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
                    dataKey="country"
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                    width={100}
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

        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Top States/Cities
            </CardTitle>
            <CardDescription>Orders by location</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.geography.topStates}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="state"
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="orders"
                    fill="hsl(var(--chart-3))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              User Authentication
            </CardTitle>
            <CardDescription>How users sign up</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={authMethodData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label
                  >
                    {authMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Subscriber Status
            </CardTitle>
            <CardDescription>Email list breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={subscriberStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {subscriberStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Open Rate:</span>
                <span className="font-medium">
                  {analytics.subscribers.openRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Click Rate:</span>
                <span className="font-medium">
                  {analytics.subscribers.clickRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Payment Insights
            </CardTitle>
            <CardDescription>Square payment metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Successful Payments
                  </p>
                  <p className="text-2xl font-light mt-1">
                    {analytics.paymentDetails.successfulPayments}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Failed Payments
                  </p>
                  <p className="text-2xl font-light mt-1">
                    {analytics.paymentDetails.failedPayments}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-red-600" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    High Risk Transactions
                  </p>
                  <p className="text-2xl font-light mt-1">
                    {analytics.paymentDetails.highRiskTransactions}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Review Insights
            </CardTitle>
            <CardDescription>Product reviews and ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                  <p className="text-2xl font-light mt-1">
                    {analytics.reviews.totalReviews}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Average Rating
                  </p>
                  <p className="text-2xl font-light mt-1">
                    {analytics.reviews.averageRating.toFixed(1)} / 5.0
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-light mt-1">
                    {analytics.reviews.thisMonthReviews}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Customer Metrics
            </CardTitle>
            <CardDescription>User behavior analysis</CardDescription>
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
                <Users className="h-8 w-8 text-blue-600" />
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
                <Activity className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Retention Rate
                  </p>
                  <p className="text-2xl font-light mt-1">
                    {analytics.userMetrics.userRetentionRate.toFixed(1)}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
              Shipping Metrics
            </CardTitle>
            <CardDescription>Delivery and shipping stats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Avg Shipping Cost
                  </p>
                  <p className="text-2xl font-light mt-1">
                    {formatCurrency(analytics.shipping.averageShippingCost)}
                  </p>
                </div>
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Free Shipping Orders
                  </p>
                  <p className="text-2xl font-light mt-1">
                    {analytics.shipping.freeShippingOrders}
                  </p>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Paid Shipping Orders
                  </p>
                  <p className="text-2xl font-light mt-1">
                    {analytics.shipping.paidShippingOrders}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
