import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

// ── Internal: middleware & background jobs ────────────────────────────────────
import { globalRateLimiter } from "./middleware/rateLimiter.js";
import { startTokenCleanupJob } from "./lib/tokenCleanup.js";

// ── Internal: email infrastructure ───────────────────────────────────────────
// Importing the worker boots it — it begins listening to the queue immediately.
// Must be imported AFTER dotenv so RESEND_API_KEY and UPSTASH_REDIS_URL are set.
import "./email/workers/emailWorker.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import { bullBoardAuth, bullBoardRouter } from "./email/config/bullBoard.js";

// ── App routes ────────────────────────────────────────────────────────────────
import cookieRoutes from "./routes/cookieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import utilityRoutes from "./routes/utilityRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import dashboardAnalyticsRoutes from "./routes/dashboardAnalyticsRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import refundRoutes from "./routes/refundRoutes.js";

// ─────────────────────────────────────────────────────────────────────────────
// App initialisation
// ─────────────────────────────────────────────────────────────────────────────
const app = express();

// ─────────────────────────────────────────────────────────────────────────────
// Security middleware
// Must be registered before any routes so every request is covered.
// ─────────────────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(mongoSanitize()); // strips $ and . from req.body / req.params
app.use(globalRateLimiter); // IP-based rate limiting on all routes

// ─────────────────────────────────────────────────────────────────────────────
// CORS
// Credentials (cookies) require an explicit origin — wildcard won't work.
// ─────────────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// ─────────────────────────────────────────────────────────────────────────────
// Body parsing
//
// NOTE: webhookRoutes registers its own express.json() inline so the raw body
// is available for signature verification. Do NOT move webhooks below the
// global body parsers — order matters here.
// ─────────────────────────────────────────────────────────────────────────────
app.use("/api/webhooks/resend", express.raw({ type: "application/json" }));

app.use(express.json());

app.use("/api/webhooks", webhookRoutes);

app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());

// ─────────────────────────────────────────────────────────────────────────────
// Background jobs
// ─────────────────────────────────────────────────────────────────────────────
startTokenCleanupJob();

// ─────────────────────────────────────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// App routes
// ─────────────────────────────────────────────────────────────────────────────
app.use(cookieRoutes);
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/subscribers", subscriberRoutes);
app.use("/address", addressRoutes);
app.use("/utility", utilityRoutes);
app.use("/coupons", couponRoutes);
app.use("/analytics", dashboardAnalyticsRoutes);
app.use("/settings", settingsRoutes);
app.use("/contact", contactRoutes);
app.use("/refunds", refundRoutes);

// ─────────────────────────────────────────────────────────────────────────────
// Bull Board — queue dashboard (admin only)
// Access: https://yourdomain.com/admin/queues?password=yourpassword
// Protected by bullBoardAuth middleware — set BULL_BOARD_PASSWORD in .env
// ─────────────────────────────────────────────────────────────────────────────
app.use("/admin/queues", bullBoardAuth, bullBoardRouter);

// ─────────────────────────────────────────────────────────────────────────────
// Global error handler
// Catches anything thrown from routes or middleware that wasn't handled locally.
// Keep this LAST — Express identifies error handlers by their 4-argument signature.
// ─────────────────────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "An unexpected error occurred"
      : err.message;

  console.error(`[${new Date().toISOString()}] ${status} — ${err.message}`);
  res.status(status).json({ success: false, error: message });
});

// ─────────────────────────────────────────────────────────────────────────────
// Database + server boot
//
// Uses the production URL when NODE_ENV=production, local URL otherwise.
// The server only starts AFTER the DB connection is established — this prevents
// routes from handling requests before Mongoose models are ready.
// ─────────────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
const DATABASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_DB_URL
    : process.env.LOCAL_URL;

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `[server] Environment : ${process.env.NODE_ENV || "development"}`,
      );
      console.log(`[server] Port        : ${PORT}`);
      console.log(`[server] Database    : connected`);
      console.log(
        `[server] Queue UI    : http://localhost:${PORT}/admin/queues`,
      );
    });
  })
  .catch((error) => {
    console.error("[server] Database connection failed:", error.message);
    process.exit(1); // hard exit — don't serve with no DB
  });
