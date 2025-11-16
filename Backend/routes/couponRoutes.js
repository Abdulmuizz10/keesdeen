import express from "express";
import {
  applyCoupon,
  adminCreateCoupon,
  adminGetAllCouponsByPagination,
  adminGetCouponById,
  adminUpdateCoupon,
  adminDeleteCoupon,
} from "../controllers/couponControllers.js";
import { verifyUser, authorizeAdmin } from "../middleware/verify.js";

const router = express.Router();

router.post("/apply-coupon", verifyUser, applyCoupon);

// Admin
router.post("/create-coupon", verifyUser, authorizeAdmin, adminCreateCoupon);
router.get(
  "/admin/pagination-coupons",
  verifyUser,
  authorizeAdmin,
  adminGetAllCouponsByPagination
);
router.get(
  "/admin/get-coupon/:id",
  verifyUser,
  authorizeAdmin,
  adminGetCouponById
);
router.put(
  "/admin/:id/update-coupon",
  verifyUser,
  authorizeAdmin,
  adminUpdateCoupon
);
router.delete(
  "/admin/:id/delete-coupon",
  verifyUser,
  authorizeAdmin,
  adminDeleteCoupon
);

export default router;
