import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `Ziya Creations <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    console.log('[v0] Email sent successfully to:', options.to);
    return true;
  } catch (error) {
    console.error('[v0] Email sending failed:', error);
    return false;
  }
}

export function generateOTPEmail(otp: string, name: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Ziya Creations, ${name}!</h2>
      <p style="color: #666; font-size: 16px;">Your OTP for verification is:</p>
      <div style="background: #f0f0f0; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
        <h1 style="color: #007bff; letter-spacing: 5px; margin: 0;">${otp}</h1>
      </div>
      <p style="color: #666; font-size: 14px;">This OTP is valid for 10 minutes.</p>
      <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
    </div>
  `;
}

export function generatePasswordResetEmail(otp: string, name: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p style="color: #666;">Hi ${name},</p>
      <p style="color: #666;">We received a request to reset your password. Use the OTP below to proceed:</p>
      <div style="background: #f0f0f0; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
        <h1 style="color: #007bff; letter-spacing: 5px; margin: 0;">${otp}</h1>
      </div>
      <p style="color: #666; font-size: 14px;">This OTP is valid for 10 minutes.</p>
      <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email or contact support immediately.</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">Ziya Creations Security Team</p>
    </div>
  `;
}

export function generateOrderConfirmationEmail(
  orderData: any,
  customerName: string
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Order Confirmation</h2>
      <p style="color: #666;">Hi ${customerName},</p>
      <p style="color: #666;">Thank you for your order! Here are the details:</p>
      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Order ID:</strong> ${orderData.orderId}</p>
        <p><strong>Total Amount:</strong> ₹${orderData.total}</p>
        <p><strong>Status:</strong> ${orderData.status}</p>
      </div>
      <p style="color: #666; font-size: 14px;">We will notify you once your order is shipped.</p>
    </div>
  `;
}
