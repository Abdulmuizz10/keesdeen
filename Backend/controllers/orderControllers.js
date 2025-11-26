import mongoose from "mongoose";
import OrderModel from "../models/orderModel.js";
import { Client, Environment } from "square";
import crypto from "crypto";
import dotenv from "dotenv";
import {
  sendGiftNotificationEmail,
  sendOrderConfirmationEmail,
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
      verificationToken, // Optional: for SCA verification
    } = req.body;

    // ===== VALIDATION =====

    // Validate required fields
    if (!sourceId || !totalPrice || !currency || !orderedItems || !email) {
      return res.status(400).json({
        success: false,
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    // Validate amount (must be positive)
    const amountInCents = parseInt(Math.floor(Number(totalPrice) * 100), 10);
    if (isNaN(amountInCents) || amountInCents <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount. Amount must be a positive number.",
      });
    }

    // Validate address fields
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
        message: "Billing address fields are incomplete.",
        required: ["address1", "postalCode", "country", "state"],
      });
    }

    // ===== PAYMENT PROCESSING =====

    let paymentResult;
    try {
      // Create idempotency key for payment (prevents duplicate charges)
      const idempotencyKey = crypto.randomUUID();

      // Prepare payment request
      const paymentRequest = {
        sourceId,
        idempotencyKey,
        amountMoney: {
          currency,
          amount: amountInCents,
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
        // Include verification token if provided (for SCA)
        ...(verificationToken && { verificationToken }),
      };

      // Optional: Add customer details if available
      if (req.body.user) {
        paymentRequest.customerId = req.body.user;
      }

      // Process payment with Square
      const { result } = await paymentsApi.createPayment(paymentRequest);

      if (!result || !result.payment) {
        return res.status(400).json({
          success: false,
          message: "Payment result is invalid.",
        });
      }

      // Convert BigInt values to strings for JSON serialization
      paymentResult = convertBigIntToString(result);
    } catch (paymentError) {
      // Handle Square payment errors
      console.error("Payment processing failed:", paymentError);

      // Parse Square error response
      let errorMessage = "Payment processing failed.";
      let errorDetails = null;

      if (paymentError.errors && Array.isArray(paymentError.errors)) {
        const firstError = paymentError.errors[0];
        errorMessage = firstError.detail || firstError.code || errorMessage;
        errorDetails = paymentError.errors;
      }

      return res.status(500).json({
        success: false,
        message: errorMessage,
        errors: errorDetails,
        code: paymentError.code || "PAYMENT_ERROR",
      });
    }

    try {
      const order = new OrderModel({
        ...req.body,
        paymentId: paymentResult.payment.id,
        paymentStatus: paymentResult.payment.status,
        orderStatus: "processing",
        createdAt: new Date().toISOString(),
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
        // Don't fail the order if email fails
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
          // Don't fail the order if email fails
        }
      }

      return res.status(200).json({ ...savedOrder.toObject(), paymentResult });
    } catch (orderError) {
      console.error("Failed to create order:", orderError);

      // Order creation failed but payment succeeded
      // Log this for manual review
      console.error("CRITICAL: Payment succeeded but order creation failed", {
        paymentId: paymentResult.payment.id,
        email,
        error: orderError.message,
      });

      return res.status(500).json({
        success: false,
        message:
          "Payment processed but order creation failed. Please contact support.",
        paymentId: paymentResult.payment.id,
        error: orderError.message,
      });
    }
  } catch (error) {
    // Handle unexpected errors
    console.error("Unexpected error in createOrderController:", error);

    return res.status(500).json({
      success: false,
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
 * Refund Payment Controller
 * Process refund for a payment
 */
// const refundPaymentController = async (req, res) => {
//   try {
//     const { paymentId, amountMoney, reason } = req.body;

//     if (!paymentId) {
//       return res.status(400).json({
//         success: false,
//         message: "Payment ID is required",
//       });
//     }

//     const refundsApi = squareClient.refundsApi;

//     const { result } = await refundsApi.refundPayment({
//       idempotencyKey: crypto.randomUUID(),
//       paymentId,
//       amountMoney: amountMoney || undefined, // Optional: partial refund
//       reason: reason || "Customer request",
//     });

//     return res.status(200).json({
//       success: true,
//       refund: convertBigIntToString(result.refund),
//     });
//   } catch (error) {
//     console.error("Failed to process refund:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to process refund",
//       error: error.message,
//     });
//   }
// };

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
    const orders = await OrderModel.find({ isDelivered: { $ne: "Delivered" } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalProducts = await OrderModel.countDocuments({
      isDelivered: { $ne: "Delivered" },
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
    const orders = await OrderModel.find({ isDelivered: "Delivered" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await OrderModel.countDocuments({
      isDelivered: "Delivered",
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

const adminUpdateOrderStatusController = async (req, res) => {
  const { status } = req.body;

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
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.isDelivered = status;

    if (status === "Delivered") {
      order.deliveredAt = new Date();
    } else {
      order.deliveredAt = null;
    }

    // Save the updated order
    await order.save();
    res.status(200).json({ message: `Order status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};

export {
  createOrderController,
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
