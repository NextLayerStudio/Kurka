'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SITE_LOGO_ALT, SITE_LOGO_INTRINSIC, SITE_LOGO_PATH } from '@/config/branding';
import BlogManager from '@/components/admin/BlogManager';
import { ContactsView, SubmissionsView, type ContactSubmission, type FormSubmission } from '@/components/admin/Submissions';
import type { BlogPostSummary } from '@/lib/blogShared';

type Tab = 'submissions' | 'contact' | 'blog';
type AuthState = 'checking' | 'out' | 'in';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

interface ApiErrorBody {
  error?: string;
  action?: string;
  code?: string;
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: 'no-store' });
  if (response.status === 401) throw new Error('401');
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody;
    const detail = body.error ?? `HTTP ${response.status}`;
    const err = new Error(detail) as Error & ApiErrorBody;
    err.action = body.action;
    err.code = body.code;
    throw err;
  }
  return response.json();
}

interface DbHealth {
  connected?: boolean;
  schemaReady?: boolean;
  schemaError?: string;
  suggestion?: string;
  error?: string;
  code?: string;
  databaseUrl?: string;
}

export default function AdminPage() {
  const [auth, setAuth] = useState<AuthState>('checking');
  const [blobEnabled, setBlobEnabled] = useState(false);

  useEffect(() => {
    getJson<{ authenticated: boolean; blobEnabled: boolean }>('/api/admin/session')
      .then((data) => {
        setBlobEnabled(data.blobEnabled);
        setAuth(data.authenticated ? 'in' : 'out');
      })
      .catch(() => setAuth('out'));
  }, []);

  if (auth === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#202325]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#5ECAD5] border-t-transparent" />
      </div>
    );
  }

  if (auth === 'out') {
    return (
      <LoginScreen
        onLoggedIn={(blob) => {
          setBlobEnabled(blob);
          setAuth('in');
        }}
      />
    );
  }

  return <Dashboard blobEnabled={blobEnabled} onLoggedOut={() => setAuth('out')} />;
}

function LoginScreen({ onLoggedIn }: { onLoggedIn: (blobEnabled: boolean) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Prihlásenie zlyhalo.');
      onLoggedIn(Boolean(data.blobEnabled));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prihlásenie zlyhalo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#202325] px-4">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#5ECAD5]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-40 h-[520px] w-[520px] rounded-full bg-[#1F8E99]/25 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Image
            src={SITE_LOGO_PATH}
            alt={SITE_LOGO_ALT}
            width={SITE_LOGO_INTRINSIC.width}
            height={SITE_LOGO_INTRINSIC.height}
            sizes="60px"
            className="w-[60px]"
            priority
          />
        </div>
        <form onSubmit={submit} className="rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
          <h1 className="text-2xl font-bold text-[#202325]">Administrácia</h1>
          <p className="mt-1 text-sm text-gray-500">Prihláste sa a spravujte formuláre, správy a blog.</p>

          <label className="mt-8 block text-sm font-medium text-gray-700" htmlFor="username">Používateľské meno</label>
          <input
            id="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#5ECAD5]"
          />

          <label className="mt-5 block text-sm font-medium text-gray-700" htmlFor="password">Heslo</label>
          <div className="relative mt-1.5">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-20 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#5ECAD5]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-[#1F8E99]"
            >
              {showPassword ? 'Skryť' : 'Zobraziť'}
            </button>
          </div>

          {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full rounded-xl bg-[#5ECAD5] py-3.5 font-semibold text-white shadow-lg shadow-[#5ECAD5]/30 transition-colors hover:bg-[#4BB8C4] disabled:opacity-60"
          >
            {loading ? 'Prihlasujem…' : 'Prihlásiť sa'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-white/50">
          <Link href="/" className="hover:text-white">← Späť na web</Link>
        </p>
      </div>
    </div>
  );
}

function Dashboard({ blobEnabled, onLoggedOut }: { blobEnabled: boolean; onLoggedOut: () => void }) {
  const [tab, setTab] = useState<Tab>('submissions');
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState({ submissions: true, contacts: true, posts: true });
  const [error, setError] = useState('');
  const [dbHealth, setDbHealth] = useState<DbHealth | null>(null);
  const [schemaMigrating, setSchemaMigrating] = useState(false);

  const handleError = useCallback(
    (err: unknown, label: string) => {
      if (err instanceof Error && err.message === '401') {
        onLoggedOut();
        return;
      }
      const e = err as Error & ApiErrorBody;
      const text = e.message && e.message !== '500' ? e.message : `Nepodarilo sa načítať ${label}.`;
      const action = e.action ? ` ${e.action}` : ' Skontrolujte pripojenie k databáze.';
      setError(`${text}${action}`);
    },
    [onLoggedOut]
  );

  useEffect(() => {
    fetch('/api/health', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data: DbHealth) => setDbHealth(data))
      .catch(() => setDbHealth(null));
  }, []);

  const applyBlogSchema = async () => {
    setSchemaMigrating(true);
    setError('');
    try {
      const response = await fetch('/api/admin/apply-blog-schema', { method: 'POST' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Migrácia zlyhala.');
      const health = await fetch('/api/health', { cache: 'no-store' }).then((r) => r.json());
      setDbHealth(health);
      loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Migrácia zlyhala.');
    } finally {
      setSchemaMigrating(false);
    }
  };

  const loadSubmissions = useCallback(() => {
    getJson<FormSubmission[]>('/api/form-submission')
      .then(setSubmissions)
      .catch((err) => handleError(err, 'formuláre'))
      .finally(() => setLoading((l) => ({ ...l, submissions: false })));
  }, [handleError]);

  const loadContacts = useCallback(() => {
    getJson<ContactSubmission[]>('/api/contact')
      .then(setContacts)
      .catch((err) => handleError(err, 'správy'))
      .finally(() => setLoading((l) => ({ ...l, contacts: false })));
  }, [handleError]);

  const loadPosts = useCallback(() => {
    getJson<BlogPostSummary[]>('/api/blog?all=1')
      .then(setPosts)
      .catch((err) => handleError(err, 'články'))
      .finally(() => setLoading((l) => ({ ...l, posts: false })));
  }, [handleError]);

  useEffect(() => {
    loadSubmissions();
    loadContacts();
    loadPosts();
  }, [loadSubmissions, loadContacts, loadPosts]);

  const logout = async () => {
    await fetch('/api/admin/session', { method: 'DELETE' });
    onLoggedOut();
  };

  const refresh = () => {
    setError('');
    if (tab === 'submissions') loadSubmissions();
    else if (tab === 'contact') loadContacts();
    else loadPosts();
  };

  const recent = (items: { createdAt: string }[]) =>
    items.filter((i) => Date.now() - new Date(i.createdAt).getTime() < WEEK_MS).length;

  const stats = [
    { label: 'Formuláre', value: submissions.length, note: `${recent(submissions)} za posledných 7 dní`, tab: 'submissions' as const },
    { label: 'Správy z kontaktu', value: contacts.length, note: `${recent(contacts)} za posledných 7 dní`, tab: 'contact' as const },
    {
      label: 'Články na blogu',
      value: posts.filter((p) => p.published).length,
      note: `${posts.filter((p) => !p.published).length} rozpísaných konceptov`,
      tab: 'blog' as const,
    },
  ];

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'submissions', label: 'Formuláre', count: submissions.length },
    { key: 'contact', label: 'Kontakty', count: contacts.length },
    { key: 'blog', label: 'Blog', count: posts.length },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7f8]">
      <header className="bg-[#202325]">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Image
            src={SITE_LOGO_PATH}
            alt={SITE_LOGO_ALT}
            width={SITE_LOGO_INTRINSIC.width}
            height={SITE_LOGO_INTRINSIC.height}
            sizes="40px"
            className="w-10"
          />
          <span className="hidden border-l border-white/15 pl-4 text-sm font-medium text-white/60 sm:inline">Administrácia</span>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" className="rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
              Zobraziť web ↗
            </a>
            <button onClick={logout} className="rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
              Odhlásiť sa
            </button>
          </div>
        </div>
      </header>

      <div className="bg-[#202325] pb-20">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Dobrý deň, Michal 👋</h1>
          <p className="mt-1 text-white/60">Tu je prehľad toho, čo sa deje na vašom webe.</p>
        </div>
      </div>

      <main className="mx-auto -mt-14 max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <button
              key={s.label}
              onClick={() => setTab(s.tab)}
              className={`rounded-2xl bg-white p-5 text-left shadow-sm ring-1 transition-all hover:shadow-md ${
                tab === s.tab ? 'ring-2 ring-[#5ECAD5]' : 'ring-black/5'
              }`}
            >
              <p className="text-sm font-medium text-gray-500">{s.label}</p>
              <p className="mt-1 font-['Monda',Arial,sans-serif] text-3xl font-bold text-[#202325]">{s.value}</p>
              <p className="mt-1 text-xs text-gray-400">{s.note}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 mb-6 flex items-center gap-3">
          <nav className="flex gap-1 overflow-x-auto rounded-xl bg-white p-1 shadow-sm ring-1 ring-black/5">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t.key ? 'bg-[#5ECAD5] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t.label}
                <span className={`rounded-full px-1.5 text-xs ${tab === t.key ? 'bg-white/25' : 'bg-gray-100 text-gray-500'}`}>{t.count}</span>
              </button>
            ))}
          </nav>
          <button
            onClick={refresh}
            title="Obnoviť"
            className="ml-auto rounded-xl bg-white p-2.5 text-gray-500 shadow-sm ring-1 ring-black/5 hover:text-[#1F8E99]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" />
            </svg>
          </button>
        </div>

        {dbHealth && (dbHealth.schemaReady === false || !dbHealth.connected) && (
          <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-4 text-sm text-amber-950">
            <p className="font-semibold">Databáza potrebuje nastavenie</p>
            {dbHealth.databaseUrl === 'missing' || dbHealth.code === 'MISSING_URL' ? (
              <>
                <p className="mt-1">
                  Na produkcii chýba premenná <strong>DATABASE_URL</strong>. Bez nej admin nevie načítať články ani ukladať dáta z
                  formulárov.
                </p>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-amber-900">
                  <li>
                    Vercel → váš projekt Kurka → <strong>Storage</strong> → vytvorte alebo pripojte <strong>Postgres</strong> (Neon /
                    Vercel Postgres).
                  </li>
                  <li>
                    Skontrolujte <strong>Settings → Environment Variables</strong>, že existuje <strong>DATABASE_URL</strong> pre
                    Production (pri pripojení DB sa často pridá automaticky).
                  </li>
                  <li>
                    <strong>Redeploy</strong> projektu (Deployments → … → Redeploy).
                  </li>
                  <li>
                    Lokálne: <code className="rounded bg-white/80 px-1">vercel env pull .env.local</code>, potom{' '}
                    <code className="rounded bg-white/80 px-1">npx prisma db push</code> (vytvorí tabuľky).
                  </li>
                </ol>
              </>
            ) : (
              <>
                <p className="mt-1">
                  {dbHealth.schemaError ??
                    dbHealth.suggestion ??
                    dbHealth.error ??
                    'Skontrolujte DATABASE_URL vo Verceli a spustite migráciu schémy.'}
                </p>
                <p className="mt-2 font-mono text-xs rounded-lg border border-amber-200 bg-white/80 px-3 py-2">
                  npm run db:push
                </p>
                <p className="mt-1 text-xs text-amber-800">
                  (Načíta <code className="rounded bg-white/80 px-1">.env.local</code> — Prisma samo nečíta tento súbor.)
                </p>
                {dbHealth.connected && (
                  <button
                    type="button"
                    disabled={schemaMigrating}
                    onClick={() => void applyBlogSchema()}
                    className="mt-3 rounded-lg bg-amber-900 px-4 py-2 text-sm font-medium text-white hover:bg-amber-950 disabled:opacity-60"
                  >
                    {schemaMigrating ? 'Aktualizujem…' : 'Aktualizovať blog tabuľku teraz'}
                  </button>
                )}
              </>
            )}
            <p className="mt-2 text-xs text-amber-800">
              Podrobnejší stav:{' '}
              <Link href="/admin/database-status" className="font-semibold underline">
                /admin/database-status
              </Link>
              . Po nastavení obnovte stránku.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-5 flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
            <button onClick={() => setError('')} className="ml-4 text-red-400 hover:text-red-600">×</button>
          </div>
        )}

        {tab === 'submissions' && <SubmissionsView submissions={submissions} loading={loading.submissions} />}
        {tab === 'contact' && <ContactsView contacts={contacts} loading={loading.contacts} />}
        {tab === 'blog' && <BlogManager posts={posts} loading={loading.posts} blobEnabled={blobEnabled} onChanged={loadPosts} />}
      </main>
    </div>
  );
}
