import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { hashPassword } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password, name, phone } = await req.json();
    const token = req.headers.get('authorization')?.split('Bearer ')[1];

    // Verify super admin token
    if (!token) {
      return NextResponse.json(
        { statusCode: 'ERROR', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify admin is super admin
    const adminToken = await User.findOne({ _id: token }).select('+password');
    if (!adminToken || adminToken.role !== 'super_admin') {
      return NextResponse.json(
        { statusCode: 'ERROR', message: 'Only Super Admin can create admins' },
        { status: 403 }
      );
    }

    // Validate inputs
    if (!email || !password || !name) {
      return NextResponse.json(
        { statusCode: 'ERROR', message: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { statusCode: 'ERROR', message: 'Admin with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin user
    const newAdmin = new User({
      email,
      password: hashedPassword,
      name,
      phone: phone || '',
      role: 'admin',
      isEmailVerified: true,
    });

    await newAdmin.save();

    return NextResponse.json(
      {
        statusCode: 'SUCCESS',
        message: 'Admin created successfully',
        data: {
          id: newAdmin._id,
          email: newAdmin.email,
          name: newAdmin.name,
          role: newAdmin.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Create admin error:', error);
    return NextResponse.json(
      { statusCode: 'ERROR', message: 'Failed to create admin' },
      { status: 500 }
    );
  }
}

// GET all admins (Super Admin only)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.headers.get('authorization')?.split('Bearer ')[1];

    // Verify super admin
    if (!token) {
      return NextResponse.json(
        { statusCode: 'ERROR', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const superAdmin = await User.findById(token);
    if (!superAdmin || superAdmin.role !== 'super_admin') {
      return NextResponse.json(
        { statusCode: 'ERROR', message: 'Only Super Admin can view admins' },
        { status: 403 }
      );
    }

    // Get all admins
    const admins = await User.find({ role: 'admin' }).select('email name phone role createdAt').sort('-createdAt');

    return NextResponse.json(
      {
        statusCode: 'SUCCESS',
        data: admins,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Get admins error:', error);
    return NextResponse.json(
      { statusCode: 'ERROR', message: 'Failed to fetch admins' },
      { status: 500 }
    );
  }
}
