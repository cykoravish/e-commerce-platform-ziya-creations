import mongoose from 'mongoose';

export interface IShipLocation extends mongoose.Document {
  name: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  shipRocketAPIKey: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const shipLocationSchema = new mongoose.Schema<IShipLocation>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    shipRocketAPIKey: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

shipLocationSchema.index({ city: 1 });
shipLocationSchema.index({ isActive: 1 });

export default mongoose.models.ShipLocation || mongoose.model<IShipLocation>('ShipLocation', shipLocationSchema);
