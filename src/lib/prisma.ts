import { PrismaClient } from '@prisma/client'
import { hasDatabaseUrl, resolveDatabaseUrl } from '@/lib/databaseUrl'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

if (!hasDatabaseUrl()) {
  console.error('❌ DATABASE_URL is not set!')
  console.error('Add DATABASE_URL to .env.local (local) or Vercel environment variables (production).')
}

const datasourceUrl = resolveDatabaseUrl()

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(datasourceUrl ? { datasources: { db: { url: datasourceUrl } } } : {}),
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Test database connection
export async function testConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

// Helper to check database status
export async function getDatabaseStatus() {
  try {
    if (!hasDatabaseUrl()) {
      return {
        connected: false,
        schemaReady: false,
        error: 'DATABASE_URL not configured',
        suggestion:
          'Add DATABASE_URL to .env.local (local dev) or Vercel → Environment Variables, then restart dev server / redeploy.',
        code: 'MISSING_URL' as const,
      };
    }

    await prisma.$connect();

    const formCount = await prisma.formSubmission.count();
    const contactCount = await prisma.contactSubmission.count();

    let blogCount = 0;
    let schemaReady = true;
    let schemaError: string | undefined;

    try {
      blogCount = await prisma.blogPost.count();
      // Verify new blog columns exist (older DBs only had title, description, url, imageUrl).
      await prisma.blogPost.findFirst({
        select: { id: true, slug: true, content: true, videoUrl: true, published: true },
      });
    } catch (blogError) {
      schemaReady = false;
      schemaError =
        'Blog tabuľka potrebuje aktualizáciu (slug, content, videoUrl, published). Spustite: npx prisma db push';
      try {
        const rows = await prisma.$queryRaw<{ count: bigint }[]>`SELECT COUNT(*)::bigint AS count FROM blog_posts`;
        blogCount = Number(rows[0]?.count ?? 0);
      } catch {
        blogCount = 0;
      }
    }

    return {
      connected: true,
      schemaReady,
      schemaError,
      tables: {
        blogPosts: blogCount,
        formSubmissions: formCount,
        contactSubmissions: contactCount,
      },
    };
  } catch (error) {
    console.error('Database status check failed:', error);

    const err = error as { message?: string; code?: string };
    if (err.message?.includes('does not exist') || err.code === 'P2021') {
      return {
        connected: false,
        schemaReady: false,
        error: 'Database tables do not exist',
        suggestion: 'Run: DATABASE_URL="your_connection_string" npx prisma db push',
        code: 'TABLES_MISSING' as const,
      };
    }

    return {
      connected: false,
      schemaReady: false,
      error: err.message || 'Unknown error',
      suggestion: 'Check DATABASE_URL and database connection',
      code: 'CONNECTION' as const,
    };
  }
}
