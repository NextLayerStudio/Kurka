import { NextResponse } from 'next/server';
import { getDatabaseStatus } from '@/lib/prisma';
import { hasDatabaseUrl } from '@/lib/databaseUrl';

export async function GET() {
  const status = await getDatabaseStatus();

  return NextResponse.json({
    status: status.connected && status.schemaReady !== false ? 'ok' : 'error',
    database: status.connected ? 'connected' : 'disconnected',
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'unknown',
    databaseUrl: hasDatabaseUrl() ? 'configured' : 'missing',
    ...status,
  });
}
