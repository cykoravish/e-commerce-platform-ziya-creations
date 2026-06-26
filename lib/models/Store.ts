import mongoose from 'mongoose';

export interface IStore extends mongoose.Document {
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  image?: string;
  latitude: number;
  longitude: number;
  openingTime: string;
  closingTime: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new mongoose.Schema<IStore>(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    openingTime: { type: String, default: '10:00' },
    closingTime: { type: String, default: '22:00' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Store || mongoose.model<IStore>('Store', storeSchema);
