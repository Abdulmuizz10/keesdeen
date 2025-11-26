import mongoose from "mongoose";
import crypto from "crypto";

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "unsubscribed", "bounced"],
      default: "active",
    },
    unsubscribeToken: {
      type: String,
      unique: true,
      sparse: true,
    },
    source: {
      type: String,
      default: "footer_form",
    },
    ipAddress: String,
    userAgent: String,
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: Date,
    lastEmailSentAt: Date,
    emailsSent: {
      type: Number,
      default: 0,
    },
    emailsOpened: {
      type: Number,
      default: 0,
    },
    emailsClicked: {
      type: Number,
      default: 0,
    },
    tags: [String],
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unsubscribe token before saving
subscriberSchema.pre("save", function (next) {
  if (!this.unsubscribeToken) {
    this.unsubscribeToken = crypto.randomBytes(32).toString("hex");
  }
  next();
});

// Instance method to unsubscribe
subscriberSchema.methods.unsubscribe = function () {
  this.status = "unsubscribed";
  this.unsubscribedAt = new Date();
  return this.save();
};

// Static method to get active subscribers
subscriberSchema.statics.getActive = function () {
  return this.find({ status: "active" });
};

const SubscriberModel = mongoose.model("SubscriberModel", subscriberSchema);

export default SubscriberModel;
