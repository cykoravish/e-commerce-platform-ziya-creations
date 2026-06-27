import { connectDB } from '@/lib/db';
import ShipLocation from '@/lib/models/ShipLocation';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json(
        { statusCode: 'UNAUTHORIZED', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { statusCode: 'UNAUTHORIZED', message: 'Invalid token' },
        { status: 401 }
      );
    }

    const User = require('@/lib/models/User').default;
    const user = await User.findById(decoded.userId);
    if (!user || (user.role !== 'super_admin' && user.role !== 'admin')) {
      return NextResponse.json(
        { statusCode: 'FORBIDDEN', message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, address, city, pincode, phone, shipRocketAPIKey, isActive } = body;

    const location = await ShipLocation.findByIdAndUpdate(
      params.id,
      {
        name,
        address,
        city,
        pincode,
        phone,
        shipRocketAPIKey,
        isActive,
      },
      { new: true }
    );

    if (!location) {
      return NextResponse.json(
        { statusCode: 'NOT_FOUND', message: 'Location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { statusCode: 'SUCCESS', message: 'Location updated', data: location },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Update ship location error:', error);
    return NextResponse.json(
      { statusCode: 'SERVER_ERROR', message: 'Failed to update location' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json(
        { statusCode: 'UNAUTHORIZED', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { statusCode: 'UNAUTHORIZED', message: 'Invalid token' },
        { status: 401 }
      );
    }

    const User = require('@/lib/models/User').default;
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json(
        { statusCode: 'FORBIDDEN', message: 'Only super admin can delete' },
        { status: 403 }
      );
    }

    const location = await ShipLocation.findByIdAndDelete(params.id);

    if (!location) {
      return NextResponse.json(
        { statusCode: 'NOT_FOUND', message: 'Location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { statusCode: 'SUCCESS', message: 'Location deleted', data: location },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Delete ship location error:', error);
    return NextResponse.json(
      { statusCode: 'SERVER_ERROR', message: 'Failed to delete location' },
      { status: 500 }
    );
  }
}
