import mongoose from "mongoose";
import OrderModel from "../models/orderModel.js";
import { Client, Environment } from "square";
import dotenv from "dotenv";
dotenv.config();
import {
  sendGiftNotificationEmail,
  sendOrderConfirmationEmail,
} from "../lib/utils.js";

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

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment:
    process.env.NODE_ENV === "development"
      ? Environment.Sandbox
      : Environment.Production,
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
    } = req.body;

    // Validate required fields
    if (!sourceId || !totalPrice || !currency || !orderedItems || !email) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    const address = { shippingAddress, billingAddress };
    if (
      !address ||
      !address.shippingAddress.postalCode ||
      !address.shippingAddress.address1 ||
      !address.shippingAddress.country ||
      !address.shippingAddress.state
    ) {
      return res
        .status(400)
        .json({ message: "Address fields are incomplete." });
    }

    let paymentResult;

    try {
      const { result } = await paymentsApi.createPayment({
        sourceId,
        amountMoney: {
          currency,
          amount: parseInt(Math.floor(Number(totalPrice) * 100), 10),
        },
        idempotencyKey: crypto.randomUUID(),
        locationId: process.env.SQUARE_LOCATION_ID,
        billingAddress: {
          postalCode: address.billingAddress.postalCode,
          address1: address.billingAddress.address1,
          administrativeDistrictLevel1: address.billingAddress.state,
          country: address.billingAddress.country,
        },
        buyerEmailAddress: email,
      });

      if (!result) {
        return res.status(400).json({ message: "Payment result is invalid." });
      }
      paymentResult = convertBigIntToString(result);
    } catch (paymentError) {
      return res.status(500).json({
        message: "Payment processing failed.",
        error: paymentError.message,
      });
    }

    try {
      const order = new OrderModel(req.body);
      const savedOrder = await order.save();

      await sendOrderConfirmationEmail(
        email,
        shippingAddress.firstName,
        shippingAddress.lastName,
        totalPrice,
        currency,
        orderedItems,
        savedOrder._id
      );

      if (shippingAddress.email !== email) {
        await sendGiftNotificationEmail(
          shippingAddress.email,
          shippingAddress.firstName,
          shippingAddress.lastName,
          `${shippingAddress.firstName} ${shippingAddress.lastName}`
        );
      }

      return res.status(200).json({ ...savedOrder.toObject(), paymentResult });
    } catch (orderError) {
      return res.status(500).json({
        message: "Failed to create order.",
        error: orderError.message,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

// user

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
