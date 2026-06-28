import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { hashPassword } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
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

    // Send confirmation email
    await sendEmail({
      to: email,
      subject: 'Password Reset Successful - Ziya Creations',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Successful</h2>
          <p style="color: #666;">Hi ${user.name},</p>
          <p style="color: #666;">Your password has been successfully reset. You can now login with your new password.</p>
          <div style="background: #e8f5e9; padding: 15px; border-left: 4px solid #4caf50; margin: 20px 0;">
            <p style="color: #2e7d32; margin: 0;"><strong>✓ Your account is secure</strong></p>
          </div>
          <p style="color: #666; font-size: 14px;">If you didn't make this change, please contact us immediately.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">Ziya Creations Security Team</p>
        </div>
      `,
    });

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
