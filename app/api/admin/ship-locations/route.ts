import { connectDB } from '@/lib/db';
import ShipLocation from '@/lib/models/ShipLocation';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const locations = await ShipLocation.find().sort('-createdAt');

    return NextResponse.json(
      { statusCode: 'SUCCESS', data: locations },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Get ship locations error:', error);
    return NextResponse.json(
      { statusCode: 'SERVER_ERROR', message: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const { name, address, city, pincode, phone, shipRocketAPIKey, isActive } = await req.json();

    if (!name || !address || !city || !pincode || !phone || !shipRocketAPIKey) {
      return NextResponse.json(
        { statusCode: 'VALIDATION_ERROR', message: 'All fields are required' },
        { status: 400 }
      );
    }

    const location = new ShipLocation({
      name,
      address,
      city,
      pincode,
      phone,
      shipRocketAPIKey,
      isActive: isActive !== undefined ? isActive : true,
    });

    await location.save();

    return NextResponse.json(
      { statusCode: 'SUCCESS', message: 'Location added', data: location },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Create ship location error:', error);
    return NextResponse.json(
      { statusCode: 'SERVER_ERROR', message: 'Failed to create location' },
      { status: 500 }
    );
  }
}
