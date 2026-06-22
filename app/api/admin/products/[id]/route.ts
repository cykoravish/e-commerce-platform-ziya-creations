import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import { verifyAuth, createResponse, createErrorResponse } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth(request);

    if (!auth || (auth.role !== 'admin' && auth.role !== 'super_admin')) {
      return createErrorResponse('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const body = await request.json();

    await connectDB();

    const product = await Product.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return createErrorResponse('Product not found', 404, 'NOT_FOUND');
    }

    return createResponse(product, 'Product updated successfully', 200, 'SUCCESS');
  } catch (error) {
    console.error('[v0] Update product error:', error);
    return createErrorResponse('Failed to update product', 500, 'SERVER_ERROR');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth(request);

    if (!auth || auth.role !== 'super_admin') {
      return createErrorResponse('Only super admin can delete', 401, 'UNAUTHORIZED');
    }

    await connectDB();

    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return createErrorResponse('Product not found', 404, 'NOT_FOUND');
    }

    return createResponse(null, 'Product deleted successfully', 200, 'SUCCESS');
  } catch (error) {
    console.error('[v0] Delete product error:', error);
    return createErrorResponse('Failed to delete product', 500, 'SERVER_ERROR');
  }
}
