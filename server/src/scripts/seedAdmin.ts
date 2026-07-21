import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';

/**
 * Creates exactly one admin user from ADMIN_USERNAME / ADMIN_PASSWORD env vars.
 * Idempotent — running twice does not create a duplicate.
 */
async function seedAdmin(): Promise<void> {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error(
      'ADMIN_USERNAME and ADMIN_PASSWORD environment variables are required',
    );
  }

  await connectDB();

  const existing = await User.findOne({ username });
  if (existing) {
    console.log('Admin user already exists — skipping seed');
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({ username, passwordHash });
  console.log(`Admin user "${username}" created`);
  process.exit(0);
}

seedAdmin().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
