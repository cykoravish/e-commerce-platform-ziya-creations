import { connectDB } from '@/lib/db';
import Order from '@/lib/models/Order';
import { verifyAuth, createResponse, createErrorResponse } from '@/lib/auth';
import crypto from 'crypto';
import { NextRequest } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return createErrorResponse('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const body = await request.json();
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, orderId } = body;

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return createErrorResponse('Missing payment details', 400, 'VALIDATION_ERROR');
    }

    await connectDB();

    // Verify Razorpay signature
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '');
    shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpaySignature) {
      return createErrorResponse('Invalid payment signature', 400, 'INVALID_SIGNATURE');
    }

    // Update order
    const order = await Order.findOneAndUpdate(
      { orderId },
      {
        razorpayOrderId,
        razorpayPaymentId,
        paymentStatus: 'completed',
        status: 'confirmed',
      },
      { new: true }
    );

    if (!order) {
      return createErrorResponse('Order not found', 404, 'NOT_FOUND');
    }

    // Send WhatsApp confirmation
    try {
      const userPhone = order.toString().includes('phone') ? (order as any).phone : '';
      const businessPhone = process.env.WHATSAPP_BUSINESS_PHONE;
      const whatsappApiUrl = process.env.WHATSAPP_API_URL;

      if (businessPhone && whatsappApiUrl) {
        const message = `Hi! Your order #${orderId} has been confirmed. Total: ₹${order.total.toFixed(2)}. Track your order at https://yourstore.com/track-order/${orderId}`;

        await axios.post(
          whatsappApiUrl,
          {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: businessPhone,
            type: 'text',
            text: {
              body: message,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('[v0] WhatsApp confirmation sent for order:', orderId);
      }
    } catch (whatsappErr) {
      console.error('[v0] Failed to send WhatsApp confirmation:', whatsappErr);
      // Don't fail the order if WhatsApp fails
    }

    return createResponse(order, 'Payment verified successfully', 200, 'SUCCESS');
  } catch (error) {
    console.error('[v0] Payment verification error:', error);
    return createErrorResponse('Failed to verify payment', 500, 'SERVER_ERROR');
  }
}
