import express from "express";

const router = express.Router();
import {
  createUtility,
  applyCoupon,
  getUtility,
  getShippingAndDiscount,
  updateUtility,
} from "../controllers/utilityControllers.js";
import { verifyUser, authorizeAdmin } from "../middleware/verify.js";

router.post("/", verifyUser, authorizeAdmin, createUtility);
router.post("/apply-coupon", applyCoupon);
router.get("/", verifyUser, authorizeAdmin, getUtility);
router.get("/shipping-discount", getShippingAndDiscount);
router.put("/", verifyUser, authorizeAdmin, updateUtility);

export default router;
