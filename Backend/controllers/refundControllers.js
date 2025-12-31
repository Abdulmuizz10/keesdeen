import { Client, Environment } from "square";
import OrderModel from "../models/orderModel.js";
import RefundModel from "../models/refundModal.js";
import {
  sendRefundInitiatedEmail,
  sendRefundCompletedEmail,
  sendRefundFailedEmail,
  sendRefundRejectedEmail,
} from "../lib/utils.js";

// Initialize Square client
const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment:
    process.env.NODE_ENV === "production"
      ? Environment.Production
      : Environment.Sandbox,
  // environment: Environment.Sandbox,
});

// Create a new refund
const adminCreateRefundController = async (req, res) => {
  try {
    const { orderId, amount, reason } = req.body;

    // Validate required fields
    if (!orderId || !amount || !reason) {
      return res.status(400).json({
        message: "Order ID, amount, and reason are required",
      });
    }

    // Fetch order details with all payment info
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Extract payment ID from order
    const paymentId = order.paymentInfo?.squarePaymentId;
    if (!paymentId) {
      return res.status(400).json({
        message: "Payment ID not found for this order",
      });
    }

    // Calculate total already refunded
    const totalAlreadyRefunded = order.refundInfo?.totalRefunded || 0;
    const maxRefundAmount = order.totalPrice - totalAlreadyRefunded;

    // Validate refund amount
    if (amount <= 0) {
      return res.status(400).json({
        message: "Refund amount must be greater than zero",
      });
    }

    if (amount > maxRefundAmount) {
      return res.status(400).json({
        message: `Refund amount cannot exceed available refund amount of ${maxRefundAmount}`,
        availableAmount: maxRefundAmount,
        alreadyRefunded: totalAlreadyRefunded,
      });
    }

    // Check if there's already a pending/processing refund for this order
    const existingActiveRefund = await RefundModel.findOne({
      orderId,
      status: { $in: ["pending", "processing"] },
    });

    if (existingActiveRefund) {
      return res.status(400).json({
        message: "A refund is already being processed for this order",
        refundId: existingActiveRefund._id,
      });
    }

    // Convert amount to Square's format (cents/pence)
    const amountMoney = {
      amount: Math.round(amount * 100),
      currency: order.currency || "GBP",
    };

    // Get initiator info
    const initiatedBy = req.user?.email || "admin";

    // Create refund in database first
    const refund = new RefundModel({
      orderId,
      paymentId,
      amount,
      currency: order.currency || "GBP",
      reason,
      status: "processing",
      initiatedBy: initiatedBy,
      customerEmail: order.email,
    });

    await refund.save();

    // Send refund initiated email to customer
    try {
      await sendRefundInitiatedEmail(
        order.email,
        order.shippingAddress.firstName,
        amount,
        order.currency || "GBP",
        reason,
        orderId,
        "5-10", // estimatedDays
        initiatedBy // Pass who initiated (admin email or "admin")
      );
    } catch (emailError) {
      console.error("Error sending refund initiated email:", emailError);
      // Don't fail the refund if email fails
    }

    // Process refund with Square API
    try {
      const { result } = await client.refundsApi.refundPayment({
        idempotencyKey: `refund-${orderId}-${Date.now()}`,
        amountMoney,
        paymentId,
        reason,
      });

      // Update refund with Square refund ID
      refund.squareRefundId = result.refund.id;
      refund.status =
        result.refund.status === "COMPLETED" ? "completed" : "processing";

      if (result.refund.status === "COMPLETED") {
        refund.refundedAt = new Date();
      }

      await refund.save();

      // Update order with refund information
      if (refund.status === "completed") {
        const newTotalRefunded = totalAlreadyRefunded + amount;
        const refundCount = (order.refundInfo?.refundCount || 0) + 1;

        // Determine order status
        let newStatus = order.status;
        if (newTotalRefunded >= order.totalPrice) {
          newStatus = "Refunded";
        } else if (newTotalRefunded > 0) {
          newStatus = "PartiallyRefunded";
        }

        order.status = newStatus;
        order.refundInfo = {
          totalRefunded: newTotalRefunded,
          refundCount: refundCount,
          lastRefundedAt: new Date(),
        };

        await order.save();

        // Send refund completed email if completed immediately
        try {
          await sendRefundCompletedEmail(
            order.email,
            order.shippingAddress.firstName,
            amount,
            order.currency || "GBP",
            reason,
            orderId
          );
        } catch (emailError) {
          console.error("Error sending refund completed email:", emailError);
        }
      }

      res.status(201).json({
        success: true,
        message: "Refund processed successfully",
        refund,
      });
    } catch (squareError) {
      console.error("Square API error:", squareError);

      // Update refund status to failed
      refund.status = "failed";
      refund.failureReason = squareError.message || "Square API error";
      await refund.save();

      // Send refund failed email
      try {
        await sendRefundFailedEmail(
          order.email,
          order.shippingAddress.firstName,
          amount,
          order.currency || "GBP",
          reason,
          orderId,
          squareError.message || "Payment processor error"
        );
      } catch (emailError) {
        console.error("Error sending refund failed email:", emailError);
      }

      res.status(400).json({
        success: false,
        message: "Failed to process refund with payment provider",
        error: squareError.message,
      });
    }
  } catch (error) {
    console.error("Refund controller error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all refunds with pagination
const adminGetRefundsByPaginationController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const refunds = await RefundModel.find()
      .populate({
        path: "orderId",
        select:
          "shippingAddress totalPrice currency status createdAt refundInfo",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalRefunds = await RefundModel.countDocuments();
    const totalPages = Math.ceil(totalRefunds / limit);

    res.status(200).json({
      success: true,
      refunds,
      totalPages,
      currentPage: page,
      totalRefunds,
    });
  } catch (error) {
    console.error("Get refunds error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single refund by ID
const adminGetRefundByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const refund = await RefundModel.findById(id).populate({
      path: "orderId",
      select:
        "shippingAddress orderedItems totalPrice currency status paidAt createdAt refundInfo paymentInfo",
    });

    if (!refund) {
      return res.status(404).json({
        success: false,
        message: "Refund not found",
      });
    }

    res.status(200).json({
      success: true,
      refund,
    });
  } catch (error) {
    console.error("Get refund by ID error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get refunds by order ID
const adminGetRefundsByOrderIdController = async (req, res) => {
  try {
    const { orderId } = req.params;

    const refunds = await RefundModel.find({ orderId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      refunds,
    });
  } catch (error) {
    console.error("Get refunds by order ID error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update refund status manually (admin override)
const adminUpdateRefundStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "processing",
      "completed",
      "failed",
      "rejected",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: " + validStatuses.join(", "),
      });
    }

    const refund = await RefundModel.findById(id).populate("orderId");
    if (!refund) {
      return res.status(404).json({
        success: false,
        message: "Refund not found",
      });
    }

    const oldStatus = refund.status;

    // Don't send email if status hasn't changed
    if (oldStatus === status) {
      return res.status(200).json({
        success: true,
        message: "Refund status unchanged",
        refund,
      });
    }

    refund.status = status;

    if (status === "completed" && !refund.refundedAt) {
      refund.refundedAt = new Date();
    }

    await refund.save();

    // Update order status if refund is completed and wasn't already completed
    if (status === "completed" && oldStatus !== "completed") {
      const order = await OrderModel.findById(refund.orderId);
      if (order) {
        const currentRefunded = order.refundInfo?.totalRefunded || 0;
        const newTotalRefunded = currentRefunded + refund.amount;
        const refundCount = (order.refundInfo?.refundCount || 0) + 1;

        // Determine order status
        let newStatus = order.status;
        if (newTotalRefunded >= order.totalPrice) {
          newStatus = "Refunded";
        } else if (newTotalRefunded > 0) {
          newStatus = "PartiallyRefunded";
        }

        order.status = newStatus;
        order.refundInfo = {
          totalRefunded: newTotalRefunded,
          refundCount: refundCount,
          lastRefundedAt: new Date(),
        };

        await order.save();
      }
    }

    // Send appropriate email based on new status
    const order = refund.orderId;
    try {
      switch (status) {
        case "completed":
          await sendRefundCompletedEmail(
            refund.customerEmail,
            order.shippingAddress.firstName,
            refund.amount,
            refund.currency,
            refund.reason,
            order._id.toString()
          );
          break;

        case "failed":
          await sendRefundFailedEmail(
            refund.customerEmail,
            order.shippingAddress.firstName,
            refund.amount,
            refund.currency,
            refund.reason,
            order._id.toString(),
            refund.failureReason || "Unable to process refund at this time"
          );
          break;

        case "rejected":
          await sendRefundRejectedEmail(
            refund.customerEmail,
            order.shippingAddress.firstName,
            refund.amount,
            refund.currency,
            refund.reason,
            order._id.toString(),
            refund.failureReason ||
              "Refund request does not meet our refund policy requirements"
          );
          break;

        // No email for "pending" or "processing" as customer was already notified
        default:
          break;
      }
    } catch (emailError) {
      console.error("Error sending refund status email:", emailError);
      // Don't fail the status update if email fails
    }

    res.status(200).json({
      success: true,
      message: "Refund status updated successfully",
      refund,
    });
  } catch (error) {
    console.error("Update refund status error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  adminCreateRefundController,
  adminGetRefundsByPaginationController,
  adminGetRefundByIdController,
  adminGetRefundsByOrderIdController,
  adminUpdateRefundStatusController,
};
