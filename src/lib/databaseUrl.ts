/** Next.js loads `.env.local`; Prisma CLI only reads `.env` unless wrapped with dotenv-cli. */
export function resolveDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL ??
    undefined
  );
}

export function hasDatabaseUrl(): boolean {
  return Boolean(resolveDatabaseUrl());
}
