import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import { verifyAuth, createResponse, createErrorResponse } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);

    if (!auth || auth.role !== 'super_admin') {
      return createErrorResponse('Only super admin can perform this action', 403, 'FORBIDDEN');
    }

    await connectDB();

    const products = await Product.find({});
    let fixed = 0;

    for (const product of products) {
      const newSlug = product.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

      if (newSlug !== product.slug) {
        product.slug = newSlug;
        await product.save();
        fixed++;
      }
    }

    return createResponse(
      { fixed, total: products.length },
      `Fixed ${fixed} product slugs`,
      200,
      'SUCCESS'
    );
  } catch (error) {
    console.error('[v0] Fix slugs error:', error);
    return createErrorResponse('Failed to fix slugs', 500, 'SERVER_ERROR');
  }
}
