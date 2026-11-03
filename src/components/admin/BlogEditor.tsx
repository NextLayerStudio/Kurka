'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import RichTextEditor from './RichTextEditor';
import { IMAGE_TYPES, MAX_VIDEO_MB, VIDEO_TYPES, uploadImage, uploadVideo } from './media';
import {
  BlogPostFull,
  DEFAULT_BLOG_IMAGE,
  countWords,
  formatPostDate,
  parseVideoUrl,
  readingMinutes,
  slugify,
} from '@/lib/blogShared';
import VideoEmbed from '@/components/blog/VideoEmbed';

interface Draft {
  title: string;
  description: string;
  content: string;
  slug: string;
  url: string;
  imageUrl: string;
  videoUrl: string;
  published: boolean;
}

interface Props {
  post: BlogPostFull | null;
  blobEnabled: boolean;
  onClose: () => void;
  onSaved: (post: BlogPostFull) => void;
}

const DESCRIPTION_LIMIT = 220;

const draftKey = (id?: string) => `mk-blog-draft-${id ?? 'new'}`;

function fromPost(post: BlogPostFull | null): Draft {
  return {
    title: post?.title ?? '',
    description: post?.description ?? '',
    content: post?.content ?? '',
    slug: post?.slug ?? '',
    url: post?.url ?? '',
    imageUrl: post?.imageUrl ?? '',
    videoUrl: post?.videoUrl ?? '',
    published: post?.published ?? true,
  };
}

const firstImage = (html: string) => html.match(/<img[^>]+src="([^"]+)"/)?.[1] ?? '';

export default function BlogEditor({ post, blobEnabled, onClose, onSaved }: Props) {
  const initial = useMemo(() => fromPost(post), [post]);
  const [draft, setDraft] = useState<Draft>(initial);
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(initial));
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [restorable, setRestorable] = useState<Draft | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [toast, setToast] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [localSavedAt, setLocalSavedAt] = useState<Date | null>(null);

  const isDirty = JSON.stringify(draft) !== savedSnapshot;
  const words = countWords(draft.content);
  const minutes = readingMinutes(draft.content);
  const coverPreview = draft.imageUrl || firstImage(draft.content) || DEFAULT_BLOG_IMAGE;

  const showError = useCallback((text: string) => setToast({ type: 'error', text }), []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), toast.type === 'error' ? 6000 : 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(draftKey(post?.id));
      if (!stored) return;
      const parsed = JSON.parse(stored) as { draft: Draft; savedAt: string };
      const serverTime = post ? new Date(post.updatedAt).getTime() : 0;
      if (new Date(parsed.savedAt).getTime() > serverTime && JSON.stringify(parsed.draft) !== JSON.stringify(initial)) {
        setRestorable(parsed.draft);
      } else {
        localStorage.removeItem(draftKey(post?.id));
      }
    } catch {
      localStorage.removeItem(draftKey(post?.id));
    }
  }, [post, initial]);

  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(draftKey(post?.id), JSON.stringify({ draft, savedAt: new Date().toISOString() }));
        setLocalSavedAt(new Date());
      } catch {
        // Large inline images can exceed the localStorage quota; autosave is best-effort.
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [draft, isDirty, post?.id]);

  useEffect(() => {
    if (!isDirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [isDirty]);

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const handleClose = () => {
    if (isDirty && !confirm('Máte neuložené zmeny. Naozaj chcete odísť? Rozpísaný článok ostane uložený v tomto prehliadači.')) {
      return;
    }
    onClose();
  };

  const save = async (published: boolean) => {
    if (!draft.title.trim()) {
      showError('Pridajte článku nadpis.');
      return;
    }
    if (!draft.description.trim() && !words) {
      showError('Napíšte aspoň krátky úvod alebo text článku.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...draft,
        id: post?.id,
        published,
        slug: slugTouched ? draft.slug : '',
        imageUrl: draft.imageUrl || firstImage(draft.content),
      };
      const response = await fetch('/api/blog', {
        method: post ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Uloženie zlyhalo.');

      localStorage.removeItem(draftKey(post?.id));
      const saved = fromPost(data);
      setDraft(saved);
      setSavedSnapshot(JSON.stringify(saved));
      setSlugTouched(true);
      setToast({ type: 'success', text: published ? 'Článok je zverejnený na webe.' : 'Koncept bol uložený.' });
      onSaved(data);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Uloženie zlyhalo.');
    } finally {
      setSaving(false);
    }
  };

  const checklist = [
    { done: draft.title.trim().length >= 10, label: 'Výstižný nadpis' },
    { done: draft.description.trim().length >= 60, label: 'Krátky úvod (perex)' },
    { done: words >= 150, label: 'Aspoň 150 slov textu' },
    { done: /<h[23]/.test(draft.content), label: 'Text rozdelený nadpismi' },
    { done: Boolean(draft.imageUrl || firstImage(draft.content)), label: 'Titulný obrázok' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f5f7f8]">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[64px] max-w-[1400px] items-center gap-3 px-4 sm:px-6">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            <span aria-hidden>←</span> <span className="hidden sm:inline">Späť na články</span>
          </button>
          <div className="hidden md:block text-xs text-gray-400">
            {saving
              ? 'Ukladám…'
              : isDirty
                ? localSavedAt
                  ? `Rozpísané uložené v prehliadači ${localSavedAt.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}`
                  : 'Neuložené zmeny'
                : post
                  ? 'Všetky zmeny sú uložené'
                  : 'Nový článok'}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setPreview(true)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Náhľad
            </button>
            <button
              onClick={() => save(false)}
              disabled={saving}
              className="hidden sm:block rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Uložiť ako koncept
            </button>
            <button
              onClick={() => save(true)}
              disabled={saving}
              className="rounded-lg bg-[#5ECAD5] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4BB8C4] disabled:opacity-50"
            >
              {post?.published ? 'Uložiť zmeny' : 'Publikovať'}
            </button>
          </div>
        </div>
      </header>

      {restorable && (
        <div className="mx-auto mt-4 max-w-[1400px] px-4 sm:px-6">
          <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 sm:flex-row sm:items-center">
            <span className="flex-1">Našli sme rozpísanú verziu tohto článku, ktorá nebola uložená. Chcete v nej pokračovať?</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setDraft(restorable);
                  setSlugTouched(Boolean(restorable.slug));
                  setEditorKey((k) => k + 1);
                  setRestorable(null);
                }}
                className="rounded-lg bg-amber-500 px-3 py-1.5 font-semibold text-white hover:bg-amber-600"
              >
                Obnoviť
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem(draftKey(post?.id));
                  setRestorable(null);
                }}
                className="rounded-lg px-3 py-1.5 hover:bg-amber-100"
              >
                Zahodiť
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:py-8">
        <main className="min-w-0 rounded-3xl bg-white px-5 py-8 shadow-sm ring-1 ring-black/5 sm:px-10 md:px-14 md:py-12">
          <textarea
            value={draft.title}
            onChange={(e) => update('title', e.target.value.replace(/\n/g, ''))}
            placeholder="Nadpis článku"
            rows={1}
            className="w-full resize-none overflow-hidden border-none bg-transparent font-['Monda',Arial,sans-serif] text-3xl font-bold leading-tight text-[#202325] placeholder:text-gray-300 focus:outline-none md:text-4xl [field-sizing:content]"
          />

          <div className="mt-4 border-b border-gray-100 pb-6">
            <textarea
              value={draft.description}
              onChange={(e) => update('description', e.target.value.slice(0, DESCRIPTION_LIMIT))}
              placeholder="Krátky úvod – 1 až 2 vety, ktoré čitateľa navnadia. Zobrazí sa na karte článku aj pod nadpisom."
              rows={2}
              className="w-full resize-none border-none bg-transparent text-lg leading-relaxed text-gray-600 placeholder:text-gray-300 focus:outline-none md:text-xl [field-sizing:content]"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-400">
              <span>{draft.description ? '' : 'Ak úvod nevyplníte, vytvorí sa automaticky zo začiatku textu.'}</span>
              <span className={draft.description.length > DESCRIPTION_LIMIT - 20 ? 'text-amber-500' : ''}>
                {draft.description.length}/{DESCRIPTION_LIMIT}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <RichTextEditor
              key={editorKey}
              initialContent={draft.content}
              blobEnabled={blobEnabled}
              onChange={(html) => update('content', html)}
              onError={showError}
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-4 border-t border-gray-100 pt-4 text-xs text-gray-400">
            <span>{words} slov</span>
            <span>približne {minutes} min čítania</span>
          </div>
        </main>

        <aside className="space-y-5 lg:sticky lg:top-[88px] lg:self-start">
          <Panel title="Titulný obrázok" hint="Zobrazí sa na karte článku a v hlavičke.">
            <CoverPicker
              value={draft.imageUrl}
              fallback={coverPreview}
              blobEnabled={blobEnabled}
              onChange={(url) => update('imageUrl', url)}
              onError={showError}
            />
          </Panel>

          <Panel title="Hlavné video" hint="Voliteľné – zobrazí sa hneď pod úvodom článku.">
            <MainVideoPicker
              value={draft.videoUrl}
              blobEnabled={blobEnabled}
              onChange={(url) => update('videoUrl', url)}
              onError={showError}
            />
          </Panel>

          <Panel title="Nastavenia">
            <label className="block text-xs font-medium text-gray-500">Adresa článku</label>
            <div className="mt-1 flex items-center overflow-hidden rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-[#5ECAD5]">
              <span className="bg-gray-50 px-2 py-2 text-xs text-gray-400">/blog/</span>
              <input
                value={slugTouched ? draft.slug : slugify(draft.title)}
                onChange={(e) => {
                  setSlugTouched(true);
                  update('slug', slugify(e.target.value) || e.target.value.toLowerCase());
                }}
                placeholder="adresa-clanku"
                className="min-w-0 flex-1 px-2 py-2 text-sm focus:outline-none"
              />
            </div>

            <label className="mt-4 block text-xs font-medium text-gray-500">Externý odkaz (voliteľné)</label>
            <input
              value={draft.url}
              onChange={(e) => update('url', e.target.value)}
              placeholder="https://… zdroj alebo pôvodný článok"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5ECAD5]"
            />
            <p className="mt-1 text-xs text-gray-400">Ak článok nemá vlastný text, karta otvorí tento odkaz.</p>

            <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
              <div>
                <p className="text-sm font-medium text-gray-700">Stav</p>
                <p className="text-xs text-gray-400">{post?.published ? 'Zverejnený' : post ? 'Koncept – nie je na webe' : 'Zatiaľ neuložený'}</p>
              </div>
              {post && (
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                  {post.published ? 'Na webe' : 'Koncept'}
                </span>
              )}
            </div>
            {post?.published && (
              <div className="mt-3 flex gap-2">
                <a
                  href={`/blog/${post.slug || post.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-center text-sm text-gray-700 hover:bg-gray-50"
                >
                  Zobraziť na webe ↗
                </a>
                <button
                  onClick={() => save(false)}
                  disabled={saving}
                  className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
                >
                  Skryť
                </button>
              </div>
            )}
          </Panel>

          <Panel title="Tipy pre dobrý článok">
            <ul className="space-y-2">
              {checklist.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-sm">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                      item.done ? 'bg-[#5ECAD5] text-white' : 'border border-gray-300 text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                  <span className={item.done ? 'text-gray-700' : 'text-gray-400'}>{item.label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-gray-400">
              Obrázky a videá môžete do textu rovno pretiahnuť myšou alebo vložiť cez Ctrl+V.
            </p>
          </Panel>
        </aside>
      </div>

      {preview && (
        <ArticlePreview draft={draft} cover={coverPreview} minutes={minutes} onClose={() => setPreview(false)} />
      )}

      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-2xl ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-[#202325]'
          }`}
          role="status"
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}

function Panel({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <h3 className="text-sm font-semibold text-[#202325]">{title}</h3>
      {hint && <p className="mt-0.5 text-xs text-gray-400">{hint}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
      <div className="h-full rounded-full bg-[#5ECAD5] transition-all" style={{ width: `${Math.max(4, value)}%` }} />
    </div>
  );
}

function CoverPicker({
  value,
  fallback,
  blobEnabled,
  onChange,
  onError,
}: {
  value: string;
  fallback: string;
  blobEnabled: boolean;
  onChange: (url: string) => void;
  onError: (msg: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setProgress(0);
    try {
      onChange(await uploadImage(file, blobEnabled, setProgress));
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Obrázok sa nepodarilo nahrať.');
    } finally {
      setProgress(null);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFile(e.dataTransfer.files[0]);
        }}
        className={`group relative block aspect-[16/10] w-full overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
          dragging ? 'border-[#5ECAD5] bg-[#5ECAD5]/10' : value ? 'border-transparent' : 'border-gray-200 hover:border-[#5ECAD5]'
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={fallback} alt="" style={{ height: '100%' }} className={`absolute inset-0 h-full w-full object-cover ${value ? '' : 'opacity-40'}`} />
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/0 text-sm font-medium text-white opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
          {value ? 'Zmeniť obrázok' : 'Nahrať obrázok'}
          <span className="text-xs font-normal">alebo ho sem pretiahnite</span>
        </span>
        {!value && (
          <span className="absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-1 text-[11px] text-gray-600 group-hover:opacity-0">
            {fallback === DEFAULT_BLOG_IMAGE ? 'Predvolený obrázok' : 'Prvý obrázok z textu'}
          </span>
        )}
      </button>
      {progress !== null && (
        <div className="mt-2">
          <ProgressBar value={progress} />
        </div>
      )}
      {value && (
        <button type="button" onClick={() => onChange('')} className="mt-2 text-xs text-gray-500 hover:text-red-600">
          Odstrániť obrázok
        </button>
      )}
      <input
        ref={input}
        type="file"
        accept={IMAGE_TYPES.join(',')}
        hidden
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
}

function MainVideoPicker({
  value,
  blobEnabled,
  onChange,
  onError,
}: {
  value: string;
  blobEnabled: boolean;
  onChange: (url: string) => void;
  onError: (msg: string) => void;
}) {
  const [mode, setMode] = useState<'upload' | 'link'>(blobEnabled ? 'upload' : 'link');
  const [link, setLink] = useState('');
  const [progress, setProgress] = useState<number | null>(null);
  const [progressNote, setProgressNote] = useState('');
  const input = useRef<HTMLInputElement>(null);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setProgress(0);
    setProgressNote('Pripravujem video…');
    try {
      onChange(
        await uploadVideo(file, blobEnabled, (pct, status) => {
          setProgress(pct);
          if (status) setProgressNote(status);
        })
      );
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Video sa nepodarilo nahrať.');
    } finally {
      setProgress(null);
      setProgressNote('');
    }
  };

  if (value) {
    return (
      <div className="space-y-2">
        <VideoEmbed url={value} title="Náhľad videa" />
        <button type="button" onClick={() => onChange('')} className="text-xs text-gray-500 hover:text-red-600">
          Odstrániť video
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 grid grid-cols-2 rounded-lg bg-gray-100 p-1 text-xs font-medium">
        {(['upload', 'link'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-md py-1.5 transition-colors ${mode === m ? 'bg-white text-[#202325] shadow-sm' : 'text-gray-500'}`}
          >
            {m === 'upload' ? 'Nahrať súbor' : 'YouTube / Vimeo'}
          </button>
        ))}
      </div>

      {mode === 'upload' ? (
        blobEnabled ? (
          <>
            <button
              type="button"
              disabled={progress !== null}
              onClick={() => input.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                void handleFile(e.dataTransfer.files[0]);
              }}
              className="flex w-full flex-col items-center gap-1 rounded-xl border-2 border-dashed border-gray-200 px-4 py-6 text-sm text-gray-500 transition-colors hover:border-[#5ECAD5] hover:text-[#1F8E99] disabled:opacity-60"
            >
              <span className="font-medium">{progress !== null ? progressNote || 'Nahrávam…' : 'Vybrať video'}</span>
              <span className="text-xs text-gray-400">MP4, MOV alebo WebM – pred nahrátím sa zmenší na 720p</span>
            </button>
            {progress !== null && (
              <div className="mt-2">
                <ProgressBar value={progress} />
              </div>
            )}
            <input
              ref={input}
              type="file"
              accept={VIDEO_TYPES.join(',')}
              hidden
              onChange={(e) => {
                void handleFile(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </>
        ) : (
          <p className="rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
            Nahrávanie videí sa zapne po pripojení úložiska Vercel Blob. Dovtedy môžete vložiť odkaz na YouTube alebo Vimeo.
          </p>
        )
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const parsed = parseVideoUrl(link);
            if (!parsed || parsed.kind === 'file') {
              onError('Vložte odkaz na video z YouTube alebo Vimeo.');
              return;
            }
            onChange(link.trim());
            setLink('');
          }}
          className="flex gap-2"
        >
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://youtube.com/…"
            className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5ECAD5]"
          />
          <button type="submit" className="rounded-lg bg-[#202325] px-3 text-sm font-medium text-white hover:bg-black">
            Pridať
          </button>
        </form>
      )}
    </div>
  );
}

function ArticlePreview({
  draft,
  cover,
  minutes,
  onClose,
}: {
  draft: Draft;
  cover: string;
  minutes: number;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-white">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-[#202325] px-4 py-3 text-sm text-white sm:px-6">
        <span className="font-medium">Náhľad – takto bude článok vyzerať na webe</span>
        <button onClick={onClose} className="rounded-lg bg-white/10 px-4 py-1.5 font-medium hover:bg-white/20">
          Zavrieť náhľad
        </button>
      </div>
      <section className="relative flex min-h-[420px] items-end overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt="" style={{ height: '100%' }} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#202325] via-[#202325]/70 to-black/40" />
        <div className="relative mx-auto w-full max-w-4xl px-4 pb-12 pt-32 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            {draft.title || 'Nadpis článku'}
          </h1>
          <div className="mt-5 flex flex-wrap gap-x-4 text-sm text-white/80">
            <span className="font-medium text-white">Michal Kurka</span>
            <span>•</span>
            <span>{formatPostDate(new Date())}</span>
            <span>•</span>
            <span>{minutes} min čítania</span>
          </div>
        </div>
      </section>
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {draft.description && (
          <p className="mb-10 text-xl font-light leading-relaxed text-[#202325] md:text-2xl">{draft.description}</p>
        )}
        {draft.videoUrl && (
          <div className="mb-12">
            <VideoEmbed url={draft.videoUrl} title={draft.title} />
          </div>
        )}
        <div className="article-content" dangerouslySetInnerHTML={{ __html: draft.content }} />
      </article>
    </div>
  );
}
