import { RateLimiterMongo } from 'rate-limiter-flexible';
import mongoose from 'mongoose';
import type { Request, Response, NextFunction } from 'express';

/**
 * Creates a MongoDB-backed rate limiter middleware.
 * @param points - Maximum requests allowed within the duration.
 * @param duration - Window in seconds.
 * @param keyPrefix - Unique namespace for this limiter's store collection.
 */
function createRateLimiter(
  points: number,
  duration: number,
  keyPrefix: string,
) {
  const limiter = new RateLimiterMongo({
    storeClient: mongoose.connection,
    points,
    duration,
    keyPrefix,
  });

  return async function rateLimitMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await limiter.consume(req.ip ?? 'unknown');
      next();
    } catch {
      res.status(429).json({ success: false, error: { message: 'Too many requests — try again later' } });
    }
  };
}

/** Rate limiter for POST /api/auth/login — 10 attempts per 15 minutes. */
export const loginRateLimiter = createRateLimiter(10, 15 * 60, 'login');

/** Rate limiter for public POST /api/leads — 20 submissions per 10 minutes. */
export const leadsRateLimiter = createRateLimiter(20, 10 * 60, 'leads_post');
