import express from "express";
import {
  adminCreateUtility,
  adminGetUtility,
  adminUpdateUtility,
} from "../controllers/utilityControllers.js";
import { verifyUser, authorizeAdmin } from "../middleware/verify.js";

const router = express.Router();

router.post(
  "/admin/create-utility",
  verifyUser,
  authorizeAdmin,
  adminCreateUtility
);
router.get("/admin/get-utility", verifyUser, authorizeAdmin, adminGetUtility);
router.patch(
  "/admin/update-utility",
  verifyUser,
  authorizeAdmin,
  adminUpdateUtility
);

export default router;
