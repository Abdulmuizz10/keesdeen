import OrderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";
import ProductModel from "../models/productModel.js";
import CouponModel from "../models/couponModel.js";
import SubscriberModel from "../models/subscriberModel.js";

const getDashboardAnalyticsController = async (req, res) => {
  try {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const thisYearStart = new Date(now.getFullYear(), 0, 1);

    // ========== REVENUE METRICS ==========

    // Total Revenue
    const totalRevenueAgg = await OrderModel.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // Monthly Revenue Comparison
    const [thisMonthRevenueAgg, lastMonthRevenueAgg] = await Promise.all([
      OrderModel.aggregate([
        { $match: { createdAt: { $gte: thisMonthStart } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      OrderModel.aggregate([
        {
          $match: { createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } },
        },
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

    // Total Orders & Growth
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

    // Order Status Breakdown
    const [
      deliveredOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      cancelledOrders,
    ] = await Promise.all([
      OrderModel.countDocuments({ status: "Delivered" }),
      OrderModel.countDocuments({ status: "Pending" }),
      OrderModel.countDocuments({ status: "Processing" }),
      OrderModel.countDocuments({ status: "Shipped" }),
      OrderModel.countDocuments({ status: "Cancelled" }),
    ]);

    // Average Order Value
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
        {
          $match: { createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } },
        },
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

    // User Counts & Growth
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

    // Auth Method Breakdown
    const googleAuthUsers = await UserModel.countDocuments({
      authMethod: "google",
    });
    const passwordAuthUsers = await UserModel.countDocuments({
      authMethod: "password",
    });
    const adminUsers = await UserModel.countDocuments({ isAdmin: true });

    // Customer Behavior
    const usersWithOrders = await OrderModel.distinct("email");
    const returningCustomers = await OrderModel.aggregate([
      { $group: { _id: "$email", orderCount: { $sum: 1 } } },
      { $match: { orderCount: { $gt: 1 } } },
      { $count: "total" },
    ]);
    const returningCustomersCount = returningCustomers[0]?.total || 0;

    // User Retention Rate
    const userRetentionRate =
      usersWithOrders.length > 0
        ? (returningCustomersCount / usersWithOrders.length) * 100
        : 0;

    // Average Lifetime Value
    const lifetimeValueAgg = await OrderModel.aggregate([
      { $group: { _id: "$email", totalSpent: { $sum: "$totalPrice" } } },
      { $group: { _id: null, avgLifetimeValue: { $avg: "$totalSpent" } } },
    ]);
    const averageLifetimeValue = lifetimeValueAgg[0]?.avgLifetimeValue || 0;

    // Conversion Rate
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

    // Product Counts
    const totalProducts = await ProductModel.countDocuments();
    const unavailableProducts = await ProductModel.countDocuments({
      isAvailable: false,
    });
    const newArrivals = await ProductModel.countDocuments({
      newArrival: true,
    });
    const bestSellers = await ProductModel.find({ bestSeller: true })
      .select("name price imageUrls")
      .limit(5)
      .lean();

    // Top Selling Products
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

    // ========== COUPON METRICS ==========

    // Coupon Statistics
    const totalCoupons = await CouponModel.countDocuments();
    const activeCoupons = await CouponModel.countDocuments({ isActive: true });
    const usedCouponsAgg = await CouponModel.aggregate([
      { $group: { _id: null, usedCount: { $sum: "$usedCount" } } },
    ]);
    const usedCoupons = usedCouponsAgg[0]?.usedCount || 0;

    // Average Discount Value
    const avgDiscountAgg = await CouponModel.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, avgDiscount: { $avg: "$discountValue" } } },
    ]);
    const avgDiscountValue = avgDiscountAgg[0]?.avgDiscount || 0;

    // Total Discount Given (approximate)
    const totalDiscountAgg = await OrderModel.aggregate([
      { $match: { coupon: { $exists: true, $ne: null, $ne: "" } } },
      {
        $lookup: {
          from: "couponmodels",
          localField: "coupon",
          foreignField: "code",
          as: "couponInfo",
        },
      },
      { $unwind: { path: "$couponInfo", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          totalDiscount: {
            $sum: {
              $cond: [
                { $eq: ["$couponInfo.discountType", "percentage"] },
                {
                  $multiply: [
                    "$totalPrice",
                    { $divide: ["$couponInfo.discountValue", 100] },
                  ],
                },
                "$couponInfo.discountValue",
              ],
            },
          },
        },
      },
    ]);
    const totalDiscount = totalDiscountAgg[0]?.totalDiscount || 0;

    // Most Used Coupon
    const mostUsedCoupon = await CouponModel.findOne()
      .sort({ usedCount: -1 })
      .select("code usedCount")
      .lean();

    // ========== SUBSCRIBER METRICS ==========

    // Subscriber Counts
    const totalSubscribers = await SubscriberModel.countDocuments();
    const activeSubscribers = await SubscriberModel.countDocuments({
      status: "active",
    });
    const unsubscribed = await SubscriberModel.countDocuments({
      status: "unsubscribed",
    });
    const bounced = await SubscriberModel.countDocuments({
      status: "bounced",
    });

    const thisMonthSubscribers = await SubscriberModel.countDocuments({
      subscribedAt: { $gte: thisMonthStart },
    });
    const lastMonthSubscribers = await SubscriberModel.countDocuments({
      subscribedAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
    });
    const subscriberGrowth =
      lastMonthSubscribers === 0
        ? 0
        : ((thisMonthSubscribers - lastMonthSubscribers) /
            lastMonthSubscribers) *
          100;

    // Email Engagement
    const emailMetricsAgg = await SubscriberModel.aggregate([
      {
        $group: {
          _id: null,
          totalEmailsSent: { $sum: "$emailsSent" },
          totalEmailsOpened: { $sum: "$emailsOpened" },
          totalEmailsClicked: { $sum: "$emailsClicked" },
        },
      },
    ]);
    const emailMetrics = emailMetricsAgg[0] || {
      totalEmailsSent: 0,
      totalEmailsOpened: 0,
      totalEmailsClicked: 0,
    };
    const openRate =
      emailMetrics.totalEmailsSent > 0
        ? (emailMetrics.totalEmailsOpened / emailMetrics.totalEmailsSent) * 100
        : 0;
    const clickRate =
      emailMetrics.totalEmailsSent > 0
        ? (emailMetrics.totalEmailsClicked / emailMetrics.totalEmailsSent) * 100
        : 0;

    // ========== PAYMENT METRICS ==========

    // Payment Statistics
    const paymentStatsAgg = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          successfulPayments: {
            $sum: {
              $cond: [
                { $eq: ["$paymentInfo.paymentStatus", "COMPLETED"] },
                1,
                0,
              ],
            },
          },
          failedPayments: {
            $sum: {
              $cond: [
                { $ne: ["$paymentInfo.paymentStatus", "COMPLETED"] },
                1,
                0,
              ],
            },
          },
          totalAmountPaid: { $sum: "$paymentInfo.amountPaid" },
          cardPayments: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$paymentInfo.paymentSourceType",
                    ["CARD", "card", "Card"],
                  ],
                },
                1,
                0,
              ],
            },
          },
          highRiskTransactions: {
            $sum: {
              $cond: [
                { $in: ["$paymentInfo.riskLevel", ["HIGH", "ELEVATED"]] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);
    const paymentStats = paymentStatsAgg[0] || {
      totalTransactions: 0,
      successfulPayments: 0,
      failedPayments: 0,
      totalAmountPaid: 0,
      cardPayments: 0,
      highRiskTransactions: 0,
    };
    const otherPayments =
      paymentStats.totalTransactions - paymentStats.cardPayments;
    const averageTransactionValue =
      paymentStats.totalTransactions > 0
        ? paymentStats.totalAmountPaid / paymentStats.totalTransactions
        : 0;

    // ========== SHIPPING METRICS ==========

    const shippingStatsAgg = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          avgShippingCost: { $avg: "$shippingPrice" },
          totalShippingRevenue: { $sum: "$shippingPrice" },
          freeShipping: {
            $sum: { $cond: [{ $eq: ["$shippingPrice", 0] }, 1, 0] },
          },
          paidShipping: {
            $sum: { $cond: [{ $gt: ["$shippingPrice", 0] }, 1, 0] },
          },
        },
      },
    ]);
    const shippingStats = shippingStatsAgg[0] || {
      avgShippingCost: 0,
      totalShippingRevenue: 0,
      freeShipping: 0,
      paidShipping: 0,
    };

    // ========== REVIEW METRICS ==========

    const reviewStatsAgg = await ProductModel.aggregate([
      { $unwind: { path: "$reviews", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          totalReviews: {
            $sum: { $cond: [{ $ifNull: ["$reviews", false] }, 1, 0] },
          },
          avgRating: { $avg: "$reviews.rating" },
          thisMonthReviews: {
            $sum: {
              $cond: [{ $gte: ["$reviews.createdAt", thisMonthStart] }, 1, 0],
            },
          },
        },
      },
    ]);
    const reviewStats = reviewStatsAgg[0] || {
      totalReviews: 0,
      avgRating: 0,
      thisMonthReviews: 0,
    };

    // Rating Distribution
    const ratingDistributionAgg = await ProductModel.aggregate([
      { $unwind: { path: "$reviews", preserveNullAndEmptyArrays: false } },
      {
        $group: {
          _id: "$reviews.rating",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);
    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: ratingDistributionAgg.find((r) => r._id === rating)?.count || 0,
    }));

    // ========== TREND ANALYSIS ==========

    // Monthly Revenue Trend
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

    // Daily Revenue Pattern (Last 7 days)
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

    // Hourly Order Activity
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

    // Top Countries
    const topCountries = await OrderModel.aggregate([
      {
        $match: {
          "shippingAddress.country": { $exists: true, $ne: null, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$shippingAddress.country",
          orders: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $project: {
          country: "$_id",
          orders: 1,
          revenue: 1,
          _id: 0,
        },
      },
    ]);

    // Top States
    const topStates = await OrderModel.aggregate([
      {
        $match: {
          "shippingAddress.state": { $exists: true, $ne: null, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$shippingAddress.state",
          orders: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $project: {
          state: "$_id",
          orders: 1,
          revenue: 1,
          _id: 0,
        },
      },
    ]);

    // ========== CATEGORY PERFORMANCE ==========

    const categoryPerformance = await OrderModel.aggregate([
      { $unwind: "$orderedItems" },
      {
        $lookup: {
          from: "productmodels",
          localField: "orderedItems.product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
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
            $multiply: [{ $divide: ["$revenue", 1000] }, 1], // Normalize
          },
          revenue: 1,
          _id: 0,
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);

    // Subcategory Performance
    const subcategoryPerformance = await OrderModel.aggregate([
      { $unwind: "$orderedItems" },
      {
        $lookup: {
          from: "productmodels",
          localField: "orderedItems.product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$productInfo.subcategory",
          sales: { $sum: "$orderedItems.qty" },
        },
      },
      { $sort: { sales: -1 } },
      { $limit: 5 },
      {
        $project: {
          name: "$_id",
          sales: 1,
          _id: 0,
        },
      },
    ]);

    // Type Performance
    const typePerformance = await OrderModel.aggregate([
      { $unwind: "$orderedItems" },
      {
        $lookup: {
          from: "productmodels",
          localField: "orderedItems.product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$productInfo.type",
          orders: { $sum: 1 },
        },
      },
      { $sort: { orders: -1 } },
      {
        $project: {
          type: "$_id",
          orders: 1,
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
          sales: 0,
        })),
        topSelling,
        unavailableProducts,
        newArrivals,
      },
      coupons: {
        totalCoupons,
        activeCoupons,
        usedCoupons,
        totalDiscount,
        mostUsedCoupon: mostUsedCoupon
          ? { code: mostUsedCoupon.code, uses: mostUsedCoupon.usedCount }
          : { code: "N/A", uses: 0 },
        avgDiscountValue,
      },
      trends: {
        monthlyRevenue,
        dailyRevenue,
      },
      userMetrics: {
        newUsers: thisMonthUsers,
        returningCustomers: returningCustomersCount,
        userRetentionRate,
        averageLifetimeValue,
        googleAuthUsers,
        passwordAuthUsers,
        adminUsers,
      },
      geography: {
        topCountries,
        topStates,
      },
      performance: {
        categories: categoryPerformance,
        subcategories: subcategoryPerformance,
        types: typePerformance,
      },
      hourlyActivity,
      paymentMethods: [
        {
          method: "Square",
          value: paymentStats.totalTransactions,
          fill: "hsl(var(--chart-1))",
        },
      ],
      paymentDetails: {
        totalTransactions: paymentStats.totalTransactions,
        successfulPayments: paymentStats.successfulPayments,
        failedPayments: paymentStats.failedPayments,
        averageTransactionValue,
        totalAmountPaid: paymentStats.totalAmountPaid,
        cardPayments: paymentStats.cardPayments,
        otherPayments,
        highRiskTransactions: paymentStats.highRiskTransactions,
      },
      subscribers: {
        totalSubscribers,
        activeSubscribers,
        unsubscribed,
        bounced,
        thisMonthSubscribers,
        subscriberGrowth,
        emailsSent: emailMetrics.totalEmailsSent,
        emailsOpened: emailMetrics.totalEmailsOpened,
        emailsClicked: emailMetrics.totalEmailsClicked,
        openRate,
        clickRate,
      },
      reviews: {
        totalReviews: reviewStats.totalReviews,
        averageRating: reviewStats.avgRating,
        thisMonthReviews: reviewStats.thisMonthReviews,
        ratingDistribution,
      },
      shipping: {
        averageShippingCost: shippingStats.avgShippingCost,
        totalShippingRevenue: shippingStats.totalShippingRevenue,
        freeShippingOrders: shippingStats.freeShipping,
        paidShippingOrders: shippingStats.paidShipping,
      },
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
