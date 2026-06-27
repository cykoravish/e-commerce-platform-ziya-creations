import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import { verifyAuth, createResponse, createErrorResponse } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);

    if (!auth || (auth.role !== 'admin' && auth.role !== 'super_admin')) {
      return createErrorResponse('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const body = await request.json();
    const { name, description, price, discountedPrice, category, stock, sku, images } = body;

    // Validation
    if (!name || !description || !price || !category || !sku) {
      return createErrorResponse('Required fields missing', 400, 'VALIDATION_ERROR');
    }

    await connectDB();

    // Check if category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return createErrorResponse('Category not found', 404, 'NOT_FOUND');
    }

    // Check if SKU already exists
    const existingSku = await Product.findOne({ sku });
    if (existingSku) {
      return createErrorResponse('SKU already exists', 409, 'SKU_EXISTS');
    }

    // Create slug
    let slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    // Check if slug already exists and append number if needed
    let originalSlug = slug;
    let counter = 1;
    let slugExists = await Product.findOne({ slug });
    
    while (slugExists) {
      slug = `${originalSlug}-${counter}`;
      slugExists = await Product.findOne({ slug });
      counter++;
    }

    // Create product
    const product = new Product({
      name,
      slug,
      description,
      price,
      discountedPrice: discountedPrice || null,
      category,
      stock: stock || 0,
      sku,
      images: images || [],
      isActive: true,
      createdBy: auth.userId,
    });

    await product.save();

    return createResponse(product, 'Product created successfully', 201, 'CREATED');
  } catch (error) {
    console.error('[v0] Create product error:', error);
    return createErrorResponse('Failed to create product', 500, 'SERVER_ERROR');
  }
}
