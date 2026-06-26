import { connectDB } from '@/lib/db';
import Order from '@/lib/models/Order';
import { verifyAuth, createResponse, createErrorResponse } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return createErrorResponse('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return createErrorResponse('Status is required', 400, 'INVALID_INPUT');
    }

    await connectDB();

    const order = await Order.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return createErrorResponse('Order not found', 404, 'NOT_FOUND');
    }

    return createResponse(order, 'Order updated successfully', 200, 'SUCCESS');
  } catch (error) {
    console.error('[v0] Update order error:', error);
    return createErrorResponse('Failed to update order', 500, 'SERVER_ERROR');
  }
}
