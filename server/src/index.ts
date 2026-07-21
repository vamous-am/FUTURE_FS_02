import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRouter from './routes/auth.js';
import leadsRouter from './routes/leads.js';
import { loginRateLimiter, leadsRateLimiter } from './middleware/rateLimiter.js';

const app = express();
const PORT = process.env.PORT ?? 5001;

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(helmet());
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

/** Returns server liveness status. */
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth/login', loginRateLimiter);
app.use('/api/auth', authRouter);

// Rate limit only the public POST — authenticated lead endpoints use no extra limiting
app.post('/api/leads', leadsRateLimiter);
app.use('/api/leads', leadsRouter);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err: unknown) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });
