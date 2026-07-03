import { Worker, QueueEvents } from "bullmq";
import { redisConnection, QUEUE_NAMES, JOB_TYPES } from "../config/redis.js";
import EmailLog from "../../models/EmailLog.js";
import {
  sendOrderConfirmationEmail,
  sendPersonalOrderConfirmationEmail,
  sendOrderStatusEmail,
  sendGiftNotificationEmail,
  sendResetEmailLink,
  sendWelcomeEmail,
  sendSubscribersEmail,
  sendContactEmail,
  sendContactConfirmationEmail,
  sendRefundInitiatedEmail,
  sendRefundCompletedEmail,
  sendRefundFailedEmail,
  sendRefundRejectedEmail,
  sendOrderCancellationEmail,
  sendAdminOrderCancellationNotification,
} from "../../lib/utils.js";

// ---------------------------------------------------------------------------
// Route a job to the correct emailUtils function.
// Each case destructures exactly the fields each function expects.
// ---------------------------------------------------------------------------
const processEmailJob = async (job) => {
  const { type, payload } = job.data;

  switch (type) {
    case JOB_TYPES.ORDER_CONFIRMATION:
      return sendOrderConfirmationEmail(
        payload.email,
        payload.firstName,
        payload.lastName,
        payload.totalPrice,
        payload.currency,
        payload.orderedItems,
        payload.orderId,
      );

    case JOB_TYPES.ADMIN_ORDER_NOTIFICATION:
      return sendPersonalOrderConfirmationEmail(
        payload.customerEmail,
        payload.firstName,
        payload.lastName,
        payload.totalPrice,
        payload.currency,
        payload.orderedItems,
        payload.orderId,
        payload.shippingAddress,
      );

    case JOB_TYPES.ORDER_STATUS:
      return sendOrderStatusEmail(
        payload.email,
        payload.firstName,
        payload.orderId,
        payload.status,
        payload.orderedItems,
        payload.totalPrice,
        payload.currency,
      );

    case JOB_TYPES.GIFT_NOTIFICATION:
      return sendGiftNotificationEmail(
        payload.recipientEmail,
        payload.firstName,
        payload.lastName,
        payload.senderName,
      );

    case JOB_TYPES.RESET_PASSWORD:
      return sendResetEmailLink(payload);

    case JOB_TYPES.WELCOME:
      return sendWelcomeEmail(payload.email, payload.firstName, payload.action);

    case JOB_TYPES.NEWSLETTER:
      return sendSubscribersEmail(
        payload.email,
        payload.subject,
        payload.message,
        payload.imageUrl,
        payload.unsubscribeToken,
      );

    case JOB_TYPES.CONTACT_FORM:
      return sendContactEmail(payload);

    case JOB_TYPES.CONTACT_CONFIRMATION:
      return sendContactConfirmationEmail(payload);

    case JOB_TYPES.REFUND_INITIATED:
      return sendRefundInitiatedEmail(
        payload.email,
        payload.firstName,
        payload.refundAmount,
        payload.currency,
        payload.reason,
        payload.orderId,
        payload.estimatedDays,
        payload.initiatedBy,
      );

    case JOB_TYPES.REFUND_COMPLETED:
      return sendRefundCompletedEmail(
        payload.email,
        payload.firstName,
        payload.refundAmount,
        payload.currency,
        payload.reason,
        payload.orderId,
        payload.estimatedDays,
      );

    case JOB_TYPES.REFUND_FAILED:
      return sendRefundFailedEmail(
        payload.email,
        payload.firstName,
        payload.refundAmount,
        payload.currency,
        payload.reason,
        payload.orderId,
        payload.failureReason,
      );

    case JOB_TYPES.REFUND_REJECTED:
      return sendRefundRejectedEmail(
        payload.email,
        payload.firstName,
        payload.refundAmount,
        payload.currency,
        payload.reason,
        payload.orderId,
        payload.rejectionReason,
      );

    case JOB_TYPES.ORDER_CANCELLATION:
      return sendOrderCancellationEmail(
        payload.email,
        payload.firstName,
        payload.totalPrice,
        payload.currency,
        payload.orderedItems,
        payload.orderId,
        payload.cancellationReason,
        payload.refundId,
        payload.cancelledBy,
      );

    case JOB_TYPES.ADMIN_CANCELLATION_NOTIFICATION:
      return sendAdminOrderCancellationNotification(
        payload.customerEmail,
        payload.firstName,
        payload.lastName,
        payload.totalPrice,
        payload.currency,
        payload.orderedItems,
        payload.orderId,
        payload.cancellationReason,
        payload.cancelledBy,
      );

    default:
      throw new Error(`Unknown email job type: ${type}`);
  }
};

// ---------------------------------------------------------------------------
// The worker — picks up jobs from the queue one at a time (concurrency: 5
// means up to 5 emails in-flight simultaneously, safe for Resend free tier).
// ---------------------------------------------------------------------------
const emailWorker = new Worker(
  QUEUE_NAMES.EMAIL,
  async (job) => {
    const logId = job.data.payload?.logId;

    // Mark as "sending" so the admin panel shows it's in progress
    if (logId) {
      await EmailLog.findByIdAndUpdate(logId, {
        status: "sending",
        attempts: job.attemptsMade + 1,
      });
    }

    // Call the actual Resend send function
    const result = await processEmailJob(job);

    // Persist Resend's returned email ID for webhook correlation
    if (logId && result?.id) {
      await EmailLog.findByIdAndUpdate(logId, {
        status: "sent",
        resendEmailId: result.id,
        sentAt: new Date(),
        jobId: job.id,
      });
    }

    return result;
  },
  {
    connection: redisConnection,
    concurrency: 5, // process up to 5 jobs simultaneously
    // BullMQ will automatically retry based on the job's backoff settings.
    // No extra retry logic needed here — BullMQ handles it.
  },
);

// ---------------------------------------------------------------------------
// Worker event hooks — logs to console + marks DB on terminal failure
// ---------------------------------------------------------------------------

emailWorker.on("completed", (job) => {
  console.log(`[email-worker] ✓ Job ${job.id} (${job.name}) completed`);
});

emailWorker.on("failed", async (job, error) => {
  const isFinal = job.attemptsMade >= job.opts.attempts;
  console.error(
    `[email-worker] ✗ Job ${job.id} (${job.name}) failed — attempt ${job.attemptsMade}/${job.opts.attempts}: ${error.message}`,
  );

  const logId = job.data?.payload?.logId;

  if (isFinal && logId) {
    // All retries exhausted — mark as failed in the DB
    await EmailLog.findByIdAndUpdate(logId, {
      status: "failed",
      lastError: error.message,
    }).catch(console.error);

    // Optionally alert the admin here (e.g. send a Slack webhook or a direct
    // Resend email — bypassing the queue since the queue itself may be the issue)
    await notifyAdminOfFailure(job, error).catch(console.error);
  }
});

emailWorker.on("error", (error) => {
  console.error("[email-worker] Worker error:", error);
});

// ---------------------------------------------------------------------------
// Admin failure alert — fires a raw Resend call (no queue) so a critical
// email failure always reaches the merchant regardless of queue health.
// ---------------------------------------------------------------------------
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

const notifyAdminOfFailure = async (job, error) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.FROM_EMAIL;
  if (!adminEmail) return;

  await resend.emails.send({
    from: `Keesdeen System <${process.env.FROM_EMAIL}>`,
    to: adminEmail,
    subject: `[Action Required] Email job failed — ${job.name}`,
    html: `
      <p style="font-family:system-ui;font-size:14px;color:#111827;">
        <strong>Email job permanently failed after all retry attempts.</strong>
      </p>
      <table style="font-family:system-ui;font-size:14px;border-collapse:collapse;width:100%;max-width:500px;">
        <tr><td style="padding:4px 8px;color:#6b7280;width:100px;">Job ID</td><td style="padding:4px 8px;">${job.id}</td></tr>
        <tr><td style="padding:4px 8px;color:#6b7280;">Job type</td><td style="padding:4px 8px;">${job.data?.type}</td></tr>
        <tr><td style="padding:4px 8px;color:#6b7280;">Recipient</td><td style="padding:4px 8px;">${job.data?.payload?.email || job.data?.payload?.customerEmail || "—"}</td></tr>
        <tr><td style="padding:4px 8px;color:#6b7280;">Error</td><td style="padding:4px 8px;color:#dc2626;">${error.message}</td></tr>
        <tr><td style="padding:4px 8px;color:#6b7280;">Attempts</td><td style="padding:4px 8px;">${job.attemptsMade}</td></tr>
        <tr><td style="padding:4px 8px;color:#6b7280;">Queued at</td><td style="padding:4px 8px;">${job.data?.enqueuedAt}</td></tr>
      </table>
      <p style="font-family:system-ui;font-size:13px;color:#6b7280;margin-top:16px;">
        Log into Bull Board (<code>${process.env.FRONTEND_URL}/admin/queues</code>) to inspect and replay this job.
      </p>
    `,
  });
};

export default emailWorker;
