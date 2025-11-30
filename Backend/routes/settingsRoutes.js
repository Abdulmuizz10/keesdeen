import express from "express";
import {
  getHeroController,
  adminGetHeroSettingsController,
  adminUpdateHeroSettingsController,
  adminCreateHeroImageController,
  adminUpdateHeroImageController,
  adminDeleteHeroImage,
  adminReorderHeroImages,
} from "../controllers/settingsControllers.js";
import { verifyUser, authorizeAdmin } from "../middleware/verify.js";

const router = express.Router();

// Public route - Get active hero settings
router.get("/get-hero", getHeroController);

// Admin routes
router.get(
  "/admin/get-hero",
  verifyUser,
  authorizeAdmin,
  adminGetHeroSettingsController
);

router.put(
  "/admin/update-hero",
  verifyUser,
  authorizeAdmin,
  adminUpdateHeroSettingsController
);

router.post(
  "/admin/create-hero-image",
  verifyUser,
  authorizeAdmin,
  adminCreateHeroImageController
);

router.put(
  "/admin/:imageId/update-hero-image",
  verifyUser,
  authorizeAdmin,
  adminUpdateHeroImageController
);

router.delete(
  "/admin/:imageId/delete-hero-image",
  verifyUser,
  authorizeAdmin,
  adminDeleteHeroImage
);

router.post(
  "/admin/reorder-hero-images",
  verifyUser,
  authorizeAdmin,
  adminReorderHeroImages
);

export default router;
