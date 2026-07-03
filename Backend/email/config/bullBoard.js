import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import emailQueue from "../queues/emailQueue.js";

// ---------------------------------------------------------------------------
// Bull Board — a web UI that shows your queue in real time.
//
// At /admin/queues you'll see:
//   - Every job in the queue (waiting, active, completed, failed)
//   - The full payload of each job
//   - Retry/discard buttons for failed jobs
//   - Throughput graphs
//
// Protected by a simple password check below.
// For production, swap this for your existing admin auth middleware.
// ---------------------------------------------------------------------------

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(emailQueue)],
  serverAdapter,
});

// ---------------------------------------------------------------------------
// Middleware: protect Bull Board behind a basic password.
// Set BULL_BOARD_PASSWORD in your .env — do NOT skip this in production.
// ---------------------------------------------------------------------------
export const bullBoardAuth = (req, res, next) => {
  const password = process.env.BULL_BOARD_PASSWORD;
  if (!password) {
    // No password set — only allow in development
    if (process.env.NODE_ENV === "production") {
      return res.status(503).json({
        error:
          "Bull Board is disabled in production until BULL_BOARD_PASSWORD is set",
      });
    }
    return next();
  }

  const provided = req.query.password || req.headers["x-bull-board-password"];
  if (provided !== password) {
    return res
      .status(401)
      .set("WWW-Authenticate", 'Basic realm="Bull Board"')
      .json({ error: "Unauthorized — provide ?password=yourpassword" });
  }

  next();
};

export const bullBoardRouter = serverAdapter.getRouter();
