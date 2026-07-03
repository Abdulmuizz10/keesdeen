import mongoose from "mongoose";

// ---------------------------------------------------------------------------
// EmailLog tracks the full lifecycle of every email attempt.
//
// Why bother? So you can:
//   - Answer "did the order confirmation actually send?" in your admin panel
//   - See exactly what Resend returned when something failed
//   - Know if an email bounced via the webhook handler
//   - Replay failed jobs (the jobId links back to BullMQ)
// ---------------------------------------------------------------------------
const emailLogSchema = new mongoose.Schema(
  {
    // Which type of email this is (matches JOB_TYPES in config/redis.js)
    type: {
      type: String,
      required: true,
      index: true,
    },

    // Who it was sent to
    to: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
    },

    // The email subject line
    subject: {
      type: String,
      required: true,
    },

    // Lifecycle status
    // pending   → job is in the queue, not yet attempted
    // sending   → worker has picked it up and is calling Resend
    // sent      → Resend accepted it (doesn't mean delivered yet)
    // delivered → Resend webhook confirmed delivery
    // bounced   → Resend webhook reported a bounce
    // failed    → all retry attempts exhausted, job is in DLQ
    status: {
      type: String,
      enum: ["pending", "sending", "sent", "delivered", "bounced", "failed"],
      default: "pending",
      index: true,
    },

    // Resend's own email ID — needed to correlate webhook events
    resendEmailId: {
      type: String,
      sparse: true, // null until Resend returns an ID
    },

    // BullMQ job ID — lets you look up / replay the job from Bull Board
    jobId: {
      type: String,
      sparse: true,
    },

    // Optional: link email to an order or user
    orderId: { type: String, sparse: true, index: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      sparse: true,
    },

    // How many times we tried (matches BullMQ attempt count)
    attempts: {
      type: Number,
      default: 0,
    },

    // Last error message if the job failed
    lastError: {
      type: String,
      default: null,
    },

    // Timestamps for each stage
    sentAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    bouncedAt: { type: Date, default: null },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  },
);

// Compound index — most common query pattern: "all emails for order X"
emailLogSchema.index({ orderId: 1, type: 1 });
// Compound index — "all failed emails today"
emailLogSchema.index({ status: 1, createdAt: -1 });

const EmailLog = mongoose.model("EmailLog", emailLogSchema);

export default EmailLog;
