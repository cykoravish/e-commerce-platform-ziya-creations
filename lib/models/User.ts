import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'customer' | 'admin' | 'super_admin';
  isVerified: boolean;
  avatar?: string;
  addresses: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['customer', 'admin', 'super_admin'], default: 'customer' },
    isVerified: { type: Boolean, default: false },
    avatar: { type: String },
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
