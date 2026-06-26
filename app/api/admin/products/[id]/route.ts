import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import { verifyAuth, createResponse, createErrorResponse } from '@/lib/auth';
import { NextRequest } from 'next/server';

// GET product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const product = await Product.findById(id).populate('category');

    if (!product) {
      return createErrorResponse('Product not found', 404, 'NOT_FOUND');
    }

    return createResponse(product, 'Product fetched successfully', 200, 'SUCCESS');
  } catch (error) {
    console.error('[v0] Get product error:', error);
    return createErrorResponse('Failed to fetch product', 500, 'SERVER_ERROR');
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await verifyAuth(request);

    if (!auth || (auth.role !== 'admin' && auth.role !== 'super_admin')) {
      return createErrorResponse('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const body = await request.json();

    await connectDB();

    // If name is being updated, regenerate slug
    if (body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }

    const product = await Product.findByIdAndUpdate(id, body, {
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await verifyAuth(request);

    if (!auth) {
      return createErrorResponse('Unauthorized', 401, 'UNAUTHORIZED');
    }

    await connectDB();

    const product = await Product.findById(id);

    if (!product) {
      return createErrorResponse('Product not found', 404, 'NOT_FOUND');
    }

    // Allow super_admin to delete any product, or admin to delete their own
    const isProductOwner = product.createdBy?.toString() === auth.id;
    const isSuperAdmin = auth.role === 'super_admin';

    if (!isSuperAdmin && !isProductOwner) {
      return createErrorResponse('You can only delete your own products', 403, 'FORBIDDEN');
    }

    await Product.findByIdAndDelete(id);

    return createResponse(null, 'Product deleted successfully', 200, 'SUCCESS');
  } catch (error) {
    console.error('[v0] Delete product error:', error);
    return createErrorResponse('Failed to delete product', 500, 'SERVER_ERROR');
  }
}
