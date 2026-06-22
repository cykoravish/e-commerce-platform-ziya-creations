import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: mongoose.Types.ObjectId;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  sku: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountedPrice: { type: Number, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    sku: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ sku: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
