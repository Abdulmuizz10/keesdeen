import express from "express";
import {
  sendContactConfirmationEmail,
  sendContactEmail,
} from "../lib/utils.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message, imageUrl } =
      req.body;

    // Validation
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Send email to admin/support team
    await sendContactEmail({
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
      imageUrl,
    });

    // Send confirmation email to customer
    await sendContactConfirmationEmail({
      email,
      firstName,
      subject,
    });

    res.status(200).json({
      success: true,
      message:
        "Your message has been sent successfully. We'll get back to you soon!",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
});

export default router;
