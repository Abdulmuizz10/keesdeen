import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const createTransporter = () => {
  const isProd = process.env.NODE_ENV === "production";

  return nodemailer.createTransport(
    isProd
      ? {
          host: "smtp.privateemail.com",
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
          },
        }
      : {
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
          },
          tls: { rejectUnauthorized: false },
        }
  );
};

const FROM_EMAIL =
  process.env.NODE_ENV === "production"
    ? process.env.SMTP_EMAIL
    : process.env.EMAIL;

// Luxury minimalist email template
const generateEmailTemplate = (title, bodyContent) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: system-ui, -apple-system, sans-serif;
        background-color: #ffffff;
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff;">
            
            <!-- Header -->
            <tr>
              <td style="padding: 0 0 32px 0; border-bottom: 1px solid #e5e7eb;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center">
                      <h1 style="margin: 0; font-size: 20px; font-weight: 300; letter-spacing: 0.15em; color: #111827; text-transform: uppercase;">
                        KEESDEEN
                      </h1>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 40px 0;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td>
                      <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 300; letter-spacing: -0.01em; color: #111827;">
                        ${title}
                      </h2>
                      <div style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                        ${bodyContent}
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 24px 0 0 0; border-top: 1px solid #e5e7eb;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" style="color: #9ca3af; font-size: 12px; line-height: 1.5;">
                      © ${new Date().getFullYear()} Keesdeen. All rights reserved.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

// 1. ORDER CONFIRMATION EMAIL
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
          <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">
            ${item.qty} × ${item.name}
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right; color: #111827; font-size: 14px; font-weight: 300;">
            ${formatAmount(item.price, currency)}
          </td>
        </tr>`
    )
    .join("");

  const html = generateEmailTemplate(
    "Order Confirmed",
    `
      <p style="margin: 0 0 8px 0; color: #111827;">Hi ${firstName},</p>
      <p style="margin: 0 0 24px 0;">
        Thank you for your purchase. Your order has been placed successfully.
      </p>
      
      <div style="margin: 24px 0; padding: 16px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">
        <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
          Order Details
        </p>
        <p style="margin: 0; color: #111827; font-size: 14px;">
          <span style="color: #6b7280;">Order ID:</span> ${orderId}
        </p>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
        ${itemsHtml}
        <tr>
          <td style="padding: 16px 0 0 0; color: #111827; font-size: 14px; font-weight: 300;">
            Total
          </td>
          <td style="padding: 16px 0 0 0; text-align: right; color: #111827; font-size: 14px; font-weight: 300;">
            ${formatAmount(totalPrice, currency)}
          </td>
        </tr>
      </table>

      <p style="margin: 24px 0;">
        We'll notify you once your order ships. You can view your order history anytime in your account.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0 0 0;">
        <tr>
          <td align="center">
            <a href="${process.env.FRONTEND_URL}/collections/shop_all"
               style="display: inline-block; border: 1px solid #111827; background-color: #111827; color: #ffffff; text-decoration: none; padding: 16px 32px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">
              Continue Shopping
            </a>
          </td>
        </tr>
      </table>
    `
  );

  await transporter.sendMail({
    from: `"Keesdeen" <${FROM_EMAIL}>`,
    to: email,
    subject: "Order Confirmed – Keesdeen",
    html,
  });
};

// 2. ORDER STATUS EMAIL

// export const sendOrderStatusEmail = async (
//   email,
//   firstName,
//   orderId,
//   status,
//   orderedItems,
//   totalPrice,
//   currency,
//   trackingNumber = null
// ) => {
//   const transporter = createTransporter();

//   const statusConfig = {
//     Shipped: {
//       title: "Your Order Has Shipped",
//       message: "Great news! Your order is on its way.",
//       icon: "📦",
//     },
//     Delivered: {
//       title: "Your Order Has Been Delivered",
//       message:
//         "Your order has been successfully delivered. We hope you love it!",
//       icon: "✓",
//     },
//   };

//   const config = statusConfig[status];
//   if (!config) {
//     throw new Error(`Unsupported status: ${status}`);
//   }

//   const itemsHtml = orderedItems
//     .map(
//       (item) => `
//         <tr>
//           <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">
//             ${item.qty} × ${item.name}
//           </td>
//           <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right; color: #111827; font-size: 14px; font-weight: 300;">
//             ${formatAmount(item.price, currency)}
//           </td>
//         </tr>`
//     )
//     .join("");

//   let trackingHtml = "";
//   if (status === "Shipped" && trackingNumber) {
//     trackingHtml = `
//       <div style="margin: 24px 0; padding: 16px; background-color: #f9fafb; border-radius: 8px;">
//         <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
//           Tracking Information
//         </p>
//         <p style="margin: 0; color: #111827; font-size: 14px; font-family: monospace;">
//           ${trackingNumber}
//         </p>
//       </div>
//     `;
//   }

//   const html = generateEmailTemplate(
//     config.title,
//     `
//       <p style="margin: 0 0 8px 0; color: #111827;">Hi ${firstName},</p>
//       <p style="margin: 0 0 24px 0;">
//         ${config.message}
//       </p>

//       <div style="margin: 24px 0; padding: 16px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">
//         <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
//           Order Details
//         </p>
//         <p style="margin: 0; color: #111827; font-size: 14px;">
//           <span style="color: #6b7280;">Order ID:</span> ${orderId}
//         </p>
//         <p style="margin: 8px 0 0 0; color: #111827; font-size: 14px;">
//           <span style="color: #6b7280;">Status:</span> ${status}
//         </p>
//       </div>

//       ${trackingHtml}

//       <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
//         ${itemsHtml}
//         <tr>
//           <td style="padding: 16px 0 0 0; color: #111827; font-size: 14px; font-weight: 300;">
//             Total
//           </td>
//           <td style="padding: 16px 0 0 0; text-align: right; color: #111827; font-size: 14px; font-weight: 300;">
//             ${formatAmount(totalPrice, currency)}
//           </td>
//         </tr>
//       </table>

//       ${
//         status === "Delivered"
//           ? `
//       <p style="margin: 24px 0;">
//         Thank you for choosing Keesdeen. We'd love to hear about your experience!
//       </p>
//       `
//           : ""
//       }

//       <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0 0 0;">
//         <tr>
//           <td align="center">
//             <a href="${process.env.FRONTEND_URL}/order_details/${orderId}"
//                style="display: inline-block; border: 1px solid #111827; background-color: #111827; color: #ffffff; text-decoration: none; padding: 16px 32px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">
//               View Order
//             </a>
//           </td>
//         </tr>
//       </table>
//     `
//   );

//   await transporter.sendMail({
//     from: `"Keesdeen" <${FROM_EMAIL}>`,
//     to: email,
//     subject: `${config.title} – Keesdeen`,
//     html,
//   });
// };

// 2. ORDER STATUS EMAIL

export const sendOrderStatusEmail = async (
  email,
  firstName,
  orderId,
  status,
  orderedItems,
  totalPrice,
  currency
) => {
  const transporter = createTransporter();

  const statusConfig = {
    Shipped: {
      title: "Your Order Has Shipped",
      message: "Great news! Your order is on its way.",
      icon: "📦",
    },
    Delivered: {
      title: "Your Order Has Been Delivered",
      message:
        "Your order has been successfully delivered. We hope you love it!",
      icon: "✓",
    },
  };

  const config = statusConfig[status];
  if (!config) {
    throw new Error(`Unsupported status: ${status}`);
  }

  const itemsHtml = orderedItems
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">
            ${item.qty} × ${item.name}
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right; color: #111827; font-size: 14px; font-weight: 300;">
            ${formatAmount(item.price, currency)}
          </td>
        </tr>`
    )
    .join("");

  const html = generateEmailTemplate(
    config.title,
    `
      <p style="margin: 0 0 8px 0; color: #111827;">Hi ${firstName},</p>
      <p style="margin: 0 0 24px 0;">
        ${config.message}
      </p>
      
      <div style="margin: 24px 0; padding: 16px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">
        <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
          Order Details
        </p>
        <p style="margin: 0; color: #111827; font-size: 14px;">
          <span style="color: #6b7280;">Order ID:</span> ${orderId}
        </p>
        <p style="margin: 8px 0 0 0; color: #111827; font-size: 14px;">
          <span style="color: #6b7280;">Status:</span> ${status}
        </p>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
        ${itemsHtml}
        <tr>
          <td style="padding: 16px 0 0 0; color: #111827; font-size: 14px; font-weight: 300;">
            Total
          </td>
          <td style="padding: 16px 0 0 0; text-align: right; color: #111827; font-size: 14px; font-weight: 300;">
            ${formatAmount(totalPrice, currency)}
          </td>
        </tr>
      </table>

      ${
        status === "Delivered"
          ? `
      <p style="margin: 24px 0;">
        Thank you for choosing Keesdeen. We'd love to hear about your experience!
      </p>
      `
          : ""
      }

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0 0 0;">
        <tr>
          <td align="center">
            <a href="${process.env.FRONTEND_URL}/order_details/${orderId}"
               style="display: inline-block; border: 1px solid #111827; background-color: #111827; color: #ffffff; text-decoration: none; padding: 16px 32px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">
              View Order
            </a>
          </td>
        </tr>
      </table>
    `
  );

  await transporter.sendMail({
    from: `"Keesdeen" <${FROM_EMAIL}>`,
    to: email,
    subject: `${config.title} – Keesdeen`,
    html,
  });
};

// 3. GIFT NOTIFICATION EMAIL
export const sendGiftNotificationEmail = async (
  recipientEmail,
  firstName,
  lastName,
  senderName
) => {
  const transporter = createTransporter();

  const html = generateEmailTemplate(
    "A Gift for You",
    `
      <p style="margin: 0 0 8px 0; color: #111827;">Hi ${firstName},</p>
      <p style="margin: 0 0 24px 0;">
        You've received a special order from <strong>${senderName}</strong>.
      </p>
      <p style="margin: 0 0 24px 0;">
        We'll keep you updated once it's on its way.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0 0 0;">
        <tr>
          <td align="center">
            <a href="${process.env.FRONTEND_URL}"
               style="display: inline-block; border: 1px solid #111827; background-color: #111827; color: #ffffff; text-decoration: none; padding: 16px 32px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">
              Visit Keesdeen
            </a>
          </td>
        </tr>
      </table>
    `
  );

  await transporter.sendMail({
    from: `"Keesdeen" <${FROM_EMAIL}>`,
    to: recipientEmail,
    subject: "A Gift is on Its Way – Keesdeen",
    html,
  });
};

// 4. RESET PASSWORD EMAIL
export const sendResetEmailLink = async ({ email, subject, message }) => {
  const transporter = createTransporter();

  const html = generateEmailTemplate(
    subject,
    `
      <p style="margin: 0 0 24px 0;">${message}</p>
    `
  );

  await transporter.sendMail({
    from: `"Keesdeen" <${FROM_EMAIL}>`,
    to: email,
    subject: `${subject} – Keesdeen`,
    html,
  });
};

// 5. WELCOME EMAIL
export const sendWelcomeEmail = async (email, firstName, action) => {
  const transporter = createTransporter();

  const isSignup = action === "signup";
  const subject = isSignup ? "Welcome to Keesdeen" : "Welcome Back to Keesdeen";

  const html = generateEmailTemplate(
    isSignup ? `Welcome, ${firstName}` : `Hello Again, ${firstName}`,
    `
      <p style="margin: 0 0 24px 0;">
        ${
          isSignup
            ? "Thank you for joining Keesdeen. We're excited to have you with us."
            : "We're glad to see you again. Discover what's new."
        }
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0 0 0;">
        <tr>
          <td align="center">
            <a href="${process.env.FRONTEND_URL}/collections/shop_all"
               style="display: inline-block; border: 1px solid #111827; background-color: #111827; color: #ffffff; text-decoration: none; padding: 16px 32px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">
              Shop Now
            </a>
          </td>
        </tr>
      </table>
    `
  );

  await transporter.sendMail({
    from: `"Keesdeen" <${FROM_EMAIL}>`,
    to: email,
    subject,
    html,
  });
};

// 6. NEWSLETTER / SUBSCRIBER EMAIL
export const sendSubscribersEmail = async (
  email,
  subject,
  message,
  imageUrl,
  unsubscribeToken // Add this parameter
) => {
  const transporter = createTransporter();

  // Build email content with optional image
  let emailContent = "";
  if (imageUrl) {
    emailContent += `
      <div style="margin: 0 0 24px 0; text-align: center;">
        <img src="${imageUrl}" alt="Campaign Image" style="max-width: 100%; height: auto; border-radius: 8px;" />
      </div>
    `;
  }

  emailContent += `<p style="margin: 0 0 24px 0; white-space: pre-wrap;">${message}</p>`;

  // Add unsubscribe link with actual token
  emailContent += `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #999;">
      <p>If you no longer wish to receive these emails, you can <a href="${process.env.FRONTEND_URL}/unsubscribe/${unsubscribeToken}" style="color: #666;">unsubscribe here</a>.</p>
    </div>
  `;

  const html = generateEmailTemplate(subject, emailContent);

  await transporter.sendMail({
    from: `"Keesdeen" <${FROM_EMAIL}>`,
    to: email, // Send to single email, not array
    subject: `${subject} – Keesdeen`,
    html,
  });
};

// 7. CONTACT FORM SUBMISSION (to admin)
export const sendContactEmail = async ({
  firstName,
  lastName,
  email,
  phone,
  subject,
  message,
  imageUrl,
}) => {
  const transporter = createTransporter();

  const subjectLabels = {
    order: "Order Inquiry",
    product: "Product Question",
    shipping: "Shipping & Delivery",
    return: "Returns & Exchanges",
    feedback: "Feedback",
    other: "Other",
  };

  const imageSection = imageUrl
    ? `
      <div style="margin: 24px 0;">
        <p style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
          Attached Image
        </p>
        <img 
          src="${imageUrl}" 
          alt="Customer attachment" 
          style="max-width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 8px;"
        />
      </div>
    `
    : "";

  const html = generateEmailTemplate(
    `New Contact Form: ${subjectLabels[subject] || subject}`,
    `
      <div style="margin: 24px 0; padding: 16px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">
        <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
          Customer Information
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding: 4px 0; color: #6b7280; font-size: 14px; width: 100px;">Name:</td>
            <td style="padding: 4px 0; color: #111827; font-size: 14px;">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6b7280; font-size: 14px;">Email:</td>
            <td style="padding: 4px 0; color: #111827; font-size: 14px;">
              <a href="mailto:${email}" style="color: #111827; text-decoration: underline;">${email}</a>
            </td>
          </tr>
          ${
            phone
              ? `
          <tr>
            <td style="padding: 4px 0; color: #6b7280; font-size: 14px;">Phone:</td>
            <td style="padding: 4px 0; color: #111827; font-size: 14px;">
              <a href="tel:${phone}" style="color: #111827; text-decoration: underline;">${phone}</a>
            </td>
          </tr>
          `
              : ""
          }
          <tr>
            <td style="padding: 4px 0; color: #6b7280; font-size: 14px;">Subject:</td>
            <td style="padding: 4px 0; color: #111827; font-size: 14px;">${
              subjectLabels[subject] || subject
            }</td>
          </tr>
        </table>
      </div>

      <div style="margin: 24px 0;">
        <p style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
          Message
        </p>
        <div style="padding: 16px; background-color: #f9fafb; border-radius: 8px; color: #111827; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
${message}
        </div>
      </div>

      ${imageSection}

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0 0 0;">
        <tr>
          <td align="center">
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(
      subjectLabels[subject] || subject
    )}" 
              style="display: inline-block; border: 1px solid #111827; background-color: #111827; color: #ffffff; text-decoration: none; padding: 16px 32px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">
              Reply to Customer
            </a>
          </td>
        </tr>
      </table>
    `
  );

  await transporter.sendMail({
    from: `"Keesdeen Contact Form" <${FROM_EMAIL}>`,
    to: FROM_EMAIL,
    replyTo: email,
    subject: `New Contact Form: ${
      subjectLabels[subject] || subject
    } - ${firstName} ${lastName}`,
    html,
  });
};

// 8. CONTACT FORM CONFIRMATION (to customer)
export const sendContactConfirmationEmail = async ({
  email,
  firstName,
  subject,
}) => {
  const transporter = createTransporter();

  const subjectLabels = {
    order: "Order Inquiry",
    product: "Product Question",
    shipping: "Shipping & Delivery",
    return: "Returns & Exchanges",
    feedback: "Feedback",
    other: "Other",
  };

  const html = generateEmailTemplate(
    "We've Received Your Message",
    `
      <p style="margin: 0 0 8px 0; color: #111827;">Hi ${firstName},</p>
      <p style="margin: 0 0 24px 0;">
        Thank you for reaching out to us. We've received your message regarding 
        <strong>${subjectLabels[subject] || subject}</strong> and our team will 
        get back to you within 3 days.
      </p>

      <div style="margin: 24px 0; padding: 16px; background-color: #f9fafb; border-radius: 8px;">
        <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
          In the meantime, you may find answers to common questions in our 
          <a href="${
            process.env.FRONTEND_URL
          }/faqs" style="color: #111827; text-decoration: underline;">FAQ section</a>.
        </p>
      </div>

      <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px;">
        Best regards,<br/>
        The Keesdeen Team
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0 0 0;">
        <tr>
          <td align="center">
            <a href="${process.env.FRONTEND_URL}" 
              style="display: inline-block; border: 1px solid #111827; background-color: #111827; color: #ffffff; text-decoration: none; padding: 16px 32px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">
              Visit Keesdeen
            </a>
          </td>
        </tr>
      </table>
    `
  );

  await transporter.sendMail({
    from: `"Keesdeen" <${FROM_EMAIL}>`,
    to: email,
    subject: "We've Received Your Message – Keesdeen",
    html,
  });
};

// 9. REFUND CONFIRMATION EMAIL
export const sendRefundConfirmationEmail = async (
  email,
  firstName,
  refundAmount,
  currency,
  reason,
  orderId
) => {
  const transporter = createTransporter();

  const html = generateEmailTemplate(
    "Refund Processed",
    `
      <p style="margin: 0 0 8px 0; color: #111827;">Hi ${firstName},</p>
      <p style="margin: 0 0 24px 0;">
        Your refund has been processed successfully.
      </p>
      
      <div style="margin: 24px 0; padding: 16px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">
        <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
          Refund Details
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding: 4px 0; color: #6b7280; font-size: 14px; width: 140px;">Order ID:</td>
            <td style="padding: 4px 0; color: #111827; font-size: 14px;">${orderId}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6b7280; font-size: 14px;">Refund Amount:</td>
            <td style="padding: 4px 0; color: #111827; font-size: 14px; font-weight: 300;">${formatAmount(
              refundAmount,
              currency
            )}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6b7280; font-size: 14px;">Reason:</td>
            <td style="padding: 4px 0; color: #111827; font-size: 14px;">${reason}</td>
          </tr>
        </table>
      </div>

      <div style="margin: 24px 0; padding: 16px; background-color: #f9fafb; border-radius: 8px;">
        <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
          The refund will appear on your original payment method within 5-10 business days, 
          depending on your bank or card issuer.
        </p>
      </div>

      <p style="margin: 24px 0 0 0;">
        If you have any questions about this refund, please don't hesitate to contact our support team.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0 0 0;">
        <tr>
          <td align="center">
            <a href="${process.env.FRONTEND_URL}/contact"
               style="display: inline-block; border: 1px solid #111827; background-color: #111827; color: #ffffff; text-decoration: none; padding: 16px 32px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">
              Contact Support
            </a>
          </td>
        </tr>
      </table>
    `
  );

  await transporter.sendMail({
    from: `"Keesdeen" <${FROM_EMAIL}>`,
    to: email,
    subject: `Refund Processed – Order #${orderId} – Keesdeen`,
    html,
  });
};

// Format currency
export const formatAmount = (amount, currency) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
};
