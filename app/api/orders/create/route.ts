import { connectDB } from '@/lib/db';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';
import Product from '@/lib/models/Product';
import { verifyAuth, createResponse, createErrorResponse } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return createErrorResponse('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const body = await request.json();
    const { items, address, coupon, discountAmount, taxAmount, taxEnabled } = body;

    if (!items || items.length === 0 || !address) {
      return createErrorResponse('Missing required fields', 400, 'VALIDATION_ERROR');
    }

    await connectDB();

    // Verify user exists
    const user = await User.findById(auth.userId);
    if (!user) {
      return createErrorResponse('User not found', 404, 'NOT_FOUND');
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return createErrorResponse(`Product ${item.productId} not found`, 404, 'NOT_FOUND');
      }

      if (product.stock < item.quantity) {
        return createErrorResponse(
          `Insufficient stock for ${product.name}`,
          400,
          'INSUFFICIENT_STOCK'
        );
      }

      const price = product.discountedPrice || product.price;
      subtotal += price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price,
      });

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Generate order ID
    const orderId = `ZC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calculate discount and tax
    const discount = discountAmount || 0;
    const tax = taxEnabled ? (taxAmount || 0) : 0;
    const total = subtotal - discount + tax;

    // Create order
    const order = new Order({
      orderId,
      user: auth.userId,
      items: orderItems,
      address,
      coupon: coupon || undefined,
      subtotal,
      discount,
      tax,
      shipping: 0,
      total: Math.max(0, total),
      paymentMethod: 'razorpay',
      paymentStatus: 'pending',
    });

    await order.save();

    return createResponse(
      { order, razorpayOrderId: orderId },
      'Order created successfully',
      201,
      'CREATED'
    );
  } catch (error) {
    console.error('[v0] Create order error:', error);
    return createErrorResponse('Failed to create order', 500, 'SERVER_ERROR');
  }
}
