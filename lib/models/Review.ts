import mongoose from 'mongoose';

export interface IReview extends mongoose.Document {
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  userName?: string;
  userImage?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  isApproved: boolean;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new mongoose.Schema<IReview>(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    userName: { type: String },
    userImage: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    comment: { type: String, required: true },
    images: [{ type: String }],
    helpful: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ isApproved: 1 });

export default mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);
