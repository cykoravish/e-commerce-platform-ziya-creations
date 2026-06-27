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

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    const query: any = { user: auth.userId };
    
    // Filter by orderId if provided
    if (orderId) {
      query.orderId = orderId;
    }

    // If regular user/admin, only show orders containing their uploaded products
    if (auth.role !== 'super_admin') {
      const Product = require('@/lib/models/Product').default;
      const userProducts = await Product.find({ createdBy: auth.userId }).select('_id');
      const productIds = userProducts.map((p: any) => p._id);
      
      if (productIds.length > 0) {
        query['items.product'] = { $in: productIds };
      } else {
        // User has no products, return empty array
        return createResponse([], 'Orders fetched successfully', 200, 'SUCCESS');
      }
    }

    const orders = await Order.find(query)
      .populate('items.product', 'name price images')
      .sort('-createdAt');

    return createResponse(orders, 'Orders fetched successfully', 200, 'SUCCESS');
  } catch (error) {
    console.error('[v0] Get user orders error:', error);
    return createErrorResponse('Failed to fetch orders', 500, 'SERVER_ERROR');
  }
}
