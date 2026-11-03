import type { Prisma } from '@prisma/client';
import { hasDatabaseUrl } from '@/lib/databaseUrl';

export type DbIssueCode = 'MISSING_URL' | 'CONNECTION' | 'SCHEMA_OUTDATED' | 'TABLES_MISSING' | 'UNKNOWN';

export interface DbIssue {
  code: DbIssueCode;
  message: string;
  action: string;
}

const SCHEMA_HINT =
  'Databáza ešte nemá nové stĺpce pre blog (slug, content, video, koncepty). V termináli alebo vo Vercel CLI spustite: npx prisma db push';

export function parseDbError(error: unknown): DbIssue {
  if (!hasDatabaseUrl()) {
    return {
      code: 'MISSING_URL',
      message: 'Chýba premenná DATABASE_URL.',
      action: 'Vo Verceli → Settings → Environment Variables pridajte DATABASE_URL (PostgreSQL) a znova nasaďte projekt.',
    };
  }

  const err = error as Prisma.PrismaClientKnownRequestError & { message?: string };
  const message = err.message ?? String(error);

  if (err.code === 'P2021') {
    return {
      code: 'TABLES_MISSING',
      message: 'Tabuľky v databáze ešte neexistujú.',
      action: 'Spustite: npx prisma db push (s production DATABASE_URL alebo lokálne s .env).',
    };
  }

  if (
    err.code === 'P2022' ||
    /column `.+` does not exist/i.test(message) ||
    /Unknown column/i.test(message) ||
    /published/.test(message) && /does not exist/i.test(message)
  ) {
    return {
      code: 'SCHEMA_OUTDATED',
      message: SCHEMA_HINT,
      action: 'Po úspešnom prisma db push obnovte stránku administrácie.',
    };
  }

  if (/Can't reach database|ECONNREFUSED|connection|timeout/i.test(message)) {
    return {
      code: 'CONNECTION',
      message: 'Nepodarilo sa pripojiť k databáze.',
      action: 'Skontrolujte DATABASE_URL, či je databáza online a či Vercel má prístup (napr. Neon/Vercel Postgres).',
    };
  }

  return {
    code: 'UNKNOWN',
    message: message.slice(0, 200),
    action: 'Skontrolujte DATABASE_URL a spustite npx prisma db push.',
  };
}

export function apiErrorPayload(error: unknown, fallback: string) {
  const issue = parseDbError(error);
  return {
    error: issue.code === 'SCHEMA_OUTDATED' ? issue.message : fallback,
    code: issue.code,
    action: issue.action,
  };
}
