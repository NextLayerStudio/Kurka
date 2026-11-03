import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  isAdminRequest,
  isBlobConfigured,
  verifyCredentials,
} from '@/lib/adminAuth';

const failedAttempts = new Map<string, { count: number; until: number }>();

function clientKey(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    authenticated: isAdminRequest(request),
    blobEnabled: isBlobConfigured(),
  });
}

export async function POST(request: NextRequest) {
  const key = clientKey(request);
  const attempt = failedAttempts.get(key);
  if (attempt && attempt.count >= 5 && attempt.until > Date.now()) {
    return NextResponse.json(
      { error: 'Príliš veľa neúspešných pokusov. Skúste to znova o pár minút.' },
      { status: 429 }
    );
  }

  const { username = '', password = '' } = await request.json().catch(() => ({}));

  if (!verifyCredentials(String(username), String(password))) {
    const count = (attempt && attempt.until > Date.now() ? attempt.count : 0) + 1;
    failedAttempts.set(key, { count, until: Date.now() + 10 * 60 * 1000 });
    return NextResponse.json({ error: 'Nesprávne meno alebo heslo.' }, { status: 401 });
  }

  failedAttempts.delete(key);
  const response = NextResponse.json({ authenticated: true, blobEnabled: isBlobConfigured() });
  response.cookies.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}
