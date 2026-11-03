'use client';

import { useEffect, useState } from 'react';

export interface FormSubmission {
  id: string;
  financialLiteracy: string;
  products: string[];
  interests: string;
  topics: string[];
  saveOnMortgage: boolean;
  saveOnInsurance: boolean;
  incomeSecurity: boolean;
  kidsFuture: boolean;
  betterReturns: boolean;
  reviewExistingContracts: boolean;
  skFinancialLiteracy: string;
  name: string;
  surname: string;
  phone: string | null;
  email: string | null;
  createdAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  surname: string;
  phone: string | null;
  email: string;
  message: string | null;
  createdAt: string;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleString('sk-SK', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const LITERACY_STYLES: Record<string, string> = {
  Skvelá: 'bg-green-100 text-green-800',
  Dobrá: 'bg-sky-100 text-sky-800',
  Priemerná: 'bg-amber-100 text-amber-800',
  Zlá: 'bg-orange-100 text-orange-800',
};

const literacyStyle = (value: string) => LITERACY_STYLES[value] ?? 'bg-red-100 text-red-800';

function initials(name: string, surname: string) {
  return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
}

function Avatar({ name, surname }: { name: string; surname: string }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5ECAD5]/15 text-xs font-bold text-[#1F8E99]">
      {initials(name, surname)}
    </span>
  );
}

function SearchBar({ value, onChange, total, shown, placeholder }: { value: string; onChange: (v: string) => void; total: number; shown: number; placeholder: string }) {
  return (
    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative w-full sm:max-w-sm">
        <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border-none bg-white py-2.5 pl-9 pr-9 text-sm shadow-sm ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-[#5ECAD5]"
        />
        {value && (
          <button onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Vymazať">
            ×
          </button>
        )}
      </div>
      {value && <span className="text-sm text-gray-500">Zobrazené {shown} z {total}</span>}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-2xl bg-white px-6 py-16 text-center text-gray-500 shadow-sm ring-1 ring-black/5">{text}</div>;
}

function LoadingRows() {
  return (
    <div className="space-y-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-16 animate-pulse rounded-xl bg-white" />
      ))}
    </div>
  );
}

function ContactLines({ phone, email }: { phone: string | null; email: string | null }) {
  return (
    <div className="space-y-0.5 text-sm">
      {phone && (
        <a href={`tel:${phone}`} onClick={(e) => e.stopPropagation()} className="block text-gray-700 hover:text-[#1F8E99]">
          {phone}
        </a>
      )}
      {email && (
        <a href={`mailto:${email}`} onClick={(e) => e.stopPropagation()} className="block truncate text-gray-500 hover:text-[#1F8E99]">
          {email}
        </a>
      )}
    </div>
  );
}

function Modal({ title, subtitle, onClose, children, footer }: { title: string; subtitle?: string; onClose: () => void; children: React.ReactNode; footer: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#202325]/60 p-3 backdrop-blur-sm sm:p-6" onClick={onClose}>
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-7 sm:py-5">
          <div>
            <h3 className="text-lg font-bold text-[#202325] sm:text-xl">{title}</h3>
            {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-2xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-600" aria-label="Zavrieť">
            ×
          </button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">{children}</div>
        <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">{footer}</div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</h4>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-gray-50 px-4 py-3">
      <p className="text-xs text-gray-500">{label}</p>
      <div className="mt-0.5 font-medium text-[#202325]">{children}</div>
    </div>
  );
}

function CopyContactButton({ phone, email }: { phone: string | null; email: string | null }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        const text = [phone && `Telefón: ${phone}`, email && `E-mail: ${email}`].filter(Boolean).join('\n');
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      className="rounded-lg bg-[#5ECAD5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4BB8C4]"
    >
      {copied ? 'Skopírované ✓' : 'Kopírovať kontakt'}
    </button>
  );
}

const closeButton = (onClose: () => void) => (
  <button onClick={onClose} className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200">
    Zavrieť
  </button>
);

export function SubmissionsView({ submissions, loading }: { submissions: FormSubmission[]; loading: boolean }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<FormSubmission | null>(null);

  const term = search.toLowerCase();
  const filtered = submissions.filter((s) =>
    [s.name, s.surname, s.email, s.phone].filter(Boolean).join(' ').toLowerCase().includes(term)
  );

  return (
    <div>
      <SearchBar value={search} onChange={setSearch} total={submissions.length} shown={filtered.length} placeholder="Hľadať podľa mena, e-mailu alebo telefónu…" />

      {loading ? (
        <LoadingRows />
      ) : filtered.length === 0 ? (
        <EmptyState text={search ? 'Žiadny formulár nevyhovuje vyhľadávaniu.' : 'Zatiaľ neprišiel žiadny formulár.'} />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="px-5 py-3">Klient</th>
                <th className="hidden px-5 py-3 md:table-cell">Kontakt</th>
                <th className="hidden px-5 py-3 sm:table-cell">Gramotnosť</th>
                <th className="hidden px-5 py-3 lg:table-cell">Hlavný záujem</th>
                <th className="hidden px-5 py-3 sm:table-cell">Dátum</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((s) => (
                <tr key={s.id} onClick={() => setSelected(s)} className="cursor-pointer transition-colors hover:bg-[#5ECAD5]/5">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} surname={s.surname} />
                      <div className="min-w-0">
                        <p className="font-medium text-[#202325]">{s.name} {s.surname}</p>
                        <p className="text-xs text-gray-400 sm:hidden">{formatDate(s.createdAt)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden max-w-[220px] px-5 py-3.5 md:table-cell">
                    <ContactLines phone={s.phone} email={s.email} />
                  </td>
                  <td className="hidden px-5 py-3.5 sm:table-cell">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${literacyStyle(s.financialLiteracy)}`}>
                      {s.financialLiteracy}
                    </span>
                  </td>
                  <td className="hidden max-w-[240px] truncate px-5 py-3.5 text-sm text-gray-600 lg:table-cell">{s.interests}</td>
                  <td className="hidden whitespace-nowrap px-5 py-3.5 text-sm text-gray-500 sm:table-cell">{formatDate(s.createdAt)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-sm font-semibold text-[#1F8E99]">Detail →</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <SubmissionModal submission={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function SubmissionModal({ submission: s, onClose }: { submission: FormSubmission; onClose: () => void }) {
  const goals = [
    { label: 'Ušetriť na hypotéke', value: s.saveOnMortgage },
    { label: 'Ušetriť na poistných zmluvách', value: s.saveOnInsurance },
    { label: 'Zabezpečený príjem pri zdravotných problémoch', value: s.incomeSecurity },
    { label: 'Budúcnosť detí', value: s.kidsFuture },
    { label: 'Lepšie zhodnocovanie', value: s.betterReturns },
    { label: 'Kontrola existujúcich zmlúv', value: s.reviewExistingContracts },
  ].filter((g) => g.value);

  return (
    <Modal
      title={`${s.name} ${s.surname}`}
      subtitle={`Formulár odoslaný ${formatDate(s.createdAt)}`}
      onClose={onClose}
      footer={
        <>
          {closeButton(onClose)}
          <CopyContactButton phone={s.phone} email={s.email} />
        </>
      }
    >
      <Section title="Kontakt">
        <div className="grid gap-2 sm:grid-cols-2">
          <Field label="Telefón">{s.phone ? <a href={`tel:${s.phone}`} className="hover:text-[#1F8E99]">{s.phone}</a> : '—'}</Field>
          <Field label="E-mail">{s.email ? <a href={`mailto:${s.email}`} className="break-all hover:text-[#1F8E99]">{s.email}</a> : '—'}</Field>
        </div>
      </Section>

      <Section title="Finančná gramotnosť">
        <div className="grid gap-2 sm:grid-cols-2">
          <Field label="Vlastné hodnotenie">
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-semibold ${literacyStyle(s.financialLiteracy)}`}>{s.financialLiteracy}</span>
          </Field>
          {s.skFinancialLiteracy && <Field label="Gramotnosť na Slovensku">{s.skFinancialLiteracy}</Field>}
        </div>
      </Section>

      <Section title="Aktuálne využívané produkty">
        {s.products.length ? (
          <div className="flex flex-wrap gap-2">
            {s.products.map((p) => (
              <span key={p} className="rounded-full bg-[#202325] px-3 py-1 text-sm text-white">{p}</span>
            ))}
          </div>
        ) : (
          <p className="text-sm italic text-gray-400">Žiadne produkty</p>
        )}
      </Section>

      <Section title="Hlavný záujem">
        <p className="rounded-xl border-l-4 border-[#5ECAD5] bg-[#5ECAD5]/5 px-4 py-3 font-medium text-[#202325]">{s.interests}</p>
      </Section>

      <Section title="Čo by chcel/a riešiť">
        {goals.length ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {goals.map((g) => (
              <li key={g.label} className="flex items-center gap-2.5 rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-[#202325]">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5ECAD5] text-[11px] text-white">✓</span>
                {g.label}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm italic text-gray-400">Žiadne vybrané záujmy</p>
        )}
      </Section>
    </Modal>
  );
}

export function ContactsView({ contacts, loading }: { contacts: ContactSubmission[]; loading: boolean }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ContactSubmission | null>(null);

  const term = search.toLowerCase();
  const filtered = contacts.filter((c) =>
    [c.name, c.surname, c.email, c.phone, c.message].filter(Boolean).join(' ').toLowerCase().includes(term)
  );

  return (
    <div>
      <SearchBar value={search} onChange={setSearch} total={contacts.length} shown={filtered.length} placeholder="Hľadať v správach…" />

      {loading ? (
        <LoadingRows />
      ) : filtered.length === 0 ? (
        <EmptyState text={search ? 'Žiadna správa nevyhovuje vyhľadávaniu.' : 'Zatiaľ neprišla žiadna správa.'} />
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className="flex w-full items-start gap-4 rounded-2xl bg-white px-5 py-4 text-left shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md"
            >
              <Avatar name={c.name} surname={c.surname} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="font-medium text-[#202325]">{c.name} {c.surname}</p>
                  <p className="text-xs text-gray-400">{formatDate(c.createdAt)}</p>
                </div>
                <p className="text-sm text-gray-500">{[c.phone, c.email].filter(Boolean).join(' • ')}</p>
                {c.message && <p className="mt-1.5 line-clamp-2 text-sm text-gray-700">{c.message}</p>}
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <Modal
          title={`${selected.name} ${selected.surname}`}
          subtitle={`Správa odoslaná ${formatDate(selected.createdAt)}`}
          onClose={() => setSelected(null)}
          footer={
            <>
              {closeButton(() => setSelected(null))}
              <a href={`mailto:${selected.email}`} className="rounded-lg border border-gray-300 px-5 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-white">
                Odpovedať e-mailom
              </a>
              <CopyContactButton phone={selected.phone} email={selected.email} />
            </>
          }
        >
          <Section title="Kontakt">
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="Telefón">{selected.phone ? <a href={`tel:${selected.phone}`} className="hover:text-[#1F8E99]">{selected.phone}</a> : '—'}</Field>
              <Field label="E-mail"><a href={`mailto:${selected.email}`} className="break-all hover:text-[#1F8E99]">{selected.email}</a></Field>
            </div>
          </Section>
          <Section title="Správa">
            <p className="whitespace-pre-wrap rounded-xl border-l-4 border-[#5ECAD5] bg-[#5ECAD5]/5 px-4 py-3 text-[#202325]">
              {selected.message || <span className="italic text-gray-400">Bez správy</span>}
            </p>
          </Section>
        </Modal>
      )}
    </div>
  );
}
