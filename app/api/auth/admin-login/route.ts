import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { comparePassword, generateToken, createResponse, createErrorResponse } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return createErrorResponse('Email and password are required', 400, 'VALIDATION_ERROR');
    }

    await connectDB();

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.password) {
      return createErrorResponse('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // SECURITY: Only allow admin and super_admin roles
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      console.warn(`[v0] Non-admin login attempt from email: ${email}`);
      return createErrorResponse('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Compare password based on role
    let isPasswordValid = false;
    if (user.role === 'admin') {
      // Admin passwords are stored in plain text
      isPasswordValid = password === user.password;
    } else if (user.role === 'super_admin') {
      // Super admin passwords are encrypted with bcrypt
      isPasswordValid = await comparePassword(password, user.password);
    }

    if (!isPasswordValid) {
      return createErrorResponse('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return createResponse(
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      'Admin login successful',
      200,
      'SUCCESS'
    );
  } catch (error) {
    console.error('[v0] Admin login error:', error);
    return createErrorResponse('Internal server error', 500, 'SERVER_ERROR');
  }
}
