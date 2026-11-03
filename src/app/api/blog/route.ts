import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { isAdminRequest } from '@/lib/adminAuth';
import {
  autoDescription,
  collectBlobUrls,
  deleteBlobFiles,
  isContentEmpty,
  sanitizeContent,
  toFull,
  toSummary,
  uniqueSlug,
} from '@/lib/blog';
import { apiErrorPayload } from '@/lib/dbErrors';

const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

interface BlogPayload {
  title?: string;
  description?: string;
  content?: string;
  slug?: string;
  url?: string;
  imageUrl?: string;
  videoUrl?: string;
  published?: boolean;
}

async function buildData(body: BlogPayload, excludeId?: string) {
  const title = body.title?.trim() ?? '';
  if (!title) throw new ValidationError('Článok musí mať nadpis.');

  const content = body.content ? sanitizeContent(body.content) : '';
  const hasContent = !isContentEmpty(content);
  const description = body.description?.trim() || (hasContent ? autoDescription(content) : '');
  if (!description) throw new ValidationError('Doplňte krátky úvod alebo text článku.');

  return {
    title,
    description,
    content: hasContent ? content : null,
    slug: await uniqueSlug(body.slug?.trim() || title, excludeId),
    url: body.url?.trim() || '',
    imageUrl: body.imageUrl?.trim() || '',
    videoUrl: body.videoUrl?.trim() || null,
    published: body.published ?? true,
  };
}

class ValidationError extends Error {}

function revalidateBlog(slug?: string | null) {
  revalidatePath('/blog');
  if (slug) revalidatePath(`/blog/${slug}`);
}

function errorResponse(error: unknown, fallback: string) {
  if (error instanceof ValidationError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  console.error(fallback, error);
  const payload = apiErrorPayload(error, fallback);
  return NextResponse.json(payload, { status: 500 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const includeDrafts = searchParams.get('all') === '1';

  try {
    if (id || includeDrafts) {
      if (!isAdminRequest(request)) return unauthorized();
      if (id) {
        const post = await prisma.blogPost.findUnique({ where: { id } });
        return post
          ? NextResponse.json(toFull(post))
          : NextResponse.json({ error: 'Článok sa nenašiel' }, { status: 404 });
      }
    }

    const posts = await prisma.blogPost.findMany({
      where: includeDrafts ? undefined : { published: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts.map(toSummary));
  } catch (error) {
    return errorResponse(error, 'Nepodarilo sa načítať články');
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  try {
    const data = await buildData(await request.json());
    const post = await prisma.blogPost.create({ data });
    revalidateBlog(post.slug);
    return NextResponse.json(toFull(post), { status: 201 });
  } catch (error) {
    return errorResponse(error, 'Nepodarilo sa uložiť článok');
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  try {
    const body = await request.json();
    const id = String(body.id || '');
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Článok sa nenašiel' }, { status: 404 });

    const data = await buildData(body, id);
    const post = await prisma.blogPost.update({ where: { id }, data });

    const stillUsed = collectBlobUrls(post);
    await deleteBlobFiles([...collectBlobUrls(existing)].filter((url) => !stillUsed.has(url)));

    revalidateBlog(existing.slug);
    revalidateBlog(post.slug);
    return NextResponse.json(toFull(post));
  } catch (error) {
    return errorResponse(error, 'Nepodarilo sa uložiť zmeny');
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Chýba ID článku' }, { status: 400 });

    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: 'Článok sa nenašiel' }, { status: 404 });

    await prisma.blogPost.delete({ where: { id } });
    await deleteBlobFiles([...collectBlobUrls(post)]);
    revalidateBlog(post.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error, 'Nepodarilo sa vymazať článok');
  }
}
