import type { Metadata } from "next";
import { connection } from "next/server";
import BlogHero from "@/components/blog/BlogHero";
import BlogCard, { FeaturedPost } from "@/components/blog/BlogCard";
import { getPublishedPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Michal Kurka – finančné články a tipy",
  description: "Najnovšie články, videá a praktické tipy zo sveta financií, investovania a finančného plánovania.",
};

export default async function BlogPage() {
  await connection();
  const posts = await getPublishedPosts();
  const [featured, ...rest] = posts;

  return (
    <main className="min-h-screen">
      <BlogHero />

      <section className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#202325] mb-4">
              Finančné články a tipy
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Sledujte naše najnovšie články a získajte cenné poznatky o financiách, investovaní a finančnom plánovaní.
            </p>
          </div>

          {!featured ? (
            <div className="mx-auto max-w-xl rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-black/5">
              <p className="text-xl text-gray-700 mb-2">Zatiaľ nie sú k dispozícii žiadne články.</p>
              <p className="text-gray-500">Čoskoro pridáme nový obsah!</p>
            </div>
          ) : (
            <div className="space-y-10 md:space-y-14">
              <FeaturedPost post={featured} />
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {rest.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
