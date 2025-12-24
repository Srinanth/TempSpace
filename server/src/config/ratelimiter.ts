import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, 
  max: 500,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, 
  legacyHeaders: false, 
});

export const createSpaceLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 5,
  message: 'You have created too many spaces recently, try again after 5 minutes!',
});