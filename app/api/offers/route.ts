import { NextRequest, NextResponse } from 'next/server';
import { OfferService, OfferInput } from '@/lib/models/Offer';

// Check if user is superadmin (you'll need to add proper auth)
const isSuperAdmin = (request: NextRequest): boolean => {
  const token = request.headers.get('authorization')?.split('Bearer ')[1];
  // TODO: Validate token and check if user is superadmin
  // For now, we'll trust the client (you should add proper auth)
  return true;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const offers = activeOnly
      ? OfferService.getActiveOffers()
      : OfferService.getAllOffers();

    return NextResponse.json(
      {
        statusCode: 'SUCCESS',
        data: offers,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        statusCode: 'ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch offers',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSuperAdmin(request)) {
      return NextResponse.json(
        {
          statusCode: 'UNAUTHORIZED',
          message: 'Only superadmin can create offers',
        },
        { status: 403 }
      );
    }

    const data: OfferInput = await request.json();

    // Validation
    if (!data.title || !data.description || !data.discount) {
      return NextResponse.json(
        {
          statusCode: 'VALIDATION_ERROR',
          message: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    const offer = OfferService.createOffer(data);

    return NextResponse.json(
      {
        statusCode: 'SUCCESS',
        data: offer,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        statusCode: 'ERROR',
        message: error instanceof Error ? error.message : 'Failed to create offer',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isSuperAdmin(request)) {
      return NextResponse.json(
        {
          statusCode: 'UNAUTHORIZED',
          message: 'Only superadmin can update offers',
        },
        { status: 403 }
      );
    }

    const { id, ...data } = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          statusCode: 'VALIDATION_ERROR',
          message: 'Offer ID is required',
        },
        { status: 400 }
      );
    }

    const offer = OfferService.updateOffer(id, data);

    if (!offer) {
      return NextResponse.json(
        {
          statusCode: 'NOT_FOUND',
          message: 'Offer not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        statusCode: 'SUCCESS',
        data: offer,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        statusCode: 'ERROR',
        message: error instanceof Error ? error.message : 'Failed to update offer',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isSuperAdmin(request)) {
      return NextResponse.json(
        {
          statusCode: 'UNAUTHORIZED',
          message: 'Only superadmin can delete offers',
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          statusCode: 'VALIDATION_ERROR',
          message: 'Offer ID is required',
        },
        { status: 400 }
      );
    }

    const success = OfferService.deleteOffer(id);

    if (!success) {
      return NextResponse.json(
        {
          statusCode: 'NOT_FOUND',
          message: 'Offer not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        statusCode: 'SUCCESS',
        message: 'Offer deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        statusCode: 'ERROR',
        message: error instanceof Error ? error.message : 'Failed to delete offer',
      },
      { status: 500 }
    );
  }
}
