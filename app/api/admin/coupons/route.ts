import { connectDB } from '@/lib/db';
import Coupon from '@/lib/models/Coupon';
import { verifyAuth, createResponse, createErrorResponse } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return createErrorResponse('Unauthorized', 401, 'UNAUTHORIZED');
    }

    await connectDB();

    const coupons = await Coupon.find({}).sort('-createdAt');

    return createResponse(coupons, 'Coupons fetched successfully', 200, 'SUCCESS');
  } catch (error) {
    console.error('[v0] Get admin coupons error:', error);
    return createErrorResponse('Failed to fetch coupons', 500, 'SERVER_ERROR');
  }
}
