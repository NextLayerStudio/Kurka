import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';

/** One-time SQL alignment when `prisma db push` cannot run locally (e.g. Node 26). */
export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const statements = [
      `ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "slug" TEXT`,
      `ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "content" TEXT`,
      `ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "videoUrl" TEXT`,
      `ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "published" BOOLEAN NOT NULL DEFAULT true`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "blog_posts_slug_key" ON "blog_posts"("slug")`,
    ];

    for (const sql of statements) {
      await prisma.$executeRawUnsafe(sql);
    }

    await prisma.blogPost.findFirst({
      select: { id: true, slug: true, content: true, videoUrl: true, published: true },
    });

    return NextResponse.json({ ok: true, message: 'Blog tabuľka je aktualizovaná.' });
  } catch (error) {
    console.error('apply-blog-schema', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Migrácia zlyhala',
        hint: 'Skúste npm run db:push s Node 20 alebo spustite SQL vo Vercel Postgres console.',
      },
      { status: 500 }
    );
  }
}
