import Image from "next/image";
import Link from "next/link";
import {
  BlogPostSummary,
  DEFAULT_BLOG_IMAGE,
  canOptimizeImage,
  formatPostDate,
  postHref,
} from "@/lib/blogShared";

function PlayBadge({ large = false }: { large?: boolean }) {
  return (
    <span
      className={`absolute inset-0 m-auto flex items-center justify-center rounded-full bg-white/90 text-[#1F8E99] shadow-xl transition-transform duration-300 group-hover:scale-110 ${
        large ? "h-20 w-20" : "h-14 w-14"
      }`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className={large ? "h-9 w-9 ml-1" : "h-6 w-6 ml-0.5"} fill="currentColor">
        <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.6-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14z" />
      </svg>
    </span>
  );
}

function Meta({ post, light = false }: { post: BlogPostSummary; light?: boolean }) {
  const { external } = postHref(post);
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm ${light ? "text-white/80" : "text-gray-500"}`}>
      <span>{formatPostDate(post.createdAt)}</span>
      {!external && (
        <>
          <span aria-hidden>•</span>
          <span>{post.readingMinutes} min čítania</span>
        </>
      )}
      {post.videoUrl && (
        <>
          <span aria-hidden>•</span>
          <span className={light ? "text-[#5ECAD5] font-medium" : "text-[#1F8E99] font-medium"}>Video</span>
        </>
      )}
    </div>
  );
}

function CardLink({ post, className, children }: { post: BlogPostSummary; className: string; children: React.ReactNode }) {
  const { href, external } = postHref(post);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function FeaturedPost({ post }: { post: BlogPostSummary }) {
  const image = post.imageUrl || DEFAULT_BLOG_IMAGE;
  return (
    <CardLink
      post={post}
      className="group grid overflow-hidden rounded-3xl bg-[#202325] shadow-xl lg:grid-cols-[1.15fr_1fr]"
    >
      <div className="relative min-h-[260px] sm:min-h-[340px] lg:min-h-[420px]">
        <Image
          src={image}
          alt={post.title}
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          unoptimized={!canOptimizeImage(image)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
        {post.videoUrl && <PlayBadge large />}
      </div>
      <div className="flex flex-col justify-center gap-5 p-8 md:p-12">
        <span className="w-fit rounded-full bg-[#5ECAD5]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#5ECAD5]">
          Najnovší článok
        </span>
        <h3 className="text-2xl md:text-3xl font-bold leading-tight text-white group-hover:text-[#5ECAD5] transition-colors">
          {post.title}
        </h3>
        <p className="text-base md:text-lg text-white/75 line-clamp-4">{post.description}</p>
        <Meta post={post} light />
        <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#5ECAD5] px-6 py-3 font-semibold text-white transition-colors group-hover:bg-[#4BB8C4]">
          Čítať článok <span aria-hidden>→</span>
        </span>
      </div>
    </CardLink>
  );
}

export default function BlogCard({ post }: { post: BlogPostSummary }) {
  const image = post.imageUrl || DEFAULT_BLOG_IMAGE;
  return (
    <CardLink
      post={post}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={image}
          alt={post.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          unoptimized={!canOptimizeImage(image)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {post.videoUrl && <PlayBadge />}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Meta post={post} />
        <h3 className="mt-3 mb-3 text-xl font-semibold leading-snug text-[#202325] group-hover:text-[#1F8E99] transition-colors">
          {post.title}
        </h3>
        <p className="mb-5 text-gray-600 line-clamp-3">{post.description}</p>
        <span className="mt-auto text-sm font-semibold text-[#1F8E99] group-hover:underline">
          {postHref(post).external ? "Otvoriť článok ↗" : "Čítať viac →"}
        </span>
      </div>
    </CardLink>
  );
}
