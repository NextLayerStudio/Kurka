import { parseVideoUrl } from "@/lib/blogShared";

export default function VideoEmbed({ url, title, poster }: { url: string; title: string; poster?: string }) {
  const video = parseVideoUrl(url);
  if (!video) return null;

  return (
    <div className="overflow-hidden rounded-2xl bg-black shadow-xl ring-1 ring-black/10">
      {video.kind === "file" ? (
        <video
          src={video.src}
          poster={poster}
          controls
          playsInline
          preload="metadata"
          className="aspect-video w-full bg-black"
        />
      ) : (
        <iframe
          src={video.embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="aspect-video w-full"
        />
      )}
    </div>
  );
}
