import { connectDB } from '@/lib/db';
import BestSeller from '@/lib/models/BestSeller';
import Product from '@/lib/models/Product';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

function createResponse(data: any, message: string, statusCode: number, code: string) {
  return NextResponse.json(
    { statusCode: code, message, data },
    { status: statusCode }
  );
}

// GET all best sellers
export async function GET() {
  try {
    await connectDB();
    const bestSellers = await BestSeller.find()
      .populate('productId', 'name price discountedPrice images slug')
      .sort('displayOrder');

    return createResponse(bestSellers, 'Best sellers fetched', 200, 'SUCCESS');
  } catch (error) {
    console.error('[v0] Fetch best sellers error:', error);
    return createResponse(null, 'Failed to fetch best sellers', 500, 'ERROR');
  }
}

// POST - Add product to best sellers
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return createResponse(null, 'Unauthorized', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'super_admin') {
      return createResponse(null, 'Only superadmin can manage best sellers', 403, 'FORBIDDEN');
    }

    await connectDB();

    const { productId } = await request.json();

    if (!productId) {
      return createResponse(null, 'Product ID is required', 400, 'VALIDATION_ERROR');
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return createResponse(null, 'Product not found', 404, 'NOT_FOUND');
    }

    // Check if already in best sellers
    const existing = await BestSeller.findOne({ productId });
    if (existing) {
      return createResponse(null, 'Product already in best sellers', 400, 'DUPLICATE');
    }

    // Get the next display order
    const lastBestSeller = await BestSeller.findOne().sort('-displayOrder');
    const displayOrder = (lastBestSeller?.displayOrder || 0) + 1;

    const bestSeller = new BestSeller({
      productId,
      displayOrder,
    });

    await bestSeller.save();
    await bestSeller.populate('productId', 'name price discountedPrice images slug');

    return createResponse(bestSeller, 'Product added to best sellers', 201, 'SUCCESS');
  } catch (error) {
    console.error('[v0] Add best seller error:', error);
    return createResponse(null, 'Failed to add best seller', 500, 'ERROR');
  }
}

// DELETE - Remove from best sellers
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return createResponse(null, 'Unauthorized', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'super_admin') {
      return createResponse(null, 'Only superadmin can manage best sellers', 403, 'FORBIDDEN');
    }

    await connectDB();

    const { productId } = await request.json();

    if (!productId) {
      return createResponse(null, 'Product ID is required', 400, 'VALIDATION_ERROR');
    }

    const deleted = await BestSeller.findOneAndDelete({ productId });

    if (!deleted) {
      return createResponse(null, 'Best seller not found', 404, 'NOT_FOUND');
    }

    return createResponse(null, 'Removed from best sellers', 200, 'SUCCESS');
  } catch (error) {
    console.error('[v0] Delete best seller error:', error);
    return createResponse(null, 'Failed to delete best seller', 500, 'ERROR');
  }
}
