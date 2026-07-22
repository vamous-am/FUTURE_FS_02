import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginSchema } from '@crm/shared';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { formatZodError } from '../lib/validation.js';

const router = Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'none' as const,
  maxAge: 12 * 60 * 60 * 1000, // 12 hours
};

/**
 * POST /api/auth/login
 * Validates credentials against the seeded admin document.
 * Issues a signed JWT in an httpOnly cookie on success.
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Invalid request body',
        details: formatZodError(result.error),
      },
    });
    return;
  }

  const { username, password } = result.data;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET environment variable is not set');

  const token = jwt.sign(
    { userId: user._id.toString(), username: user.username },
    secret,
    { expiresIn: '12h' },
  );

  res.cookie('token', token, COOKIE_OPTIONS);
  res.json({ success: true, data: { username: user.username } });
});

/**
 * GET /api/auth/me
 * Returns the authenticated user's username from the JWT cookie.
 * Used by the frontend to rehydrate auth state on page load.
 */
router.get('/me', requireAuth, (req: Request, res: Response): void => {
  const user = (req as Request & { user: { username: string } }).user;
  res.json({ success: true, data: { username: user.username } });
});

/**
 * POST /api/auth/logout
 * Clears the authentication cookie.
 */
router.post('/logout', (_req: Request, res: Response): void => {
  res.clearCookie('token', { ...COOKIE_OPTIONS, maxAge: 0 });
  res.json({ success: true, data: null });
});

export default router;
