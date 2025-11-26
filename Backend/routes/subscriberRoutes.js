import express from "express";
import {
  createSubscriber,
  unSubscribeByToken,
  adminGetAllSubscribers,
  adminDeleteSubscriber,
  adminCreateEmailCampaign,
  adminSendEmailCampaign,
  adminGetAllCampaigns,
  adminGetCampaignAnalytics,
} from "../controllers/subscriberControllers.js";
import { verifyUser, authorizeAdmin } from "../middleware/verify.js";

const router = express.Router();

// Subscriber routes
router.post("/subscribe", createSubscriber);
router.post("/unsubscribe/:token", unSubscribeByToken);
router.get(
  "/admin/get-all-subscribers",
  verifyUser,
  authorizeAdmin,
  adminGetAllSubscribers
);
router.delete(
  "/admin/:id/delete-subscriber",
  verifyUser,
  authorizeAdmin,
  adminDeleteSubscriber
);

// Campaign routes
router.post(
  "/admin/campaigns/create-campaign",
  verifyUser,
  authorizeAdmin,
  adminCreateEmailCampaign
);

router.post(
  "/admin/campaigns/:campaignId/send",
  verifyUser,
  authorizeAdmin,
  adminSendEmailCampaign
);

router.get(
  "/admin/campaigns/get-all-campaigns",
  verifyUser,
  authorizeAdmin,
  adminGetAllCampaigns
);

router.get(
  "/admin/campaigns/analytics",
  verifyUser,
  authorizeAdmin,
  adminGetCampaignAnalytics
);

export default router;
