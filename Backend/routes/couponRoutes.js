import express from "express";
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} from "../controllers/couponControllers.js";
import { verifyUser, authorizeAdmin } from "../middleware/verify.js";

const router = express.Router();

router.post("/create-coupon", verifyUser, authorizeAdmin, createCoupon);
router.get("/get-all-coupons", verifyUser, authorizeAdmin, getAllCoupons);
router.get("/get-coupon/:id", verifyUser, authorizeAdmin, getCouponById);
router.put("/update-coupon/:id", verifyUser, authorizeAdmin, updateCoupon);
router.delete("/delete-coupon/:id", verifyUser, authorizeAdmin, deleteCoupon);

router.post("/apply-coupon", verifyUser, applyCoupon);

export default router;
