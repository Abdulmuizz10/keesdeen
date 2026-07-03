import { Queue } from "bullmq";
import {
  redisConnection,
  QUEUE_NAMES,
  JOB_TYPES,
  DEFAULT_JOB_OPTIONS,
} from "../config/redis.js";

// ---------------------------------------------------------------------------
// The email queue itself.
// Your Express routes call the helpers below — they never import emailUtils
// directly. This decouples sending from request handling so a slow or
// failing Resend API never blocks your API responses.
// ---------------------------------------------------------------------------
const emailQueue = new Queue(QUEUE_NAMES.EMAIL, {
  connection: redisConnection,
  defaultJobOptions: DEFAULT_JOB_OPTIONS,
});

// ---------------------------------------------------------------------------
// Generic enqueue helper — used internally by every typed helper below.
// jobName is human-readable (shows in Bull Board dashboard).
// ---------------------------------------------------------------------------
const enqueue = async (jobType, jobName, data, opts = {}) => {
  const job = await emailQueue.add(
    jobName,
    { type: jobType, payload: data, enqueuedAt: new Date().toISOString() },
    { ...DEFAULT_JOB_OPTIONS, ...opts },
  );
  return job.id;
};

// ---------------------------------------------------------------------------
// Typed helpers — one per email type.
// Your routes call these. The payload shape exactly matches what emailUtils
// functions expect so the worker can spread them directly.
// ---------------------------------------------------------------------------

export const queueOrderConfirmation = (data) =>
  enqueue(JOB_TYPES.ORDER_CONFIRMATION, "Order confirmation", data);

export const queueAdminOrderNotification = (data) =>
  enqueue(JOB_TYPES.ADMIN_ORDER_NOTIFICATION, "Admin order alert", data);

export const queueOrderStatus = (data) =>
  enqueue(JOB_TYPES.ORDER_STATUS, "Order status update", data);

export const queueGiftNotification = (data) =>
  enqueue(JOB_TYPES.GIFT_NOTIFICATION, "Gift notification", data);

export const queueResetPassword = (data) =>
  enqueue(JOB_TYPES.RESET_PASSWORD, "Password reset", data);

export const queueWelcomeEmail = (data) =>
  enqueue(JOB_TYPES.WELCOME, "Welcome email", data);

export const queueNewsletter = (data) =>
  enqueue(JOB_TYPES.NEWSLETTER, "Newsletter", data);

export const queueContactForm = (data) =>
  enqueue(JOB_TYPES.CONTACT_FORM, "Contact form submission", data);

export const queueContactConfirmation = (data) =>
  enqueue(JOB_TYPES.CONTACT_CONFIRMATION, "Contact confirmation", data);

export const queueRefundInitiated = (data) =>
  enqueue(JOB_TYPES.REFUND_INITIATED, "Refund initiated", data);

export const queueRefundCompleted = (data) =>
  enqueue(JOB_TYPES.REFUND_COMPLETED, "Refund completed", data);

export const queueRefundFailed = (data) =>
  enqueue(JOB_TYPES.REFUND_FAILED, "Refund failed", data);

export const queueRefundRejected = (data) =>
  enqueue(JOB_TYPES.REFUND_REJECTED, "Refund rejected", data);

export const queueOrderCancellation = (data) =>
  enqueue(JOB_TYPES.ORDER_CANCELLATION, "Order cancellation", data);

export const queueAdminCancellationNotification = (data) =>
  enqueue(
    JOB_TYPES.ADMIN_CANCELLATION_NOTIFICATION,
    "Admin cancellation alert",
    data,
  );

export default emailQueue;
