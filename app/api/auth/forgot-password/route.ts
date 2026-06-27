import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { NextRequest, NextResponse } from 'next/server';

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { statusCode: 'VALIDATION_ERROR', message: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { statusCode: 'NOT_FOUND', message: 'User not found' },
        { status: 404 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to user (in production, use proper encryption)
    user.resetOTP = otp;
    user.resetOTPExpiry = otpExpiry;
    await user.save();

    // TODO: Send OTP via email (integrate with email service)
    console.log(`[v0] OTP for ${email}: ${otp}`);

    return NextResponse.json(
      {
        statusCode: 'SUCCESS',
        message: 'OTP sent to your email',
        data: { email }, // In production, don't return OTP
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Forgot password error:', error);
    return NextResponse.json(
      { statusCode: 'SERVER_ERROR', message: 'Failed to process forgot password' },
      { status: 500 }
    );
  }
}
