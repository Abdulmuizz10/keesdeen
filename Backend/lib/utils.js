import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// 🧩 Create reusable transporter
const createTransporter = () =>
  nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

// 🧩 Shared email template wrapper (Zara/Nike style)
const generateEmailTemplate = (title, bodyContent) => `
  <div style="font-family: 'Poppins', 'Helvetica Neue', Arial, sans-serif; background-color: #f8f8f8; padding: 40px 0;">
    <!-- Load Google Font -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />

    <div style="max-width: 600px; background-color: #fff; margin: auto; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.08);">
      <!-- Header -->
      <div style="background-color: #04BB6E; padding: 24px; text-align: center;">
        <h1 style="color: #fff; font-size: 26px; margin: 0; letter-spacing: 1.5px; font-weight: 600;">KEESDEEN</h1>
      </div>

      <!-- Body -->
      <div style="padding: 40px 40px 30px;">
        <h2 style="color: #3c3c3c; font-size: 22px; margin-bottom: 18px; font-weight: 600;">${title}</h2>
        <div style="color: #555; font-size: 15px; line-height: 1.7; font-weight: 400;">
          ${bodyContent}
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #fafafa; text-align: center; padding: 16px 0; color: #999; font-size: 13px; font-weight: 400;">
        © ${new Date().getFullYear()} <strong style="color: #3c3c3c;">Keesdeen</strong>. All rights reserved.
      </div>
    </div>
  </div>
`;

// 🧩 1. ORDER CONFIRMATION EMAIL
export const sendOrderConfirmationEmail = async (
  email,
  firstName,
  lastName,
  totalPrice,
  currency,
  orderedItems,
  orderId
) => {
  const transporter = createTransporter();

  const itemsHtml = orderedItems
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 0;">${item.qty} × ${item.name}</td>
          <td style="text-align:right;">${formatAmount(
            item.price,
            currency
          )}</td>
        </tr>`
    )
    .join("");

  const html = generateEmailTemplate(
    "Order Confirmation",
    `
      <p style="font-size:16px; color:#555;">Hi ${firstName} ${lastName},</p>
      <p style="font-size:16px; color:#555;">
        Thank you for shopping with <strong>Keesdeen</strong>. Your order has been successfully placed.
      </p>
      <p><strong>Order ID:</strong> ${orderId}</p>

      <table width="100%" style="margin-top:20px; border-collapse:collapse;">
        ${itemsHtml}
        <tr>
          <td style="border-top:1px solid #eee; padding-top:10px; font-weight:bold;">Total</td>
          <td style="border-top:1px solid #eee; padding-top:10px; text-align:right; font-weight:bold;">
            ${formatAmount(totalPrice, currency)}
          </td>
        </tr>
      </table>

      <p style="margin-top:20px;">We’ll notify you once your order ships. You can view your order history anytime in your Keesdeen account.</p>
      <div style="text-align:center; margin-top:30px;">
        <a href="${process.env.FRONTEND_URL}/collections/shop_all"
           style="background-color:#04BB6E; color:#fff; text-decoration:none; padding:12px 28px; border-radius:30px; font-weight:bold; letter-spacing:0.5px;">
           Continue Shopping
        </a>
      </div>
    `
  );

  await transporter.sendMail({
    from: `"Keesdeen" <${process.env.EMAIL}>`,
    to: email,
    subject: "Your Keesdeen Order Confirmation",
    html,
  });
};

// 🧩 2. GIFT NOTIFICATION EMAIL
export const sendGiftNotificationEmail = async (
  recipientEmail,
  firstName,
  lastName,
  senderName
) => {
  const transporter = createTransporter();

  const html = generateEmailTemplate(
    "A Special Delivery from Keesdeen",
    `
      <p style="font-size:16px; color:#555;">Hi ${firstName} ${lastName},</p>
      <p style="font-size:16px; color:#555;">
        You’ve received a special order from <strong>${senderName}</strong> through Keesdeen.
      </p>
      <p style="margin-top:10px;">We'll keep you updated once it's on its way!</p>
      <div style="text-align:center; margin-top:30px;">
        <a href="${process.env.FRONTEND_URL}"
           style="background-color:#04BB6E; color:#fff; text-decoration:none; padding:12px 28px; border-radius:30px; font-weight:bold;">
           Visit Keesdeen
        </a>
      </div>
    `
  );

  await transporter.sendMail({
    from: `"Keesdeen" <${process.env.EMAIL}>`,
    to: recipientEmail,
    subject: "A Gift is on Its Way to You 🎁",
    html,
  });
};

// 🧩 3. RESET PASSWORD EMAIL
export const sendResetEmailLink = async ({ email, subject, message }) => {
  const transporter = createTransporter();

  const html = generateEmailTemplate(
    subject,
    `<p style="font-size:16px; color:#555;">${message}</p>`
  );

  await transporter.sendMail({
    from: `"Keesdeen" <${process.env.EMAIL}>`,
    to: email,
    subject,
    html,
  });
};

// 🧩 4. WELCOME EMAIL
export const sendWelcomeEmail = async (email, firstName, action) => {
  const transporter = createTransporter();

  const isSignup = action === "signup";
  const subject = isSignup
    ? "Welcome to Keesdeen – Elevate Your Wardrobe"
    : "Welcome Back to Keesdeen";

  const html = generateEmailTemplate(
    isSignup ? `Welcome, ${firstName}!` : `Hello again, ${firstName}!`,
    `
      <p style="font-size:16px; color:#555;">
        ${
          isSignup
            ? "We’re thrilled to have you join our community of confident and stylish women."
            : "We’re so glad to see you again! Discover what’s new and trending."
        }
      </p>
      <div style="text-align:center; margin-top:30px;">
        <a href="${process.env.FRONTEND_URL}/collections/shop_all"
           style="background-color:#04BB6E; color:#fff; text-decoration:none; padding:12px 28px; border-radius:30px; font-weight:bold;">
           Shop Now
        </a>
      </div>
    `
  );

  await transporter.sendMail({
    from: `"Keesdeen" <${process.env.EMAIL}>`,
    to: email,
    subject,
    html,
  });
};

// 🧩 5. NEWSLETTER / SUBSCRIBER EMAIL
export const sendSubscribersEmail = async (email, subject, message) => {
  const transporter = createTransporter();

  const html = generateEmailTemplate(
    subject,
    `<p style="font-size:16px; color:#555;">${message}</p>`
  );

  await transporter.sendMail({
    from: `"Keesdeen" <${process.env.EMAIL}>`,
    to: Array.isArray(email) ? email.join(", ") : email,
    subject,
    html,
  });
};

export const formatAmount = (amount, currency) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
};
