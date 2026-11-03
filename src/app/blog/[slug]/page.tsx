import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import BlogCard from "@/components/blog/BlogCard";
import VideoEmbed from "@/components/blog/VideoEmbed";
import { getPublishedPost, getPublishedPosts } from "@/lib/blog";
import { DEFAULT_BLOG_IMAGE, canOptimizeImage, formatPostDate } from "@/lib/blogShared";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(decodeURIComponent(slug));
  if (!post) return { title: "Článok sa nenašiel | Michal Kurka" };

  const image = post.imageUrl && !post.imageUrl.startsWith("data:") ? post.imageUrl : DEFAULT_BLOG_IMAGE;
  return {
    title: `${post.title} | Michal Kurka`,
    description: post.description,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.createdAt,
      images: [{ url: image }],
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  await connection();
  const { slug } = await params;
  const post = await getPublishedPost(decodeURIComponent(slug));
  if (!post) notFound();

  if (!post.content && post.url) redirect(post.url);
  if (post.slug && slug !== post.slug) redirect(`/blog/${post.slug}`);

  const related = (await getPublishedPosts()).filter((p) => p.id !== post.id).slice(0, 3);
  const cover = post.imageUrl || DEFAULT_BLOG_IMAGE;

  return (
    <main className="min-h-screen bg-white">
      <section className="relative flex min-h-[520px] md:min-h-[580px] items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={cover}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            unoptimized={!canOptimizeImage(cover)}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#202325] via-[#202325]/70 to-black/40" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 pt-40 pb-14 md:pb-16">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-[#5ECAD5]"
          >
            <span aria-hidden>←</span> Späť na blog
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white drop-shadow-lg">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80">
            <span className="font-medium text-white">Michal Kurka</span>
            <span aria-hidden>•</span>
            <time dateTime={post.createdAt}>{formatPostDate(post.createdAt)}</time>
            <span aria-hidden>•</span>
            <span>{post.readingMinutes} min čítania</span>
            {post.videoUrl && (
              <>
                <span aria-hidden>•</span>
                <span className="font-medium text-[#5ECAD5]">Obsahuje video</span>
              </>
            )}
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <p className="mb-10 text-xl md:text-2xl font-light leading-relaxed text-[#202325]">{post.description}</p>

        {post.videoUrl && (
          <div className="mb-12">
            <VideoEmbed
              url={post.videoUrl}
              title={post.title}
              poster={post.imageUrl && !post.imageUrl.startsWith("data:") ? post.imageUrl : undefined}
            />
          </div>
        )}

        {post.content && (
          <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        )}

        {post.url && (
          <p className="mt-10">
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-[#1F8E99] hover:text-[#5ECAD5]"
            >
              Zdroj / viac informácií <span aria-hidden>↗</span>
            </a>
          </p>
        )}

        <div className="mt-16 flex flex-col items-start gap-6 rounded-2xl bg-[#202325] p-8 md:flex-row md:items-center md:p-10">
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#5ECAD5]">Máte otázky k tejto téme?</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Poďme to prebrať spolu</h2>
            <p className="mt-2 text-white/70">
              Vyplňte krátky formulár a ozvem sa vám s riešením na mieru.
            </p>
          </div>
          <Link
            href="/formular"
            className="shrink-0 rounded-lg bg-[#5ECAD5] px-7 py-4 font-semibold text-white shadow-lg transition-colors hover:bg-[#4BB8C4]"
          >
            Nezáväzná konzultácia
          </Link>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl md:text-3xl font-bold text-[#202325]">Ďalšie články</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
