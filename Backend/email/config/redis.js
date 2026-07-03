import IORedis from "ioredis";

// ---------------------------------------------------------------------------
// Upstash Redis connection (used by BullMQ via ioredis)
// Upstash gives BullMQ a serverless-friendly Redis that persists jobs even if
// your server restarts or crashes — nothing gets lost.
// ---------------------------------------------------------------------------
export const redisConnection = new IORedis(process.env.UPSTASH_REDIS_URL, {
  maxRetriesPerRequest: null, // required by BullMQ
  enableReadyCheck: false, // required by BullMQ with Upstash
  tls: {
    // Upstash always uses TLS
    rejectUnauthorized: false,
  },
});

// ---------------------------------------------------------------------------
// Queue names — one constant source of truth, no typos across files
// ---------------------------------------------------------------------------
export const QUEUE_NAMES = {
  EMAIL: "email-queue",
  EMAIL_DLQ: "email-dead-letter", // jobs that exhausted all retries land here
};

// ---------------------------------------------------------------------------
// Job types — every email category has its own type so the worker knows
// which emailUtils function to call
// ---------------------------------------------------------------------------
export const JOB_TYPES = {
  ORDER_CONFIRMATION: "order_confirmation",
  ADMIN_ORDER_NOTIFICATION: "admin_order_notification",
  ORDER_STATUS: "order_status",
  GIFT_NOTIFICATION: "gift_notification",
  RESET_PASSWORD: "reset_password",
  WELCOME: "welcome",
  NEWSLETTER: "newsletter",
  CONTACT_FORM: "contact_form",
  CONTACT_CONFIRMATION: "contact_confirmation",
  REFUND_INITIATED: "refund_initiated",
  REFUND_COMPLETED: "refund_completed",
  REFUND_FAILED: "refund_failed",
  REFUND_REJECTED: "refund_rejected",
  ORDER_CANCELLATION: "order_cancellation",
  ADMIN_CANCELLATION_NOTIFICATION: "admin_cancellation_notification",
};

// ---------------------------------------------------------------------------
// Default job options applied to every email job
//
// attempts: 3       → try up to 3 times total before giving up
// backoff:          → exponential means: wait 10s, then 30s, then 90s
//                     (delay × 2^(attempt-1)) — gentle on Resend rate limits
// removeOnComplete  → keep the last 100 completed jobs for debugging,
//                     auto-delete anything older — keeps Redis lean
// removeOnFail      → keep ALL failed jobs in the DLQ so nothing is lost
// ---------------------------------------------------------------------------
export const DEFAULT_JOB_OPTIONS = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 10000, // 10 seconds base delay
  },
  removeOnComplete: { count: 100 },
  removeOnFail: false, // keep every failed job — they move to DLQ
};
