import { connectDB } from '@/lib/db';
import Coupon from '@/lib/models/Coupon';
import { verifyAuth, createResponse, createErrorResponse } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return createErrorResponse('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const body = await request.json();

    await connectDB();

    const coupon = await Coupon.findByIdAndUpdate(params.id, body, { new: true });

    if (!coupon) {
      return createErrorResponse('Coupon not found', 404, 'NOT_FOUND');
    }

    return createResponse(coupon, 'Coupon updated successfully', 200, 'SUCCESS');
  } catch (error) {
    console.error('[v0] Update coupon error:', error);
    return createErrorResponse('Failed to update coupon', 500, 'SERVER_ERROR');
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return createErrorResponse('Unauthorized', 401, 'UNAUTHORIZED');
    }

    await connectDB();

    const coupon = await Coupon.findByIdAndDelete(params.id);

    if (!coupon) {
      return createErrorResponse('Coupon not found', 404, 'NOT_FOUND');
    }

    return createResponse(null, 'Coupon deleted successfully', 200, 'SUCCESS');
  } catch (error) {
    console.error('[v0] Delete coupon error:', error);
    return createErrorResponse('Failed to delete coupon', 500, 'SERVER_ERROR');
  }
}
