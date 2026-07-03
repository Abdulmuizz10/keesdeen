import express from "express";
import { Webhook } from "svix";
import EmailLog from "../models/EmailLog.js";

const router = express.Router();

router.post("/resend", async (req, res) => {
  // Respond immediately so Resend doesn't retry
  res.status(200).json({ received: true });

  const signingSecret = process.env.RESEND_WEBHOOK_SECRET;

  if (!signingSecret) {
    console.warn(
      "[webhook] RESEND_WEBHOOK_SECRET not set — skipping verification",
    );
    return;
  }

  try {
    const wh = new Webhook(signingSecret);

    // express.raw() gives us a Buffer
    const payload = req.body.toString("utf8");

    const event = wh.verify(payload, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { type, data } = event;

    switch (type) {
      case "email.delivered":
        await EmailLog.findOneAndUpdate(
          { resendEmailId: data.email_id },
          {
            status: "delivered",
            deliveredAt: new Date(),
          },
        );

        console.log(`[webhook] Delivered: ${data.email_id}`);
        break;

      case "email.bounced":
        await EmailLog.findOneAndUpdate(
          { resendEmailId: data.email_id },
          {
            status: "bounced",
            bouncedAt: new Date(),
            lastError: `Bounced: ${data.bounce?.message ?? "unknown reason"}`,
          },
        );

        console.warn(
          `[webhook] Bounced: ${data.email_id} — ${
            data.bounce?.message ?? "unknown reason"
          }`,
        );
        break;

      case "email.complained":
        await EmailLog.findOneAndUpdate(
          { resendEmailId: data.email_id },
          {
            status: "bounced",
            lastError: "Spam complaint received",
          },
        );

        console.warn(`[webhook] Spam complaint: ${data.email_id}`);
        break;

      default:
        console.log(`[webhook] Unhandled event type: ${type}`);
    }
  } catch (err) {
    console.warn("[webhook] Invalid Resend signature");

    // Helpful while debugging
    console.error(err);
  }
});

export default router;
