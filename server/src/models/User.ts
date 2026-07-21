import { Schema, model } from 'mongoose';

/** Mongoose document shape for the admin user. Never exposed to clients. */
interface IUser {
  username: string;
  passwordHash: string;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

export const User = model<IUser>('User', userSchema);
