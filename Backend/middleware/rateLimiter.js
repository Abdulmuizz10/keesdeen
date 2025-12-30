import rateLimit from "express-rate-limit";

// Custom message for rate limit
const rateLimitMessage = {
  message: "Too many requests from this IP, please try again later.",
  retryAfter: "Check the Retry-After header",
};

// 1. STRICT: Auth endpoints (signup, signin, password reset)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: {
    message:
      "Too many authentication attempts. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Memory store (default) - FREE!
  skip: (req) => {
    // Skip rate limiting for successful requests (only count failures)
    return req.skipRateLimit === true;
  },
});

// 2. MODERATE: Refresh token endpoint
export const refreshTokenRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 refresh attempts per 15 minutes
  message: {
    message: "Too many token refresh attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. LENIENT: General API endpoints
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: rateLimitMessage,
  standardHeaders: true,
  legacyHeaders: false,
});

// 4. VERY STRICT: Password reset endpoint
export const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: {
    message: "Too many password reset attempts. Please try again in 1 hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 5. STRICT: File upload endpoints
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: {
    message: "Too many upload attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 6. MODERATE: Payment/Checkout endpoints
export const paymentRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 payment attempts per 15 minutes
  message: {
    message:
      "Too many payment attempts. Please contact support if this continues.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 7. GLOBAL: Catch-all rate limiter (DDoS protection)
export const globalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute per IP
  message: {
    message: "Too many requests. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Skip rate limiting for successful auth requests
export const skipRateLimitOnSuccess = (req, res, next) => {
  const originalJson = res.json;
  res.json = function (data) {
    // If response is successful (200-299), skip rate limiting
    if (res.statusCode >= 200 && res.statusCode < 300) {
      req.skipRateLimit = true;
    }
    return originalJson.call(this, data);
  };
  next();
};
