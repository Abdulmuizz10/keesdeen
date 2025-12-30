import express from "express";
import {
  signUp,
  signIn,
  googleSignIn,
  logout,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
} from "../controllers/authControllers.js";
import {
  authRateLimiter,
  refreshTokenRateLimiter,
  passwordResetRateLimiter,
  skipRateLimitOnSuccess,
} from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/sign-up", skipRateLimitOnSuccess, authRateLimiter, signUp);
router.post("/sign-in", skipRateLimitOnSuccess, authRateLimiter, signIn);
router.post(
  "/google-sign-in",
  skipRateLimitOnSuccess,
  authRateLimiter,
  googleSignIn
);
router.post("/refresh-token", refreshTokenRateLimiter, refreshAccessToken);
router.post("/forget-password", passwordResetRateLimiter, forgotPassword);
router.post("/reset-password/:token", passwordResetRateLimiter, resetPassword);
router.post("/logout", logout);

export default router;
