import sanitizeHtml from 'sanitize-html';
import type { BlogPost } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  BlogPostFull,
  BlogPostSummary,
  readingMinutes,
  slugify,
  stripHtml,
} from '@/lib/blogShared';

const ALIGNMENT = { 'text-align': [/^(left|right|center|justify)$/] };

export function sanitizeContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's', 'a', 'ul', 'ol', 'li',
      'blockquote', 'hr', 'br', 'img', 'figure', 'figcaption', 'video', 'source', 'iframe',
      'div', 'code', 'pre', 'mark', 'span',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      video: ['src', 'controls', 'poster', 'playsinline', 'preload'],
      source: ['src', 'type'],
      iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder', 'title'],
      div: ['data-youtube-video', 'data-video'],
      p: ['style'], h2: ['style'], h3: ['style'], h4: ['style'],
    },
    allowedStyles: { p: ALIGNMENT, h2: ALIGNMENT, h3: ALIGNMENT, h4: ALIGNMENT },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https', 'data'] },
    allowedIframeHostnames: ['www.youtube.com', 'www.youtube-nocookie.com', 'youtube.com', 'player.vimeo.com'],
    exclusiveFilter: (frame) => (frame.tag === 'iframe' || frame.tag === 'img') && !frame.attribs.src,
    transformTags: {
      a: (tagName, attribs) => {
        const external = /^https?:\/\//.test(attribs.href || '');
        return {
          tagName,
          attribs: external ? { ...attribs, target: '_blank', rel: 'noopener noreferrer' } : attribs,
        };
      },
      video: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, controls: 'controls', playsinline: 'playsinline', preload: 'metadata' },
      }),
    },
  });
}

export function isContentEmpty(html: string | null | undefined): boolean {
  if (!html) return true;
  return !stripHtml(html) && !/<(img|video|iframe)\b/i.test(html);
}

export function autoDescription(html: string): string {
  const paragraphs = html.match(/<p[^>]*>[\s\S]*?<\/p>/gi)?.join(' ') ?? html;
  const text = stripHtml(paragraphs);
  if (text.length <= 180) return text;
  return `${text.slice(0, 177).replace(/\s+\S*$/, '')}…`;
}

export async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base) || 'clanok';
  let candidate = root;
  for (let i = 2; ; i++) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${root}-${i}`;
  }
}

export function toSummary(post: BlogPost): BlogPostSummary {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    description: post.description,
    url: post.url,
    imageUrl: post.imageUrl,
    videoUrl: post.videoUrl,
    published: post.published,
    hasContent: !isContentEmpty(post.content),
    readingMinutes: readingMinutes(post.content),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}

export function toFull(post: BlogPost): BlogPostFull {
  const { hasContent: _hasContent, ...summary } = toSummary(post);
  void _hasContent;
  return { ...summary, content: post.content };
}

export async function getPublishedPosts(): Promise<BlogPostSummary[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
    return posts.map(toSummary);
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

export async function getPublishedPost(slugOrId: string): Promise<BlogPostFull | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const post = await prisma.blogPost.findFirst({
      where: { published: true, OR: [{ slug: slugOrId }, { id: slugOrId }] },
    });
    return post ? toFull(post) : null;
  } catch (error) {
    console.error('Error loading blog post:', error);
    return null;
  }
}

const BLOB_URL = /https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[^\s"'<>)]+/gi;

export function collectBlobUrls(post: Pick<BlogPost, 'imageUrl' | 'videoUrl' | 'content'>): Set<string> {
  const text = [post.imageUrl, post.videoUrl, post.content].filter(Boolean).join(' ');
  return new Set(text.match(BLOB_URL) ?? []);
}

export async function deleteBlobFiles(urls: string[]) {
  if (!urls.length || !process.env.BLOB_READ_WRITE_TOKEN) return;
  try {
    const { del } = await import('@vercel/blob');
    await del(urls);
  } catch (error) {
    console.error('Error deleting blob files:', error);
  }
}
