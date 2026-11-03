import crypto from 'crypto';
import type { NextRequest } from 'next/server';
import { isBlobStorageConfigured } from '@/lib/blobEnv';

export const ADMIN_COOKIE = 'mk_admin_session';
export const SESSION_MAX_AGE = 60 * 60 * 12;

// Fallback credentials (SHA-256) used until ADMIN_USERNAME / ADMIN_PASSWORD are set on Vercel.
const FALLBACK_USERNAME_HASH = '9f239379a414e668f36ac7dcd40b39f000d8aca553ae077c0077d869124a0922';
const FALLBACK_PASSWORD_HASH = '305520419fe6dc28f23d782064c1f65c73877f0b615118cd1ed9a200dd343efb';

const processSecret = crypto.randomBytes(32).toString('hex');

function sessionSecret(): string {
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET;
  // The secret must never be derivable from the (public) source code.
  if (process.env.DATABASE_URL) {
    return crypto.createHash('sha256').update(`mk-admin:${process.env.DATABASE_URL}`).digest('hex');
  }
  return processSecret;
}

const sha256 = (value: string) => crypto.createHash('sha256').update(value).digest('hex');

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

export function verifyCredentials(username: string, password: string): boolean {
  const user = username.trim();
  const envUser = process.env.ADMIN_USERNAME;
  const envPassword = process.env.ADMIN_PASSWORD;

  if (envUser && envPassword) {
    return safeEqual(sha256(user), sha256(envUser)) && safeEqual(sha256(password), sha256(envPassword));
  }
  return safeEqual(sha256(user), FALLBACK_USERNAME_HASH) && safeEqual(sha256(password), FALLBACK_PASSWORD_HASH);
}

const sign = (payload: string) =>
  crypto.createHmac('sha256', sessionSecret()).update(payload).digest('base64url');

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `admin.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return false;

  const payload = token.slice(0, lastDot);
  const signature = token.slice(lastDot + 1);
  if (!safeEqual(signature, sign(payload))) return false;

  const expiresAt = Number(payload.split('.')[1]);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export function isAdminRequest(request: NextRequest): boolean {
  return isValidSessionToken(request.cookies.get(ADMIN_COOKIE)?.value);
}

export const isBlobConfigured = () => isBlobStorageConfigured();
