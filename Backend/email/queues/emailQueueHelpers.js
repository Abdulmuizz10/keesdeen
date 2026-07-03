// ---------------------------------------------------------------------------
// emailQueueHelpers.js
//
// Thin wrappers that:
//   1. Create an EmailLog record (status: "pending") so it's trackable
//      immediately — even before the job runs
//   2. Attach the log's _id to the job payload so the worker can update it
//   3. Enqueue the job
//
// Your Express routes import from THIS file, not from emailQueue.js directly.
// ---------------------------------------------------------------------------
import EmailLog from "../models/EmailLog.js";
import {
  queueOrderConfirmation,
  queueAdminOrderNotification,
  queueOrderStatus,
  queueGiftNotification,
  queueResetPassword,
  queueWelcomeEmail,
  queueNewsletter,
  queueContactForm,
  queueContactConfirmation,
  queueRefundInitiated,
  queueRefundCompleted,
  queueRefundFailed,
  queueRefundRejected,
  queueOrderCancellation,
  queueAdminCancellationNotification,
} from "../queues/emailQueue.js";

// ---------------------------------------------------------------------------
// Helper: create a pending log record and merge its ID into the payload
// ---------------------------------------------------------------------------
const createLogAndEnqueue = async (queueFn, logFields, payload) => {
  const log = await EmailLog.create({ ...logFields, status: "pending" });
  const jobId = await queueFn({ ...payload, logId: log._id.toString() });
  await EmailLog.findByIdAndUpdate(log._id, { jobId });
  return { logId: log._id, jobId };
};

// ---------------------------------------------------------------------------
// Public helpers — call these from your routes
// ---------------------------------------------------------------------------

export const dispatchOrderConfirmation = (data) =>
  createLogAndEnqueue(queueOrderConfirmation, {
    type: "order_confirmation",
    to: data.email,
    subject: "Order Confirmed – Keesdeen",
    orderId: data.orderId,
  }, data);

export const dispatchAdminOrderNotification = (data) =>
  createLogAndEnqueue(queueAdminOrderNotification, {
    type: "admin_order_notification",
    to: process.env.ADMIN_EMAIL || process.env.FROM_EMAIL,
    subject: `New Order #${data.orderId?.slice(-8)} - ${data.firstName} ${data.lastName}`,
    orderId: data.orderId,
  }, data);

export const dispatchOrderStatus = (data) =>
  createLogAndEnqueue(queueOrderStatus, {
    type: "order_status",
    to: data.email,
    subject: `Order Status Update – Keesdeen`,
    orderId: data.orderId,
  }, data);

export const dispatchGiftNotification = (data) =>
  createLogAndEnqueue(queueGiftNotification, {
    type: "gift_notification",
    to: data.recipientEmail,
    subject: "A Gift is on Its Way – Keesdeen",
  }, data);

export const dispatchResetPassword = (data) =>
  createLogAndEnqueue(queueResetPassword, {
    type: "reset_password",
    to: data.email,
    subject: data.subject,
  }, data);

export const dispatchWelcomeEmail = (data) =>
  createLogAndEnqueue(queueWelcomeEmail, {
    type: "welcome",
    to: data.email,
    subject: data.action === "signup" ? "Welcome to Keesdeen" : "Welcome Back to Keesdeen",
  }, data);

export const dispatchNewsletter = (data) =>
  createLogAndEnqueue(queueNewsletter, {
    type: "newsletter",
    to: data.email,
    subject: data.subject,
  }, data);

export const dispatchContactForm = (data) =>
  createLogAndEnqueue(queueContactForm, {
    type: "contact_form",
    to: process.env.ADMIN_EMAIL || process.env.FROM_EMAIL,
    subject: `New Contact Form - ${data.firstName} ${data.lastName}`,
  }, data);

export const dispatchContactConfirmation = (data) =>
  createLogAndEnqueue(queueContactConfirmation, {
    type: "contact_confirmation",
    to: data.email,
    subject: "We've Received Your Message – Keesdeen",
  }, data);

export const dispatchRefundInitiated = (data) =>
  createLogAndEnqueue(queueRefundInitiated, {
    type: "refund_initiated",
    to: data.email,
    subject: `Refund Initiated – Order #${data.orderId?.slice(-8).toUpperCase()}`,
    orderId: data.orderId,
  }, data);

export const dispatchRefundCompleted = (data) =>
  createLogAndEnqueue(queueRefundCompleted, {
    type: "refund_completed",
    to: data.email,
    subject: `Refund Processed – Order #${data.orderId?.slice(-8).toUpperCase()}`,
    orderId: data.orderId,
  }, data);

export const dispatchRefundFailed = (data) =>
  createLogAndEnqueue(queueRefundFailed, {
    type: "refund_failed",
    to: data.email,
    subject: `Refund Issue – Order #${data.orderId?.slice(-8).toUpperCase()}`,
    orderId: data.orderId,
  }, data);

export const dispatchRefundRejected = (data) =>
  createLogAndEnqueue(queueRefundRejected, {
    type: "refund_rejected",
    to: data.email,
    subject: `Refund Update – Order #${data.orderId?.slice(-8).toUpperCase()}`,
    orderId: data.orderId,
  }, data);

export const dispatchOrderCancellation = (data) =>
  createLogAndEnqueue(queueOrderCancellation, {
    type: "order_cancellation",
    to: data.email,
    subject: `Order Cancelled – #${data.orderId?.slice(-8).toUpperCase()}`,
    orderId: data.orderId,
  }, data);

export const dispatchAdminCancellationNotification = (data) =>
  createLogAndEnqueue(queueAdminCancellationNotification, {
    type: "admin_cancellation_notification",
    to: process.env.ADMIN_EMAIL || process.env.FROM_EMAIL,
    subject: `Order Cancelled #${data.orderId?.slice(-8).toUpperCase()}`,
    orderId: data.orderId,
  }, data);
