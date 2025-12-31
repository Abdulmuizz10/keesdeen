import mongoose from "mongoose";
import OrderModel from "../models/orderModel.js";
import { Client, Environment } from "square";
import crypto from "crypto";
import dotenv from "dotenv";
import {
  sendGiftNotificationEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
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
  environment:
    process.env.NODE_ENV === "production"
      ? Environment.Production
      : Environment.Sandbox,
  // environment: Environment.Sandbox,
});

const paymentsApi = squareClient.paymentsApi;

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
    let idempotencyKey;

    try {
      // Generate idempotency key
      idempotencyKey = crypto.randomUUID();

      // NEW: Check if order with this payment sourceId already exists
      // This prevents duplicate orders if user clicks multiple times with same payment token
      const existingOrderBySource = await OrderModel.findOne({
        "paymentInfo.squarePaymentId": sourceId,
      });

      if (existingOrderBySource) {
        console.log(
          "Duplicate order attempt with same payment source detected:",
          {
            sourceId,
            existingOrderId: existingOrderBySource._id,
            timestamp: new Date().toISOString(),
          }
        );

        return res.status(200).json({
          success: true,
          duplicate: true,
          message: "Order already exists for this payment.",
          ...existingOrderBySource.toObject(),
        });
      }

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

      // NEW: After successful payment, check if order already exists with this payment ID
      const existingOrderByPaymentId = await OrderModel.findOne({
        "paymentInfo.squarePaymentId": paymentResult.payment.id,
      });

      if (existingOrderByPaymentId) {
        console.log("Order already exists for this Square payment ID:", {
          paymentId: paymentResult.payment.id,
          existingOrderId: existingOrderByPaymentId._id,
          timestamp: new Date().toISOString(),
        });

        return res.status(200).json({
          success: true,
          duplicate: true,
          message: "Order already exists for this payment.",
          ...existingOrderByPaymentId.toObject(),
          paymentResult,
        });
      }
    } catch (paymentError) {
      console.error("Payment processing failed:", paymentError);

      let errorMessage = "Payment processing failed.";
      let errorCode = "PAYMENT_ERROR";
      let errorDetails = null;

      if (paymentError.errors && Array.isArray(paymentError.errors)) {
        const firstError = paymentError.errors[0];
        errorCode = firstError.code || errorCode;

        // NEW: Handle Square's idempotency key reused error
        if (firstError.code === "IDEMPOTENCY_KEY_REUSED") {
          // The payment was already processed with this idempotency key
          // Try to find the existing order
          const existingOrder = await OrderModel.findOne({
            idempotencyKey,
          });

          if (existingOrder) {
            console.log("Idempotency key reused - returning existing order:", {
              idempotencyKey,
              existingOrderId: existingOrder._id,
              timestamp: new Date().toISOString(),
            });

            return res.status(200).json({
              success: true,
              duplicate: true,
              message: "Payment already processed.",
              ...existingOrder.toObject(),
            });
          }
        }

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
        idempotencyKey, // NEW: Store idempotency key
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

      // NEW: Check if it's a duplicate key error
      if (orderError.code === 11000) {
        // MongoDB duplicate key error
        if (orderError.keyPattern?.idempotencyKey) {
          // Duplicate idempotency key
          const existingOrder = await OrderModel.findOne({ idempotencyKey });

          if (existingOrder) {
            console.log("Duplicate idempotency key on order creation:", {
              idempotencyKey,
              existingOrderId: existingOrder._id,
              timestamp: new Date().toISOString(),
            });

            return res.status(200).json({
              success: true,
              duplicate: true,
              message: "Order already exists.",
              ...existingOrder.toObject(),
            });
          }
        } else if (orderError.keyPattern?.["paymentInfo.squarePaymentId"]) {
          // Duplicate Square payment ID
          const existingOrder = await OrderModel.findOne({
            "paymentInfo.squarePaymentId": paymentResult.payment.id,
          });

          if (existingOrder) {
            console.log("Duplicate Square payment ID on order creation:", {
              paymentId: paymentResult.payment.id,
              existingOrderId: existingOrder._id,
              timestamp: new Date().toISOString(),
            });

            return res.status(200).json({
              success: true,
              duplicate: true,
              message: "Order already exists for this payment.",
              ...existingOrder.toObject(),
            });
          }
        }
      }

      // CRITICAL ERROR LOG
      console.error("CRITICAL: Payment succeeded but order creation failed", {
        paymentId: paymentResult.payment.id,
        idempotencyKey,
        email,
        error: orderError.message,
        timestamp: new Date().toISOString(),
      });

      return res.status(500).json({
        success: false,
        code: "ORDER_CREATION_FAILED",
        message:
          "Your payment was processed successfully, but we encountered an issue creating your order. Please contact support immediately.",
        paymentId: paymentResult.payment.id,
        idempotencyKey,
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
  // getPaymentStatusController,
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
