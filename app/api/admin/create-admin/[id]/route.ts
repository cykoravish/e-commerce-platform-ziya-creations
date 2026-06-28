import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

function createErrorResponse(message: string, statusCode: number, code: string) {
  return NextResponse.json(
    { statusCode: code, message, data: null },
    { status: statusCode }
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createErrorResponse('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return createErrorResponse('Invalid token', 401, 'INVALID_TOKEN');
    }

    if (decoded.role !== 'super_admin') {
      return createErrorResponse('Only superadmin can delete admins', 403, 'FORBIDDEN');
    }

    await connectDB();

    const adminId = params.id;

    // Check if admin exists
    const admin = await User.findById(adminId);
    if (!admin) {
      return createErrorResponse('Admin not found', 404, 'NOT_FOUND');
    }

    if (admin.role !== 'admin') {
      return createErrorResponse('Can only delete admin users', 400, 'INVALID_REQUEST');
    }

    // Delete the admin
    await User.findByIdAndDelete(adminId);

    return NextResponse.json(
      {
        statusCode: 'SUCCESS',
        message: 'Admin deleted successfully',
        data: null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Delete admin error:', error);
    return createErrorResponse('Failed to delete admin', 500, 'SERVER_ERROR');
  }
}
