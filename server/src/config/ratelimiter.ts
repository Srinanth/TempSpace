import rateLimit from "express-rate-limit";

export const createSpaceLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: "Slow down creating spaces." }
});

export const uploadLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 10,
  message: { error: "Too many uploads." }
});

export const globalLimiter = rateLimit({
  windowMs: 15 * 1000,
  max: 50,
  message: { error: "Too many requests." }
});
