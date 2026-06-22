import { connectDB } from '@/lib/db';
import Category from '@/lib/models/Category';
import { createResponse, createErrorResponse } from '@/lib/auth';
import { NextRequest } from 'next/server';

// Get all active categories
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    
    return createResponse(categories, 'Categories fetched successfully', 200, 'SUCCESS');
  } catch (error) {
    console.error('[v0] Get categories error:', error);
    return createErrorResponse('Failed to fetch categories', 500, 'SERVER_ERROR');
  }
}
