import { Schema, Types } from 'mongoose';
import mongoose from 'mongoose';

interface ISession {
  user: Types.ObjectId;
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    valid: {
      type: Boolean,
      default: true,
    },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  }
);

const SessionModel = mongoose.model<ISession>('Session', sessionSchema);

export default SessionModel;
