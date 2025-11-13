import OrderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";
import ProductModel from "../models/productModel.js";
import CouponModel from "../models/couponModel.js";

const getDashboardAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // 🛒 1. TOTAL REVENUE (ALL TIME)
    const totalRevenueAgg = await OrderModel.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // 💰 2. MONTHLY REVENUE (CURRENT vs LAST)
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

    // 👥 3. USER GROWTH
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

    // 📦 4. ORDER STATS
    const totalOrders = await OrderModel.countDocuments();
    const deliveredOrders = await OrderModel.countDocuments({
      isDelivered: "Delivered",
    });
    const pendingOrders = await OrderModel.countDocuments({
      isDelivered: "Pending",
    });

    // ⭐ 5. PRODUCT STATS
    const totalProducts = await ProductModel.countDocuments();
    const bestSellers = await ProductModel.find({ bestSeller: true }).limit(5);
    const newArrivals = await ProductModel.find({ newArrival: true }).limit(5);

    // 💸 6. COUPON STATS
    const totalCoupons = await CouponModel.countDocuments();
    const activeCoupons = await CouponModel.countDocuments({ isActive: true });
    const usedCoupons = await CouponModel.aggregate([
      { $group: { _id: null, usedCount: { $sum: "$usedCount" } } },
    ]);

    // 📊 7. MONTHLY REVENUE TREND
    const monthlyRevenue = await OrderModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total: { $sum: "$totalPrice" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // 🏆 8. TOP SELLING PRODUCTS
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
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      summaryCards: {
        totalRevenue,
        thisMonthRevenue,
        revenueChange,
        totalOrders,
        totalUsers,
        userGrowth,
        totalProducts,
      },
      orders: {
        deliveredOrders,
        pendingOrders,
      },
      products: {
        bestSellers,
        newArrivals,
        topSelling,
      },
      coupons: {
        totalCoupons,
        activeCoupons,
        usedCoupons: usedCoupons[0]?.usedCount || 0,
      },
      trends: {
        monthlyRevenue,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating analytics" });
  }
};

export { getDashboardAnalytics };
