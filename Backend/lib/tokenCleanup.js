import cron from "node-cron";
import { cleanupExpiredTokens } from "../controllers/authControllers.js";

// Run cleanup every day at 2 AM
export const startTokenCleanupJob = () => {
  cron.schedule("0 2 * * *", async () => {
    console.log("Running token cleanup job...");
    await cleanupExpiredTokens();
  });
  console.log("Token cleanup cron job scheduled");
};
