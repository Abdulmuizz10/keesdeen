import express from "express";
import {
  createOrderController,
  getAllOrdersController,
  getOrdersByPage,
  getPendingOrders,
  getDeliveredOrders,
  getOrderByIdController,
  // updateOrderToPaidController,
  updateOrderStatusController,
  getOrdersByUserController,
  getOrderByUserController,
} from "../controllers/orderControllers.js";

import { verifyUser, authorizeAdmin } from "../middleware/verify.js";

const router = express.Router();

// Create a new order
router.post("/", createOrderController);
router.get("/", verifyUser, authorizeAdmin, getAllOrdersController);
router.get("/page/orders", verifyUser, authorizeAdmin, getOrdersByPage);
router.get(
  "/page/pending-orders",
  verifyUser,
  authorizeAdmin,
  getPendingOrders
);
router.get(
  "/page/delivered-orders",
  verifyUser,
  authorizeAdmin,
  getDeliveredOrders
);
router.get("/:id", verifyUser, authorizeAdmin, getOrderByIdController);
router.patch(
  "/:id/deliver",
  verifyUser,
  authorizeAdmin,
  updateOrderStatusController
);
router.get("/profile/orders", verifyUser, getOrdersByUserController);
router.get("/profile/order/:id", verifyUser, getOrderByUserController);

export default router;
