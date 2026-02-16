// import mongoose from "mongoose";

// const addressSchema = new mongoose.Schema({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   email: { type: String, required: true },
//   country: { type: String, required: true },
//   state: { type: String, required: true },
//   address1: { type: String, required: true },
//   address2: { type: String },
//   phone: { type: String, required: true },
//   postalCode: { type: String, required: true },
// });

// const orderedItemSchema = new mongoose.Schema({
//   name: String,
//   qty: Number,
//   image: String,
//   price: Number,
//   product: { type: mongoose.Schema.Types.ObjectId, ref: "ProductModel" },
//   size: String,
//   color: String,
// });

// const orderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "UserModel",
//       required: false,
//     },
//     email: { type: String, required: true },
//     currency: { type: String, required: true },
//     coupon: { type: String },
//     orderedItems: [orderedItemSchema],
//     shippingAddress: { type: addressSchema, required: true },
//     billingAddress: { type: addressSchema, required: true },
//     shippingPrice: { type: Number, default: 0.0 },
//     totalPrice: { type: Number, default: 0.0 },
//     paidAt: { type: Date, default: null },
//     status: {
//       type: String,
//       enum: [
//         "Pending",
//         "Processing",
//         "Shipped",
//         "Delivered",
//         "Cancelled",
//         "Refunded",
//         "PartiallyRefunded",
//       ],
//       default: "Pending",
//     },
//     deliveredAt: { type: Date, default: null },
//     shippedAt: { type: Date, default: null },
//     idempotencyKey: {
//       type: String,
//       required: true,
//       unique: true,
//       index: true,
//     },
//     paymentInfo: {
//       squarePaymentId: {
//         type: String,
//         required: true,
//         unique: true,
//         index: true,
//       },
//       squareOrderId: { type: String },
//       paymentStatus: { type: String, required: true },
//       amountPaid: { type: Number, required: true },
//       currency: { type: String, required: true },
//       paidAt: { type: Date },
//       receiptUrl: { type: String },
//       receiptNumber: { type: String },
//       paymentSourceType: { type: String },
//       cardBrand: { type: String },
//       cardLast4: { type: String },
//       cardStatus: { type: String },
//       riskLevel: { type: String },
//       customerSquareId: { type: String },
//       locationId: { type: String },
//     },
//     refundInfo: {
//       totalRefunded: { type: Number, default: 0 },
//       refundCount: { type: Number, default: 0 },
//       lastRefundedAt: { type: Date },
//     },
//   },
//   { timestamps: true },
// );

// // Create compound index for faster lookups
// orderSchema.index({ user: 1, idempotencyKey: 1 });
// orderSchema.index({ "paymentInfo.squarePaymentId": 1 });
// orderSchema.index({ status: 1, createdAt: -1 });

// const OrderModel = mongoose.model("OrderModel", orderSchema);
// export default OrderModel;

import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
  phone: { type: String, required: true },
  postalCode: { type: String, required: true },
});

const orderedItemSchema = new mongoose.Schema({
  name: String,
  qty: Number,
  image: String,
  price: Number,
  product: { type: mongoose.Schema.Types.ObjectId, ref: "ProductModel" },
  size: String,
  color: String,
});

// NEW: Refund details sub-schema
const refundDetailsSchema = new mongoose.Schema({
  squareRefundId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true }, // PENDING, COMPLETED, FAILED
  reason: { type: String },
  processedAt: { type: Date },
  processedBy: { type: String, enum: ["customer", "admin", "system"] },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: false,
    },
    email: { type: String, required: true },
    currency: { type: String, required: true },
    coupon: { type: String },
    orderedItems: [orderedItemSchema],
    shippingAddress: { type: addressSchema, required: true },
    billingAddress: { type: addressSchema, required: true },
    shippingPrice: { type: Number, default: 0.0 },
    totalPrice: { type: Number, default: 0.0 },
    paidAt: { type: Date, default: null },
    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Refunded",
        "PartiallyRefunded",
      ],
      default: "Pending",
    },
    deliveredAt: { type: Date, default: null },
    shippedAt: { type: Date, default: null },

    // NEW: Cancellation tracking
    cancelledAt: { type: Date, default: null },
    cancelledBy: {
      type: String,
      enum: ["customer", "admin", "system"],
      default: null,
    },
    cancellationReason: { type: String, default: null },
    cancellationAttempted: {
      attemptedAt: { type: Date },
      attemptedBy: { type: String },
      reason: { type: String },
      error: { type: String },
    },

    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    paymentInfo: {
      squarePaymentId: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },
      squareOrderId: { type: String },
      paymentStatus: { type: String, required: true },
      amountPaid: { type: Number, required: true },
      currency: { type: String, required: true },
      paidAt: { type: Date },
      receiptUrl: { type: String },
      receiptNumber: { type: String },
      paymentSourceType: { type: String },
      cardBrand: { type: String },
      cardLast4: { type: String },
      cardStatus: { type: String },
      riskLevel: { type: String },
      customerSquareId: { type: String },
      locationId: { type: String },
    },

    // ENHANCED: Refund information with details array
    refundInfo: {
      totalRefunded: { type: Number, default: 0 },
      refundCount: { type: Number, default: 0 },
      lastRefundedAt: { type: Date },
      refunds: [refundDetailsSchema], // Array of all refunds for this order
    },
  },
  { timestamps: true },
);

// Create compound index for faster lookups
orderSchema.index({ user: 1, idempotencyKey: 1 });
orderSchema.index({ "paymentInfo.squarePaymentId": 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ cancelledBy: 1, cancelledAt: -1 }); // NEW: For cancelled orders analytics

// NEW: Virtual for checking if order is within cancellation window
orderSchema.virtual("isWithinCancellationWindow").get(function () {
  if (!this.createdAt) return false;
  const oneHourInMs = 60 * 60 * 1000;
  const orderAge = Date.now() - new Date(this.createdAt).getTime();
  return (
    orderAge <= oneHourInMs &&
    !["Cancelled", "Refunded", "Delivered"].includes(this.status)
  );
});

// NEW: Virtual for remaining refundable amount
orderSchema.virtual("remainingRefundable").get(function () {
  const totalRefunded = this.refundInfo?.totalRefunded || 0;
  return this.totalPrice - totalRefunded;
});

// Ensure virtuals are included in JSON/Object output
orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });

const OrderModel = mongoose.model("OrderModel", orderSchema);
export default OrderModel;
