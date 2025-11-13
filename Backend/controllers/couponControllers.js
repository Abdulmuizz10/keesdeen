import CouponModel from "../models/couponModel.js";

const createCoupon = async (req, res) => {
  try {
    const coupon = new CouponModel(req.body);
    await coupon.save();
    res.status(201).json({ success: true, coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await CouponModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCouponById = async (req, res) => {
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

const updateCoupon = async (req, res) => {
  try {
    const coupon = await CouponModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!coupon)
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    res.status(200).json({ success: true, coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCoupon = async (req, res) => {
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

const applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    const coupon = await CouponModel.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon)
      return res
        .status(404)
        .json({ success: false, message: "Invalid or expired coupon" });

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate)
      return res
        .status(400)
        .json({ success: false, message: "Coupon not valid at this time" });

    if (coupon.usedCount >= coupon.usageLimit)
      return res
        .status(400)
        .json({ success: false, message: "Coupon usage limit reached" });

    if (cartTotal < coupon.minPurchaseAmount)
      return res.status(400).json({
        success: false,
        message: `Minimum purchase of $${coupon.minPurchaseAmount} required`,
      });

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (coupon.discountValue / 100) * cartTotal;
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount)
        discountAmount = coupon.maxDiscountAmount;
    } else {
      discountAmount = coupon.discountValue;
    }

    const finalAmount = Math.max(cartTotal - discountAmount, 0);

    // Optional: increment usage
    coupon.usedCount += 1;
    await coupon.save();

    res.status(200).json({
      success: true,
      discountAmount,
      finalAmount,
      message: "Coupon applied successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
};
