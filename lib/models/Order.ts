import mongoose from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  discount?: number;
}

export interface IOrder extends mongoose.Document {
  orderId: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  address: mongoose.Types.ObjectId;
  coupon?: string;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new mongoose.Schema<IOrderItem>({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
});

const orderSchema = new mongoose.Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    coupon: { type: String },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending',
    },
    paymentMethod: { type: String, enum: ['razorpay', 'cod'], default: 'razorpay' },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ status: 1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
