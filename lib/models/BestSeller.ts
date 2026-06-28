import mongoose from 'mongoose';

export interface IBestSeller extends mongoose.Document {
  productId: mongoose.Types.ObjectId;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const bestSellerSchema = new mongoose.Schema<IBestSeller>(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      unique: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.BestSeller ||
  mongoose.model<IBestSeller>('BestSeller', bestSellerSchema);
