import express from "express";
import {
  getCurrentUserProfile,
  adminGetUsersByPagination,
  adminGetUserById,
  adminUpdateUser,
  adminUpdateUserRole,
  adminDeleteUser,
} from "../controllers/usersControllers.js";
import { verifyUser, authorizeAdmin } from "../middleware/verify.js";

const router = express.Router();

router.get("/profile", verifyUser, getCurrentUserProfile);

// Admin
router.get(
  "/admin/pagination-users",
  verifyUser,
  authorizeAdmin,
  adminGetUsersByPagination
);
router.get(
  "/admin/find-user/:id",
  verifyUser,
  authorizeAdmin,
  adminGetUserById
);
router.put(
  "/admin/:id/update-user",
  verifyUser,
  authorizeAdmin,
  adminUpdateUser
);
router.patch(
  "/admin/:id/role",
  verifyUser,
  authorizeAdmin,
  adminUpdateUserRole
);
router.delete(
  "/admin/:id/delete-user",
  verifyUser,
  authorizeAdmin,
  adminDeleteUser
);

export default router;
