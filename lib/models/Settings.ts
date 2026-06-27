import mongoose from 'mongoose';

export interface ISettings extends mongoose.Document {
  taxEnabled: boolean;
  taxPercentage: number;
  codAdvanceAmount: number;
  couponCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new mongoose.Schema<ISettings>(
  {
    taxEnabled: { type: Boolean, default: true },
    taxPercentage: { type: Number, default: 18 },
    codAdvanceAmount: { type: Number, default: 500 },
    couponCode: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', settingsSchema);
