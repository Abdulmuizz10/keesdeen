import express from "express";
import {
  adminCreateRefundController,
  adminGetRefundsByPaginationController,
  adminGetRefundByIdController,
  adminGetRefundsByOrderIdController,
  adminUpdateRefundStatusController,
} from "../controllers/refundControllers.js";
import { verifyUser, authorizeAdmin } from "../middleware/verify.js";

const router = express.Router();

// Create a new refund (admin only)
router.post(
  "/admin/create-refund",
  verifyUser,
  authorizeAdmin,
  adminCreateRefundController
);

router.get(
  "/admin/pagination-refunds",
  verifyUser,
  authorizeAdmin,
  adminGetRefundsByPaginationController
);

router.get(
  "/admin/refund/:id/get-refund",
  verifyUser,
  authorizeAdmin,
  adminGetRefundByIdController
);

router.get(
  "/order/:orderId",
  authorizeAdmin,
  adminGetRefundsByOrderIdController
);

router.patch(
  "/admin/refund/:id/status",
  verifyUser,
  authorizeAdmin,
  adminUpdateRefundStatusController
);

export default router;
