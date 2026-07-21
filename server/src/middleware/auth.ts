import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  username: string;
}

/**
 * Verifies the JWT from the request cookie.
 * Attaches `req.user` on success; responds 401 on failure.
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.token as string | undefined;
  if (!token) {
    res.status(401).json({ success: false, error: { message: 'Not authenticated' } });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET environment variable is not set');

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    (req as Request & { user: JwtPayload }).user = payload;
    next();
  } catch {
    res.status(401).json({ success: false, error: { message: 'Invalid or expired token' } });
  }
}
