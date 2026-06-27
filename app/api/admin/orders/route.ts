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

    // Build query based on admin role
    const query: any = {};
    
    // Super admin sees all orders, regular admin sees only their product's orders
    if (auth.role !== 'super_admin') {
      const Product = require('@/lib/models/Product').default;
      // Use auth.userId (from JWT) for security
      const adminProducts = await Product.find({ createdBy: auth.userId }).select('_id');
      const productIds = adminProducts.map((p: any) => p._id);
      
      if (productIds.length > 0) {
        // Find orders containing these products
        query['items.product'] = { $in: productIds };
      } else {
        // No products created by this admin, return empty array
        return createResponse([], 'Orders fetched successfully', 200, 'SUCCESS');
      }
    }

    const orders = await Order.find(query)
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
