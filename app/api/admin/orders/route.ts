import { connectDB } from '@/lib/db';
import Order from '@/lib/models/Order';
import { verifyAuth, createResponse, createErrorResponse } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return createErrorResponse('Unauthorized', 401, 'UNAUTHORIZED');
    }

    await connectDB();

    const orders = await Order.find({})
      .populate('user', 'name email phone')
      .populate('items.product', 'name price images')
      .sort('-createdAt')
      .exec();

    return createResponse(orders, 'Orders fetched successfully', 200, 'SUCCESS');
  } catch (error) {
    console.error('[v0] Get admin orders error:', error);
    return createErrorResponse('Failed to fetch orders', 500, 'SERVER_ERROR');
  }
}
