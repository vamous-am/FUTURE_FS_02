import mongoose from 'mongoose';

/**
 * Connects to MongoDB using the MONGODB_URI environment variable.
 * Throws if the variable is not set or the connection fails.
 */
export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI environment variable is not set');
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}
