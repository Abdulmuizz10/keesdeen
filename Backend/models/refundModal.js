import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderModel",
      required: true,
      index: true,
    },
    paymentId: {
      type: String,
      required: true,
      trim: true,
    },
    squareRefundId: {
      type: String,
      trim: true,
      sparse: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "GBP",
      uppercase: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "rejected"],
      default: "pending",
      index: true,
    },
    failureReason: {
      type: String,
      trim: true,
    },
    initiatedBy: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    refundedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
refundSchema.index({ orderId: 1, createdAt: -1 });
refundSchema.index({ status: 1, createdAt: -1 });
refundSchema.index({ customerEmail: 1 });

const RefundModel = mongoose.model("RefundModel", refundSchema);

export default RefundModel;
