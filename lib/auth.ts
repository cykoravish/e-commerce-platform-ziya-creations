import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'customer' | 'admin' | 'super_admin';
  iat?: number;
  exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10');

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

// Compare password
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate JWT token
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('[v0] Token verification failed:', error);
    return null;
  }
}

// Get token from request headers
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

// Middleware to verify auth
export async function verifyAuth(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

// Generate OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create API Response
export function createResponse(
  data: any = null,
  message: string = 'Success',
  status: number = 200,
  statusCode: string = 'SUCCESS'
) {
  return NextResponse.json(
    {
      statusCode,
      message,
      data,
    },
    { status }
  );
}

// Create error response
export function createErrorResponse(
  message: string = 'Error',
  status: number = 400,
  statusCode: string = 'ERROR'
) {
  return NextResponse.json(
    {
      statusCode,
      message,
      data: null,
    },
    { status }
  );
}
