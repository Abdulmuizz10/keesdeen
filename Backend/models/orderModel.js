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

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
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
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    deliveredAt: { type: Date, default: null },
    shippedAt: { type: Date, default: null },
    paymentInfo: {
      squarePaymentId: { type: String, required: true },
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
    refundInfo: {
      squareRefundId: { type: String },
      status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "REJECTED", "FAILED"],
      },
      amountRefunded: { type: Number },
      currency: { type: String },
      refundedAt: { type: Date },
      reason: { type: String },
      refundType: {
        type: String,
        enum: ["full", "partial"],
      },
      processingFee: { type: Number },
      updatedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("OrderModel", orderSchema);

export default OrderModel;
