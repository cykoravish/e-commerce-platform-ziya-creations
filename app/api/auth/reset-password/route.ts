import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { hashPassword } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { statusCode: 'VALIDATION_ERROR', message: 'Email, OTP, and new password are required' },
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

    // Verify OTP
    if (user.resetOTP !== otp) {
      return NextResponse.json(
        { statusCode: 'INVALID_OTP', message: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Check OTP expiry
    if (!user.resetOTPExpiry || new Date() > new Date(user.resetOTPExpiry)) {
      return NextResponse.json(
        { statusCode: 'OTP_EXPIRED', message: 'OTP has expired' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password and clear OTP
    user.password = hashedPassword;
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    await user.save();

    return NextResponse.json(
      {
        statusCode: 'SUCCESS',
        message: 'Password reset successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Reset password error:', error);
    return NextResponse.json(
      { statusCode: 'SERVER_ERROR', message: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
