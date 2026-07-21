import express from 'express';

const app = express();
const PORT = process.env.PORT ?? 5001;

app.use(express.json());

/** Returns server liveness status. */
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
