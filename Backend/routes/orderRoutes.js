import express from "express";
import {
  createOrderController,
  getProfileOrdersByPageController,
  getProfileOrderByIdController,
  adminGetOrdersByPaginationController,
  adminGetOrderByIdController,
  adminGetPendingOrdersByPaginationController,
  adminGetDeliveredOrdersByPaginationController,
  adminUpdateOrderStatusController,
  adminGetUserOrdersController,
  adminGetUserOrderByIdController,
} from "../controllers/orderControllers.js";
import { verifyUser, authorizeAdmin } from "../middleware/verify.js";
import { paymentRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// client Routes
router.post(
  "/create-order",
  paymentRateLimiter,
  verifyUser,
  createOrderController
);

router.get(
  "/profile/pagination-orders",
  verifyUser,
  getProfileOrdersByPageController
);

router.get("/profile/order/:id", verifyUser, getProfileOrderByIdController);

// Admin Routes
router.get(
  "/admin/pagination-orders",
  verifyUser,
  authorizeAdmin,
  adminGetOrdersByPaginationController
);

router.get(
  "/admin/order/:id",
  verifyUser,
  authorizeAdmin,
  adminGetOrderByIdController
);

router.get(
  "/admin/pagination-pending-orders",
  verifyUser,
  authorizeAdmin,
  adminGetPendingOrdersByPaginationController
);

router.get(
  "/admin/pagination-delivered-orders",
  verifyUser,
  authorizeAdmin,
  adminGetDeliveredOrdersByPaginationController
);

router.get(
  "/admin/user-orders/pagination-user-orders",
  verifyUser,
  authorizeAdmin,
  adminGetUserOrdersController
);

router.get(
  "/admin/user-orders/order/:id",
  verifyUser,
  authorizeAdmin,
  adminGetUserOrderByIdController
);

router.patch(
  "/admin/order/:id/status",
  verifyUser,
  authorizeAdmin,
  adminUpdateOrderStatusController
);

export default router;
