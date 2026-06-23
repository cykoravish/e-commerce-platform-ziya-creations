import mongoose from 'mongoose';
import Category from '@/lib/models/Category';
import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import { createResponse, createErrorResponse } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  console.log("product api hit");
  try {
    await connectDB();
    console.log('Category modelName:', Category.modelName);
    console.log('Registered models:', mongoose.modelNames());
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || '-createdAt';

    const skip = (page - 1) * limit;
    const query: any = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    console.log('Before populate:', mongoose.modelNames());
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);

    return createResponse(
      {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      'Products fetched successfully',
      200,
      'SUCCESS'
    );
  } catch (error) {
    console.error('[v0] Get products error:', error);
    return createErrorResponse('Failed to fetch products', 500, 'SERVER_ERROR');
  }
}
