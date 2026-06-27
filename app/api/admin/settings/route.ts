import { connectDB } from '@/lib/db';
import Settings from '@/lib/models/Settings';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if not exist
      const defaultSettings = new Settings({
        taxEnabled: true,
        taxPercentage: 18,
        codAdvanceAmount: 500,
      });
      await defaultSettings.save();
      return NextResponse.json(
        { statusCode: 'SUCCESS', data: defaultSettings },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { statusCode: 'SUCCESS', data: settings },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Get settings error:', error);
    return NextResponse.json(
      { statusCode: 'SERVER_ERROR', message: 'Failed to get settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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

    // Verify super admin
    const User = require('@/lib/models/User').default;
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json(
        { statusCode: 'FORBIDDEN', message: 'Only Super Admin can update settings' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { taxEnabled, taxPercentage, codAdvanceAmount } = body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    if (taxEnabled !== undefined) settings.taxEnabled = taxEnabled;
    if (taxPercentage !== undefined) settings.taxPercentage = taxPercentage;
    if (codAdvanceAmount !== undefined) settings.codAdvanceAmount = codAdvanceAmount;

    await settings.save();

    return NextResponse.json(
      { statusCode: 'SUCCESS', message: 'Settings updated', data: settings },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Update settings error:', error);
    return NextResponse.json(
      { statusCode: 'SERVER_ERROR', message: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
