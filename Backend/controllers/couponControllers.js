import CouponModel from "../models/couponModel.js";

// const applyCoupon = async (req, res) => {
//   try {
//     const { code, cartTotal } = req.body;
//     const coupon = await CouponModel.findOne({
//       code: code.toUpperCase(),
//       isActive: true,
//     });

//     if (!coupon)
//       return res
//         .status(404)
//         .json({ success: false, message: "Invalid or expired coupon" });

//     const now = new Date();
//     if (now < coupon.startDate || now > coupon.endDate)
//       return res
//         .status(400)
//         .json({ success: false, message: "Coupon not valid at this time" });

//     if (coupon.usedCount >= coupon.usageLimit)
//       return res
//         .status(400)
//         .json({ success: false, message: "Coupon usage limit reached" });

//     if (cartTotal < coupon.minPurchaseAmount)
//       return res.status(400).json({
//         success: false,
//         message: `Minimum purchase of $${coupon.minPurchaseAmount} required`,
//       });

//     let discountAmount = 0;
//     if (coupon.discountType === "percentage") {
//       discountAmount = (coupon.discountValue / 100) * cartTotal;
//       if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount)
//         discountAmount = coupon.maxDiscountAmount;
//     } else {
//       discountAmount = coupon.discountValue;
//     }

//     const finalAmount = Math.max(cartTotal - discountAmount, 0);

//     // Optional: increment usage
//     coupon.usedCount += 1;
//     await coupon.save();

//     res.status(200).json({
//       success: true,
//       discountAmount,
//       finalAmount,
//       message: "Coupon applied successfully",
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    // Validate input
    if (!code || !cartTotal) {
      return res.status(400).json({
        success: false,
        message: "Coupon code and cart total are required",
      });
    }

    // Find active coupon
    const coupon = await CouponModel.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired coupon",
      });
    }

    // Check date validity
    const now = new Date();
    if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) {
      return res.status(400).json({
        success: false,
        message: "Coupon is not valid at this time",
      });
    }

    // Check usage limit
    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "Coupon usage limit has been reached",
      });
    }

    // Check minimum purchase amount
    if (cartTotal < coupon.minPurchaseAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase of £${coupon.minPurchaseAmount} required`,
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (coupon.discountValue / 100) * cartTotal;
      // Apply max discount cap if exists
      if (
        coupon.maxDiscountAmount &&
        discountAmount > coupon.maxDiscountAmount
      ) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      // Fixed discount
      discountAmount = Math.min(coupon.discountValue, cartTotal);
    }

    const finalAmount = Math.max(cartTotal - discountAmount, 0);

    // Increment usage count
    coupon.usedCount += 1;
    await coupon.save();

    res.status(200).json({
      success: true,
      discountAmount: Math.round(discountAmount * 100) / 100, // Round to 2 decimals
      finalAmount: Math.round(finalAmount * 100) / 100,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      message: `Coupon applied! You saved £${discountAmount.toFixed(2)}`,
    });
  } catch (error) {
    console.error("Apply coupon error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while applying the coupon",
    });
  }
};

const adminCreateCoupon = async (req, res) => {
  try {
    const coupon = new CouponModel(req.body);
    await coupon.save();
    res.status(201).json({ success: true, coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const adminGetAllCouponsByPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const coupons = await CouponModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalCoupons = await CouponModel.countDocuments();
    const totalPages = Math.ceil(totalCoupons / limit);
    res.status(200).json({ coupons, totalPages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminGetCouponById = async (req, res) => {
  try {
    const coupon = await CouponModel.findById(req.params.id);
    if (!coupon)
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    res.status(200).json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminUpdateCoupon = async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await CouponModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!coupon)
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    res.status(200).json({ success: true, coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const adminDeleteCoupon = async (req, res) => {
  try {
    const coupon = await CouponModel.findByIdAndDelete(req.params.id);
    if (!coupon)
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    res
      .status(200)
      .json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  applyCoupon,
  adminCreateCoupon,
  adminGetAllCouponsByPagination,
  adminGetCouponById,
  adminUpdateCoupon,
  adminDeleteCoupon,
};
