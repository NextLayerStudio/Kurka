'use client';

import { useState } from 'react';
import BlogEditor from './BlogEditor';
import { BlogPostFull, BlogPostSummary, DEFAULT_BLOG_IMAGE, formatPostDate, postHref } from '@/lib/blogShared';

interface Props {
  posts: BlogPostSummary[];
  loading: boolean;
  blobEnabled: boolean;
  onChanged: () => void;
}

type Filter = 'all' | 'published' | 'draft';

export default function BlogManager({ posts, loading, blobEnabled, onChanged }: Props) {
  const [editing, setEditing] = useState<BlogPostFull | null | undefined>(undefined);
  const [opening, setOpening] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const openPost = async (id: string) => {
    setOpening(id);
    setError('');
    try {
      const response = await fetch(`/api/blog?id=${encodeURIComponent(id)}`);
      if (!response.ok) throw new Error();
      setEditing(await response.json());
    } catch {
      setError('Článok sa nepodarilo otvoriť.');
    } finally {
      setOpening(null);
    }
  };

  const deletePost = async (post: BlogPostSummary) => {
    if (!confirm(`Naozaj chcete natrvalo vymazať článok „${post.title}“? Vymažú sa aj jeho nahraté obrázky a videá.`)) return;
    const response = await fetch(`/api/blog?id=${encodeURIComponent(post.id)}`, { method: 'DELETE' });
    if (response.ok) onChanged();
    else setError('Článok sa nepodarilo vymazať.');
  };

  const togglePublished = async (post: BlogPostSummary) => {
    setOpening(post.id);
    try {
      const full = await fetch(`/api/blog?id=${encodeURIComponent(post.id)}`).then((r) => r.json());
      const response = await fetch('/api/blog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...full, published: !post.published }),
      });
      if (!response.ok) throw new Error();
      onChanged();
    } catch {
      setError('Zmena stavu zlyhala.');
    } finally {
      setOpening(null);
    }
  };

  const counts = {
    all: posts.length,
    published: posts.filter((p) => p.published).length,
    draft: posts.filter((p) => !p.published).length,
  };

  const visible = posts.filter((p) => {
    if (filter === 'published' && !p.published) return false;
    if (filter === 'draft' && p.published) return false;
    return p.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#202325]">Články na blogu</h2>
          <p className="text-sm text-gray-500">Píšte články s obrázkami a videami – zobrazia sa na stránke /blog.</p>
        </div>
        <button
          onClick={() => setEditing(null)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#5ECAD5] px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-[#4BB8C4]"
        >
          <span className="text-lg leading-none">+</span> Napísať nový článok
        </button>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-black/5">
          {([
            ['all', 'Všetky'],
            ['published', 'Zverejnené'],
            ['draft', 'Koncepty'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === key ? 'bg-[#202325] text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label} <span className="opacity-60">{counts[key]}</span>
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Hľadať článok…"
          className="w-full rounded-xl border-none bg-white px-4 py-2.5 text-sm shadow-sm ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-[#5ECAD5] sm:ml-auto sm:max-w-xs"
        />
      </div>

      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-black/5">
          <p className="text-lg font-semibold text-[#202325]">Zatiaľ tu nie je žiadny článok</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Kliknite na „Napísať nový článok“. Editor funguje podobne ako Word – text, nadpisy, obrázky aj videá.
          </p>
        </div>
      ) : visible.length === 0 ? (
        <p className="rounded-2xl bg-white px-6 py-10 text-center text-sm text-gray-500 shadow-sm ring-1 ring-black/5">
          Žiadny článok nevyhovuje filtru.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((post) => {
            const link = postHref(post);
            return (
              <article
                key={post.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-lg"
              >
                <button onClick={() => openPost(post.id)} className="relative block aspect-[16/9] overflow-hidden text-left">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.imageUrl || DEFAULT_BLOG_IMAGE}
                    alt=""
                    style={{ height: '100%' }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 flex gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm ${
                        post.published ? 'bg-green-500 text-white' : 'bg-white text-gray-700'
                      }`}
                    >
                      {post.published ? 'Zverejnený' : 'Koncept'}
                    </span>
                    {post.videoUrl && (
                      <span className="rounded-full bg-[#202325] px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">▶ Video</span>
                    )}
                  </div>
                  {opening === post.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#5ECAD5] border-t-transparent" />
                    </div>
                  )}
                </button>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs text-gray-400">
                    {formatPostDate(post.createdAt)}
                    {post.hasContent ? ` • ${post.readingMinutes} min čítania` : ' • externý odkaz'}
                  </p>
                  <h3 className="mt-1.5 line-clamp-2 font-semibold text-[#202325]">{post.title}</h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-gray-500">{post.description}</p>
                  <div className="mt-auto flex items-center gap-1 pt-4">
                    <button
                      onClick={() => openPost(post.id)}
                      className="rounded-lg bg-[#5ECAD5]/15 px-3 py-1.5 text-sm font-semibold text-[#1F8E99] hover:bg-[#5ECAD5]/25"
                    >
                      Upraviť
                    </button>
                    {post.published && (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
                      >
                        Zobraziť
                      </a>
                    )}
                    <button
                      onClick={() => togglePublished(post)}
                      className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
                    >
                      {post.published ? 'Skryť' : 'Zverejniť'}
                    </button>
                    <button
                      onClick={() => deletePost(post)}
                      title="Vymazať článok"
                      className="ml-auto rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {editing !== undefined && (
        <BlogEditor
          post={editing}
          blobEnabled={blobEnabled}
          onClose={() => {
            setEditing(undefined);
            onChanged();
          }}
          onSaved={(saved) => {
            setEditing(saved);
            onChanged();
          }}
        />
      )}
    </div>
  );
}
