import { NextRequest, NextResponse } from 'next/server';

export function corsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function handleCorsPreFlight(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    return corsHeaders(new NextResponse(null, { status: 200 }));
  }
  return null;
}
