export interface BlogPostSummary {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  videoUrl: string | null;
  published: boolean;
  hasContent: boolean;
  readingMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostFull extends Omit<BlogPostSummary, 'hasContent'> {
  content: string | null;
}

export const DEFAULT_BLOG_IMAGE = '/blog-banner.jpg';

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function stripHtml(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export function countWords(html: string | null | undefined): number {
  if (!html) return 0;
  const text = stripHtml(html);
  return text ? text.split(' ').length : 0;
}

export function readingMinutes(html: string | null | undefined): number {
  return Math.max(1, Math.round(countWords(html) / 200));
}

export function postHref(post: Pick<BlogPostSummary, 'slug' | 'id' | 'hasContent' | 'url'>) {
  if (!post.hasContent && post.url) return { href: post.url, external: true };
  return { href: `/blog/${post.slug || post.id}`, external: false };
}

export type VideoSource =
  | { kind: 'youtube'; embedUrl: string }
  | { kind: 'vimeo'; embedUrl: string }
  | { kind: 'file'; src: string };

export function parseVideoUrl(url: string | null | undefined): VideoSource | null {
  if (!url) return null;
  const value = url.trim();

  const youtube = value.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (youtube) return { kind: 'youtube', embedUrl: `https://www.youtube-nocookie.com/embed/${youtube[1]}` };

  const vimeo = value.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { kind: 'vimeo', embedUrl: `https://player.vimeo.com/video/${vimeo[1]}` };

  if (/^https?:\/\//.test(value) || value.startsWith('/')) return { kind: 'file', src: value };
  return null;
}

export function formatPostDate(date: string | Date) {
  return new Date(date).toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' });
}

// next/image only optimizes hosts listed in next.config; everything else is rendered as-is.
export function canOptimizeImage(src: string) {
  return src.startsWith('/') || /^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//.test(src);
}
