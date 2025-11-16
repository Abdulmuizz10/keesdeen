import OrderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";
import ProductModel from "../models/productModel.js";
import CouponModel from "../models/couponModel.js";

const getDashboardAnalyticsController = async (req, res) => {
  try {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const thisYearStart = new Date(now.getFullYear(), 0, 1);

    // ========== REVENUE METRICS ==========

    // 1. Total Revenue (All Time)
    const totalRevenueAgg = await OrderModel.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // 2. Monthly Revenue (Current vs Last)
    const [thisMonthRevenueAgg, lastMonthRevenueAgg] = await Promise.all([
      OrderModel.aggregate([
        { $match: { createdAt: { $gte: thisMonthStart } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      OrderModel.aggregate([
        { $match: { createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
    ]);
    const thisMonthRevenue = thisMonthRevenueAgg[0]?.total || 0;
    const lastMonthRevenue = lastMonthRevenueAgg[0]?.total || 0;
    const revenueChange =
      lastMonthRevenue === 0
        ? 0
        : ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

    // ========== ORDER METRICS ==========

    // 3. Total Orders & Monthly Growth
    const totalOrders = await OrderModel.countDocuments();
    const thisMonthOrders = await OrderModel.countDocuments({
      createdAt: { $gte: thisMonthStart },
    });
    const lastMonthOrders = await OrderModel.countDocuments({
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
    });
    const ordersChange =
      lastMonthOrders === 0
        ? 0
        : ((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100;

    // 4. Order Status Breakdown
    const [
      deliveredOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      cancelledOrders,
    ] = await Promise.all([
      OrderModel.countDocuments({ isDelivered: "Delivered" }),
      OrderModel.countDocuments({ isDelivered: "Pending" }),
      OrderModel.countDocuments({ isDelivered: "Processing" }),
      OrderModel.countDocuments({ isDelivered: "Shipped" }),
      OrderModel.countDocuments({ isDelivered: "Cancelled" }),
    ]);

    // 5. Average Order Value (AOV)
    const aovAgg = await OrderModel.aggregate([
      { $group: { _id: null, avgOrder: { $avg: "$totalPrice" } } },
    ]);
    const averageOrderValue = aovAgg[0]?.avgOrder || 0;

    const [thisMonthAovAgg, lastMonthAovAgg] = await Promise.all([
      OrderModel.aggregate([
        { $match: { createdAt: { $gte: thisMonthStart } } },
        { $group: { _id: null, avgOrder: { $avg: "$totalPrice" } } },
      ]),
      OrderModel.aggregate([
        { $match: { createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } } },
        { $group: { _id: null, avgOrder: { $avg: "$totalPrice" } } },
      ]),
    ]);
    const thisMonthAov = thisMonthAovAgg[0]?.avgOrder || 0;
    const lastMonthAov = lastMonthAovAgg[0]?.avgOrder || 0;
    const aovChange =
      lastMonthAov === 0
        ? 0
        : ((thisMonthAov - lastMonthAov) / lastMonthAov) * 100;

    // ========== USER METRICS ==========

    // 6. User Growth
    const totalUsers = await UserModel.countDocuments();
    const thisMonthUsers = await UserModel.countDocuments({
      createdAt: { $gte: thisMonthStart },
    });
    const lastMonthUsers = await UserModel.countDocuments({
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
    });
    const userGrowth =
      lastMonthUsers === 0
        ? 0
        : ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100;

    // 7. Customer Insights
    const usersWithOrders = await OrderModel.distinct("email");
    const returningCustomers = await OrderModel.aggregate([
      { $group: { _id: "$email", orderCount: { $sum: 1 } } },
      { $match: { orderCount: { $gt: 1 } } },
      { $count: "total" },
    ]);
    const returningCustomersCount = returningCustomers[0]?.total || 0;
    const newCustomers = thisMonthUsers;

    // 8. User Retention Rate
    const userRetentionRate =
      usersWithOrders.length > 0
        ? (returningCustomersCount / usersWithOrders.length) * 100
        : 0;

    // 9. Average Customer Lifetime Value
    const lifetimeValueAgg = await OrderModel.aggregate([
      { $group: { _id: "$email", totalSpent: { $sum: "$totalPrice" } } },
      { $group: { _id: null, avgLifetimeValue: { $avg: "$totalSpent" } } },
    ]);
    const averageLifetimeValue = lifetimeValueAgg[0]?.avgLifetimeValue || 0;

    // 10. Conversion Rate (Orders / Total Users)
    const conversionRate =
      totalUsers > 0 ? (totalOrders / totalUsers) * 100 : 0;
    const thisMonthConversionRate =
      thisMonthUsers > 0 ? (thisMonthOrders / thisMonthUsers) * 100 : 0;
    const lastMonthConversionRate =
      lastMonthUsers > 0 ? (lastMonthOrders / lastMonthUsers) * 100 : 0;
    const conversionChange =
      lastMonthConversionRate === 0
        ? 0
        : thisMonthConversionRate - lastMonthConversionRate;

    // ========== PRODUCT METRICS ==========

    // 11. Product Stats
    const totalProducts = await ProductModel.countDocuments();
    const bestSellers = await ProductModel.find({ bestSeller: true })
      .select("name price images")
      .limit(5)
      .lean();

    // 12. Top Selling Products (by quantity)
    const topSelling = await OrderModel.aggregate([
      { $unwind: "$orderedItems" },
      {
        $group: {
          _id: "$orderedItems.name",
          totalSold: { $sum: "$orderedItems.qty" },
          totalRevenue: {
            $sum: { $multiply: ["$orderedItems.qty", "$orderedItems.price"] },
          },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      {
        $project: {
          name: "$_id",
          totalSold: 1,
          revenue: "$totalRevenue",
          _id: 0,
        },
      },
    ]);

    // 13. Low Stock Products (assuming you have a stock field)
    const lowStock = await ProductModel.find({
      stock: { $lte: 10, $gt: 0 },
    })
      .select("name stock")
      .sort({ stock: 1 })
      .limit(5)
      .lean();

    // ========== COUPON METRICS ==========

    // 14. Coupon Stats
    const totalCoupons = await CouponModel.countDocuments();
    const activeCoupons = await CouponModel.countDocuments({ isActive: true });
    const usedCouponsAgg = await CouponModel.aggregate([
      { $group: { _id: null, usedCount: { $sum: "$usedCount" } } },
    ]);
    const usedCoupons = usedCouponsAgg[0]?.usedCount || 0;

    // 15. Total Discount Given
    const totalDiscountAgg = await OrderModel.aggregate([
      { $match: { coupon: { $ne: "" } } },
      {
        $group: {
          _id: null,
          totalDiscount: { $sum: { $multiply: ["$totalPrice", 0.1] } }, // Adjust based on your discount logic
        },
      },
    ]);
    const totalDiscount = totalDiscountAgg[0]?.totalDiscount || 0;

    // 16. Most Used Coupon
    const mostUsedCoupon = await CouponModel.findOne()
      .sort({ usedCount: -1 })
      .select("code usedCount")
      .lean();

    // ========== TREND ANALYSIS ==========

    // 17. Monthly Revenue Trend
    const monthlyRevenue = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: thisYearStart } } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          month: {
            $arrayElemAt: [
              [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              { $subtract: ["$_id.month", 1] },
            ],
          },
          revenue: 1,
          orders: 1,
          _id: 0,
        },
      },
    ]);

    // 18. Daily Revenue Pattern (Last 7 days)
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyRevenue = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          day: {
            $arrayElemAt: [
              ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              { $subtract: ["$_id", 1] },
            ],
          },
          revenue: 1,
          _id: 0,
        },
      },
    ]);

    // 19. Hourly Order Activity (Last 24 hours)
    const twentyFourHoursAgo = new Date(now);
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const hourlyActivity = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: twentyFourHoursAgo } } },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          hour: {
            $concat: [
              { $toString: "$_id" },
              " ",
              { $cond: [{ $gte: ["$_id", 12] }, "PM", "AM"] },
            ],
          },
          orders: 1,
          _id: 0,
        },
      },
    ]);

    // ========== GEOGRAPHIC ANALYSIS ==========

    // 20. Top Performing Cities (assuming you have shipping address in orders)
    const topCities = await OrderModel.aggregate([
      { $match: { "shippingAddress.city": { $exists: true, $ne: "" } } },
      {
        $group: {
          _id: "$shippingAddress.city",
          orders: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $project: {
          city: "$_id",
          orders: 1,
          revenue: 1,
          _id: 0,
        },
      },
    ]);

    // ========== CATEGORY PERFORMANCE ==========

    // 21. Category Performance (assuming you have category field in products)
    const categoryPerformance = await OrderModel.aggregate([
      { $unwind: "$orderedItems" },
      {
        $lookup: {
          from: "products",
          localField: "orderedItems.product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      {
        $group: {
          _id: "$productInfo.category",
          totalSold: { $sum: "$orderedItems.qty" },
          revenue: {
            $sum: { $multiply: ["$orderedItems.qty", "$orderedItems.price"] },
          },
        },
      },
      {
        $project: {
          category: "$_id",
          performance: {
            $multiply: [
              { $divide: ["$revenue", { $literal: 10000 }] }, // Normalize to 0-100 scale
              100,
            ],
          },
          _id: 0,
        },
      },
      { $limit: 5 },
    ]);

    // ========== PAYMENT METHOD ANALYSIS ==========

    // 22. Payment Method Distribution (assuming you have paymentMethod field)
    const paymentMethods = await OrderModel.aggregate([
      { $match: { paymentMethod: { $exists: true } } },
      {
        $group: {
          _id: "$paymentMethod",
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          method: "$_id",
          value: 1,
          fill: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$_id", "Credit Card"] },
                  then: "hsl(var(--chart-1))",
                },
                {
                  case: { $eq: ["$_id", "Debit Card"] },
                  then: "hsl(var(--chart-2))",
                },
                {
                  case: { $eq: ["$_id", "PayPal"] },
                  then: "hsl(var(--chart-3))",
                },
              ],
              default: "hsl(var(--chart-4))",
            },
          },
          _id: 0,
        },
      },
    ]);

    // ========== RESPONSE OBJECT ==========

    res.status(200).json({
      summaryCards: {
        totalRevenue,
        thisMonthRevenue,
        revenueChange,
        totalOrders,
        thisMonthOrders,
        ordersChange,
        totalUsers,
        thisMonthUsers,
        userGrowth,
        totalProducts,
        averageOrderValue,
        aovChange,
        conversionRate,
        conversionChange,
      },
      orders: {
        deliveredOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        cancelledOrders,
      },
      products: {
        bestSellers: bestSellers.map((p) => ({
          _id: p._id,
          name: p.name,
          price: p.price,
          sales: 0, // You can calculate this if needed
        })),
        topSelling,
        lowStock: lowStock.map((p) => ({
          name: p.name,
          stock: p.stock,
        })),
      },
      coupons: {
        totalCoupons,
        activeCoupons,
        usedCoupons,
        totalDiscount,
        mostUsedCoupon: mostUsedCoupon
          ? { code: mostUsedCoupon.code, uses: mostUsedCoupon.usedCount }
          : { code: "N/A", uses: 0 },
      },
      trends: {
        monthlyRevenue,
        dailyRevenue,
      },
      userMetrics: {
        newUsers: newCustomers,
        returningCustomers: returningCustomersCount,
        userRetentionRate,
        averageLifetimeValue,
      },
      geography: {
        topCities,
      },
      performance: {
        categories: categoryPerformance,
      },
      hourlyActivity,
      paymentMethods,
    });
  } catch (err) {
    console.error("Analytics Error:", err);
    res.status(500).json({
      message: "Error generating analytics",
      error: err.message,
    });
  }
};

export { getDashboardAnalyticsController };
