import mongoose from 'mongoose';

export interface IOTP extends mongoose.Document {
  email: string;
  phone: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

const otpSchema = new mongoose.Schema<IOTP>(
  {
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, expires: 600 }, // TTL: 10 minutes
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

otpSchema.index({ email: 1 });
otpSchema.index({ expiresAt: 1 });

export default mongoose.models.OTP || mongoose.model<IOTP>('OTP', otpSchema);
