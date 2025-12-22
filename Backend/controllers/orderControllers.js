import mongoose from "mongoose";
import OrderModel from "../models/orderModel.js";
import { Client, Environment } from "square";
import crypto from "crypto";
import dotenv from "dotenv";
import {
  sendGiftNotificationEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
  sendRefundConfirmationEmail,
} from "../lib/utils.js";

dotenv.config();

// Helper function to convert BigInt to string for JSON serialization
function convertBigIntToString(obj) {
  if (typeof obj === "bigint") {
    return obj.toString();
  } else if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        convertBigIntToString(value),
      ])
    );
  }
  return obj;
}

// Initialize Square Client
const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  // environment:
  //   process.env.NODE_ENV === "production"
  //     ? Environment.Production
  //     : Environment.Sandbox,
  environment: Environment.Sandbox,
});

const paymentsApi = squareClient.paymentsApi;

/**
 * Create Order Controller
 * Handles payment processing for credit cards and digital wallets (Apple Pay, Google Pay)
 */

const createOrderController = async (req, res) => {
  try {
    const {
      sourceId,
      totalPrice,
      currency,
      orderedItems,
      shippingAddress,
      billingAddress,
      email,
      verificationToken,
    } = req.body;

    // ===== VALIDATION =====

    if (!sourceId || !totalPrice || !currency || !orderedItems || !email) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Required fields are missing.",
        missingFields: {
          sourceId: !sourceId,
          totalPrice: !totalPrice,
          currency: !currency,
          orderedItems: !orderedItems,
          email: !email,
        },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Invalid email format.",
      });
    }

    const amountInSmallestUnit = parseInt(
      Math.floor(Number(totalPrice) * 100),
      10
    );
    if (isNaN(amountInSmallestUnit) || amountInSmallestUnit <= 0) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Invalid amount. Amount must be a positive number.",
      });
    }

    const address = {
      shippingAddress,
      billingAddress,
    };

    if (
      !address?.shippingAddress?.postalCode ||
      !address?.shippingAddress?.address1 ||
      !address?.shippingAddress?.country ||
      !address?.shippingAddress?.state
    ) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Shipping address fields are incomplete.",
        required: ["address1", "postalCode", "country", "state"],
      });
    }

    if (
      !address?.billingAddress?.postalCode ||
      !address?.billingAddress?.address1 ||
      !address?.billingAddress?.country ||
      !address?.billingAddress?.state
    ) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Billing address fields are incomplete.",
        required: ["address1", "postalCode", "country", "state"],
      });
    }

    // ===== PAYMENT PROCESSING =====

    let paymentResult;
    try {
      const idempotencyKey = crypto.randomUUID();

      const paymentRequest = {
        sourceId,
        idempotencyKey,
        amountMoney: {
          currency,
          amount: amountInSmallestUnit,
        },
        locationId: process.env.SQUARE_LOCATION_ID,
        billingAddress: {
          addressLine1: address.billingAddress.address1,
          addressLine2: address.billingAddress.address2 || undefined,
          locality: address.billingAddress.city || undefined,
          administrativeDistrictLevel1: address.billingAddress.state,
          postalCode: address.billingAddress.postalCode,
          country: address.billingAddress.country,
          firstName: address.billingAddress.firstName || undefined,
          lastName: address.billingAddress.lastName || undefined,
        },
        buyerEmailAddress: email,
        note: `Order for ${orderedItems.length} item(s)`,
        ...(verificationToken && { verificationToken }),
      };

      if (req.body.user) {
        paymentRequest.customerId = req.body.user;
      }

      const { result } = await paymentsApi.createPayment(paymentRequest);

      if (!result || !result.payment) {
        return res.status(400).json({
          success: false,
          code: "PAYMENT_ERROR",
          message: "Payment result is invalid.",
        });
      }

      paymentResult = convertBigIntToString(result);
    } catch (paymentError) {
      console.error("Payment processing failed:", paymentError);

      let errorMessage = "Payment processing failed.";
      let errorCode = "PAYMENT_ERROR";
      let errorDetails = null;

      if (paymentError.errors && Array.isArray(paymentError.errors)) {
        const firstError = paymentError.errors[0];
        errorCode = firstError.code || errorCode;

        // User-friendly error messages
        switch (firstError.code) {
          case "CARD_NOT_SUPPORTED":
            errorMessage =
              "This card type is not supported. Please use a different card.";
            break;
          case "CARD_DECLINED":
            errorMessage =
              "Your card was declined. Please check your card details or try a different card.";
            break;
          case "INSUFFICIENT_FUNDS":
            errorMessage =
              "Insufficient funds. Please use a different payment method.";
            break;
          case "CVV_FAILURE":
            errorMessage =
              "Invalid CVV code. Please check your card security code.";
            break;
          case "INVALID_EXPIRATION":
            errorMessage =
              "Invalid card expiration date. Please check your card details.";
            break;
          default:
            errorMessage = firstError.detail || errorMessage;
        }

        errorDetails = paymentError.errors;
      }

      // IMPORTANT: Return proper error response, don't throw
      return res.status(400).json({
        success: false,
        message: errorMessage,
        code: errorCode,
        errors: errorDetails,
      });
    }

    // ===== ORDER CREATION =====
    try {
      const payment = paymentResult.payment;
      const order = new OrderModel({
        ...req.body,
        paymentInfo: {
          squarePaymentId: payment.id,
          squareOrderId: payment.orderId,
          paymentStatus: payment.status,
          amountPaid: Number(payment.amountMoney.amount) / 100,
          currency: payment.amountMoney.currency,
          paidAt: payment.createdAt,
          receiptUrl: payment.receiptUrl,
          receiptNumber: payment.receiptNumber,
          paymentSourceType: payment.sourceType,
          cardBrand: payment.cardDetails?.card?.cardBrand,
          cardLast4: payment.cardDetails?.card?.last4,
          cardStatus: payment.cardDetails?.status,
          riskLevel: payment.riskEvaluation?.riskLevel,
          customerSquareId: payment.customerId,
          locationId: payment.locationId,
        },
        status: "Processing",
      });

      const savedOrder = await order.save();

      try {
        await sendOrderConfirmationEmail(
          email,
          shippingAddress.firstName,
          shippingAddress.lastName,
          totalPrice,
          currency,
          orderedItems,
          savedOrder._id
        );
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError);
      }

      if (shippingAddress.email && shippingAddress.email !== email) {
        try {
          await sendGiftNotificationEmail(
            shippingAddress.email,
            shippingAddress.firstName,
            shippingAddress.lastName,
            `${shippingAddress.firstName} ${shippingAddress.lastName}`
          );
        } catch (emailError) {
          console.error("Failed to send gift notification email:", emailError);
        }
      }

      return res.status(200).json({
        success: true,
        ...savedOrder.toObject(),
        paymentResult,
      });
    } catch (orderError) {
      console.error("Failed to create order:", orderError);

      // CRITICAL ERROR LOG
      console.error("CRITICAL: Payment succeeded but order creation failed", {
        paymentId: paymentResult.payment.id,
        email,
        error: orderError.message,
        timestamp: new Date().toISOString(),
      });

      // IMPORTANT: Return special error code with payment ID
      return res.status(500).json({
        success: false,
        code: "ORDER_CREATION_FAILED",
        message:
          "Your payment was processed successfully, but we encountered an issue creating your order. Please contact support immediately.",
        paymentId: paymentResult.payment.id,
        error: orderError.message,
      });
    }
  } catch (error) {
    console.error("Unexpected error in createOrderController:", error);

    return res.status(500).json({
      success: false,
      code: "SERVER_ERROR",
      message: "An unexpected error occurred. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get Payment Status Controller
 * Retrieve payment status from Square
 */
// const getPaymentStatusController = async (req, res) => {
//   try {
//     const { paymentId } = req.params;

//     if (!paymentId) {
//       return res.status(400).json({
//         success: false,
//         message: "Payment ID is required",
//       });
//     }

//     const { result } = await paymentsApi.getPayment(paymentId);

//     return res.status(200).json({
//       success: true,
//       payment: convertBigIntToString(result.payment),
//     });
//   } catch (error) {
//     console.error("Failed to get payment status:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to retrieve payment status",
//       error: error.message,
//     });
//   }
// };

/**
 * Create a full or partial refund
 * POST /api/orders/:orderId/refund
 */
const adminCreateRefund = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { amount, reason, refundType } = req.body;

    // ===== VALIDATION =====
    if (!orderId) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Order ID is required.",
      });
    }

    if (!reason) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Refund reason is required.",
      });
    }

    // Find the order
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        code: "ORDER_NOT_FOUND",
        message: "Order not found.",
      });
    }

    // Check if order is eligible for refund
    if (!order.paymentInfo?.squarePaymentId) {
      return res.status(400).json({
        success: false,
        code: "NO_PAYMENT_INFO",
        message: "No payment information found for this order.",
      });
    }

    // Check if already refunded
    if (order.refundInfo?.status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        code: "ALREADY_REFUNDED",
        message: "This order has already been fully refunded.",
      });
    }

    // Calculate refund amount
    const totalPaid = order.paymentInfo.amountPaid;
    const alreadyRefunded = order.refundInfo?.amountRefunded || 0;
    const availableForRefund = totalPaid - alreadyRefunded;

    let refundAmount;
    if (refundType === "full") {
      refundAmount = availableForRefund;
    } else if (refundType === "partial") {
      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          code: "VALIDATION_ERROR",
          message: "Valid refund amount is required for partial refunds.",
        });
      }
      if (amount > availableForRefund) {
        return res.status(400).json({
          success: false,
          code: "INVALID_AMOUNT",
          message: `Refund amount cannot exceed available refund amount of ${availableForRefund}.`,
        });
      }
      refundAmount = amount;
    }

    // Convert to smallest unit (cents)
    const amountInSmallestUnit = Math.floor(refundAmount * 100);

    // ===== PROCESS REFUND WITH SQUARE =====
    let refundResult;
    try {
      const idempotencyKey = crypto.randomUUID();

      const refundRequest = {
        idempotencyKey,
        amountMoney: {
          amount: amountInSmallestUnit,
          currency: order.paymentInfo.currency,
        },
        paymentId: order.paymentInfo.squarePaymentId,
        reason,
      };

      const { result } = await refundsApi.refundPayment(refundRequest);

      if (!result || !result.refund) {
        return res.status(400).json({
          success: false,
          code: "REFUND_ERROR",
          message: "Refund processing failed.",
        });
      }

      refundResult = convertBigIntToString(result);
    } catch (refundError) {
      console.error("Square refund failed:", refundError);

      let errorMessage = "Refund processing failed.";
      let errorCode = "REFUND_ERROR";

      if (refundError.errors && Array.isArray(refundError.errors)) {
        const firstError = refundError.errors[0];
        errorCode = firstError.code || errorCode;

        switch (firstError.code) {
          case "PAYMENT_NOT_REFUNDABLE":
            errorMessage = "This payment cannot be refunded.";
            break;
          case "REFUND_AMOUNT_INVALID":
            errorMessage = "Invalid refund amount.";
            break;
          case "REFUND_ALREADY_PENDING":
            errorMessage =
              "A refund is already being processed for this payment.";
            break;
          default:
            errorMessage = firstError.detail || errorMessage;
        }
      }

      return res.status(400).json({
        success: false,
        message: errorMessage,
        code: errorCode,
        errors: refundError.errors,
      });
    }

    // ===== UPDATE ORDER WITH REFUND INFO =====
    const refund = refundResult.refund;
    const newRefundAmount = alreadyRefunded + refundAmount;
    const isFullyRefunded = newRefundAmount >= totalPaid;

    order.refundInfo = {
      squareRefundId: refund.id,
      status: refund.status,
      amountRefunded: newRefundAmount,
      currency: refund.amountMoney.currency,
      refundedAt: refund.createdAt,
      reason,
      refundType,
      processingFee: refund.processingFee
        ? Number(refund.processingFee[0]?.amountMoney?.amount || 0) / 100
        : 0,
    };

    // Update order status
    if (isFullyRefunded) {
      order.status = "Refunded";
    } else {
      order.status = "Partially Refunded";
    }

    await order.save();

    // ===== SEND REFUND CONFIRMATION EMAIL =====
    try {
      await sendRefundConfirmationEmail(
        order.email,
        order.shippingAddress.firstName,
        refundAmount,
        order.paymentInfo.currency,
        reason,
        order._id
      );
    } catch (emailError) {
      console.error("Failed to send refund confirmation email:", emailError);
    }

    return res.status(200).json({
      success: true,
      message: "Refund processed successfully.",
      refund: {
        orderId: order._id,
        refundId: refund.id,
        amount: refundAmount,
        status: refund.status,
        totalRefunded: newRefundAmount,
        remainingAmount: totalPaid - newRefundAmount,
      },
      order: order.toObject(),
    });
  } catch (error) {
    console.error("Unexpected error in createRefund:", error);
    return res.status(500).json({
      success: false,
      code: "SERVER_ERROR",
      message: "An unexpected error occurred.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getRefundStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        code: "ORDER_NOT_FOUND",
        message: "Order not found.",
      });
    }

    if (!order.refundInfo) {
      return res.status(200).json({
        success: true,
        hasRefund: false,
        message: "No refund found for this order.",
      });
    }

    // Optionally fetch latest status from Square
    if (order.refundInfo.squareRefundId) {
      try {
        const { result } = await refundsApi.getPaymentRefund(
          order.refundInfo.squareRefundId
        );

        const refund = convertBigIntToString(result.refund);

        // Update if status changed
        if (refund.status !== order.refundInfo.status) {
          order.refundInfo.status = refund.status;
          await order.save();
        }
      } catch (error) {
        console.error("Failed to fetch refund status from Square:", error);
      }
    }

    return res.status(200).json({
      success: true,
      hasRefund: true,
      refund: order.refundInfo,
      orderStatus: order.status,
    });
  } catch (error) {
    console.error("Error fetching refund status:", error);
    return res.status(500).json({
      success: false,
      code: "SERVER_ERROR",
      message: "Failed to fetch refund status.",
    });
  }
};

// const listOrderRefunds = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     const order = await OrderModel.findById(orderId);
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         code: "ORDER_NOT_FOUND",
//         message: "Order not found.",
//       });
//     }

//     if (!order.paymentInfo?.squarePaymentId) {
//       return res.status(200).json({
//         success: true,
//         refunds: [],
//         message: "No payment information available.",
//       });
//     }

//     // Fetch all refunds from Square for this payment
//     try {
//       const { result } = await refundsApi.listPaymentRefunds({
//         locationId: order.paymentInfo.locationId,
//         sourceType: "PAYMENT",
//         limit: 100,
//       });

//       // Filter refunds for this specific payment
//       const orderRefunds = result.refunds
//         ? result.refunds.filter(
//             (r) => r.paymentId === order.paymentInfo.squarePaymentId
//           )
//         : [];

//       return res.status(200).json({
//         success: true,
//         refunds: orderRefunds.map(convertBigIntToString),
//         count: orderRefunds.length,
//       });
//     } catch (error) {
//       console.error("Failed to list refunds from Square:", error);
//       return res.status(500).json({
//         success: false,
//         code: "SQUARE_ERROR",
//         message: "Failed to retrieve refunds.",
//       });
//     }
//   } catch (error) {
//     console.error("Error listing refunds:", error);
//     return res.status(500).json({
//       success: false,
//       code: "SERVER_ERROR",
//       message: "Failed to list refunds.",
//     });
//   }
// };

// Backend: controllers/refundController.js or orderController.js

const adminListOrderRefunds = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const orders = await OrderModel.find({
      refundInfo: { $exists: true, $ne: null },
    })
      .sort({ "refundInfo.refundedAt": -1 })
      .skip(skip)
      .limit(limit);

    const totalRefunds = await OrderModel.countDocuments({
      refundInfo: { $exists: true, $ne: null },
    });

    const totalPages = Math.ceil(totalRefunds / limit);

    res.status(200).json({
      orders,
      totalPages,
      totalRefunds,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfileOrdersByPageController = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const orders = await OrderModel.find({ user: userId })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);
    const totalProducts = await OrderModel.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({ orders, totalPages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfileOrderByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin
const adminGetOrdersByPaginationController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const orders = await OrderModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await OrderModel.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({ orders, totalPages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminGetOrderByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const adminGetPendingOrdersByPaginationController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    // Using $ne (not equal) operator to exclude 'Delivered' orders
    const orders = await OrderModel.find({ status: { $ne: "Delivered" } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalProducts = await OrderModel.countDocuments({
      status: { $ne: "Delivered" },
    });
    // Count documents excluding 'Delivered' orders
    const totalPages = Math.ceil(totalProducts / limit);
    res.status(200).json({ orders, totalPages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminGetDeliveredOrdersByPaginationController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const orders = await OrderModel.find({ status: "Delivered" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await OrderModel.countDocuments({
      status: "Delivered",
    });
    const totalPages = Math.ceil(totalProducts / limit);
    res.status(200).json({ orders, totalPages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminGetUserOrdersController = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const orders = await OrderModel.find({ user: userId })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);
    const totalProducts = await OrderModel.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({ orders, totalPages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminGetUserOrderByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await OrderModel.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const adminUpdateOrderStatusController = async (req, res) => {
//   const { status } = req.body;

//   const validStatuses = [
//     "Pending",
//     "Processing",
//     "Shipped",
//     "Delivered",
//     "Cancelled",
//   ];
//   if (!validStatuses.includes(status)) {
//     return res.status(400).json({ message: "Invalid status value" });
//   }

//   try {
//     const order = await OrderModel.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }
//     order.status = status;

//     if (status === "Shipped") {
//       order.shippedAt = new Date();

//     } else {
//       order.shippedAt = null;
//     }

//     if (status === "Delivered") {
//       order.deliveredAt = new Date();
//     } else {
//       order.deliveredAt = null;
//     }

//     // Save the updated order
//     await order.save();
//     res.status(200).json({ message: `Order status updated to ${status}` });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update order status" });
//   }
// };

const adminUpdateOrderStatusController = async (req, res) => {
  const { status } = req.body; // Added trackingNumber for shipped orders
  const validStatuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const order = await OrderModel.findById(req.params.id)
      .populate("user") // Populate user to get email and name
      .populate("orderedItems"); // Populate products for email details

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;

    if (status === "Shipped") {
      order.shippedAt = new Date();
      // if (trackingNumber) {
      //   order.trackingNumber = trackingNumber;
      // }
    } else {
      order.shippedAt = null;
    }

    if (status === "Delivered") {
      order.deliveredAt = new Date();
    } else {
      order.deliveredAt = null;
    }

    // Save the updated order
    await order.save();

    // Send email notification for Shipped or Delivered status
    if (status === "Shipped" || status === "Delivered") {
      try {
        // Prepare items for email
        const orderedItems = order.orderedItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
        }));

        await sendOrderStatusEmail(
          order.user.email,
          order.user.firstName ||
            order.shippingAddress?.firstName ||
            "Valued Customer",
          order._id,
          status,
          orderedItems,
          order.totalPrice,
          order.currency,
          status === "Shipped"
        );
      } catch (emailError) {
        console.error("Failed to send status email:", emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(200).json({
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

export {
  createOrderController,
  adminCreateRefund,
  adminListOrderRefunds,
  getRefundStatus,
  // getPaymentStatusController,
  // refundPaymentController,
  getProfileOrdersByPageController,
  getProfileOrderByIdController,
  adminGetOrdersByPaginationController,
  adminGetOrderByIdController,
  adminGetPendingOrdersByPaginationController,
  adminGetDeliveredOrdersByPaginationController,
  adminUpdateOrderStatusController,
  adminGetUserOrdersController,
  adminGetUserOrderByIdController,
};
