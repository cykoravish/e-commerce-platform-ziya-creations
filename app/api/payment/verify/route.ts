import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await request.json();

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { statusCode: 'FAILED', message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify Razorpay signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '');
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return NextResponse.json(
        { statusCode: 'FAILED', message: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Fetch order details from your database (you'll need to implement this)
    // For now, we'll send WhatsApp notification with available info
    const whatsappMessage = `Order Confirmed! 🎉

Order ID: ${orderId}
Payment ID: ${razorpayPaymentId}
Amount: Successfully Charged

Thank you for your purchase!

View your order details in the Ziya Creations app.`;

    try {
      // Send WhatsApp message using a WhatsApp API (e.g., Twilio, WhatsApp Business API)
      // This is a sample implementation - adjust based on your WhatsApp provider
      if (process.env.WHATSAPP_API_URL) {
        await axios.post(process.env.WHATSAPP_API_URL, {
          to: '919472842179', // WhatsApp number
          message: whatsappMessage,
        });
      }
    } catch (whatsappError) {
      console.error('[v0] WhatsApp notification error:', whatsappError);
      // Don't fail the payment if WhatsApp notification fails
    }

    // Update order status in database to 'paid'
    // This should be done in your backend order service
    try {
      // Mark order as paid in database
      // await updateOrderPaymentStatus(orderId, 'paid', razorpayPaymentId);
    } catch (dbError) {
      console.error('[v0] Database update error:', dbError);
    }

    return NextResponse.json(
      {
        statusCode: 'SUCCESS',
        message: 'Payment verified successfully',
        data: {
          orderId,
          razorpayPaymentId,
          status: 'paid',
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[v0] Payment verification error:', error);
    return NextResponse.json(
      {
        statusCode: 'FAILED',
        message: error.message || 'Failed to verify payment',
      },
      { status: 500 }
    );
  }
}
