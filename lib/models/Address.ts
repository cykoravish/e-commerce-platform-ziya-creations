import mongoose from 'mongoose';

export interface IAddress extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new mongoose.Schema<IAddress>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    isDefault: { type: Boolean, default: false },
    type: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
  },
  { timestamps: true }
);

addressSchema.index({ user: 1 });

export default mongoose.models.Address || mongoose.model<IAddress>('Address', addressSchema);
