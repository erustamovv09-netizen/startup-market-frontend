"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ─── Turlar ───────────────────────────────────────────────────────────────────

export interface Startup {
  id: number;
  title: string;
  description: string;
  price: string;
  tech_stack: string;
  project_type: string;
  project_type_display: string;
  demo_link: string | null;
  github_link: string | null;
  bot_username?: string | null;
  play_store_link?: string | null;
  app_store_link?: string | null;
  is_premium: boolean;
  created_at: string;
  owner_info: { id: number; username: string; email: string };
}

// ─── Kategoriyalar ────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: "all",          label: "Barchasi",      icon: "✦" },
  { value: "website",      label: "Veb-sayt",       icon: "🌐" },
  { value: "telegram_bot", label: "Telegram Bot",   icon: "🤖" },
  { value: "mobile_app",   label: "Mobil ilova",    icon: "📱" },
  { value: "saas",         label: "SaaS",           icon: "☁️" },
  { value: "ecommerce",    label: "E-Commerce",     icon: "🛒" },
  { value: "other",        label: "Boshqa",         icon: "💡" },
];

// ─── Yordamchi funksiyalar ────────────────────────────────────────────────────

function formatPrice(price: string): string {
  const num = parseFloat(price);
  if (isNaN(num)) return price;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
}

function getProjectIcon(type: string): string {
  const icons: Record<string, string> = {
    website: "🌐", telegram_bot: "🤖", mobile_app: "📱",
    saas: "☁️", ecommerce: "🛒", dashboard: "📊", api: "⚙️", other: "💡",
  };
  return icons[type] ?? "💡";
}

const TYPE_BADGE: Record<string, string> = {
  website:      "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  telegram_bot: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  mobile_app:   "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  saas:         "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  ecommerce:    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  dashboard:    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  other:        "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

// ─── Startup kartasi ──────────────────────────────────────────────────────────

function StartupCard({ s }: { s: Startup }) {
  const techList = s.tech_stack.split(",").map((t) => t.trim()).filter(Boolean);
  const badge = TYPE_BADGE[s.project_type] ?? TYPE_BADGE.other;

  return (
    <article
      id={`startup-card-${s.id}`}
      className="group relative flex flex-col rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/8 dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-indigo-800"
    >
      {/* Premium banner */}
      {s.is_premium && (
        <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
      )}

      <div className="flex flex-1 flex-col p-5">
        {/* Header */}
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-indigo-50 text-xl dark:from-zinc-800 dark:to-indigo-900/30">
            {getProjectIcon(s.project_type)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
              <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${badge}`}>
                {s.project_type_display}
              </span>
              {s.is_premium && (
                <span className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-2 py-0.5 text-xs font-semibold text-white">
                  ⭐ Premium
                </span>
              )}
            </div>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-900 dark:text-white">
              {s.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-2 flex-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {s.description}
        </p>

        {/* Tech badges */}
        <div className="mb-4 flex flex-wrap gap-1">
          {techList.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
            >
              {t}
            </span>
          ))}
          {techList.length > 4 && (
            <span className="rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-xs text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800">
              +{techList.length - 4}
            </span>
          )}
        </div>

        {/* Dinamik Havolalar (Loyiha turiga qarab) */}
        <div className="mb-4 flex flex-wrap gap-2">
          {s.project_type === "telegram_bot" && s.bot_username && (
            <a
              href={`https://t.me/${s.bot_username.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-1.5 text-xs font-semibold text-sky-600 transition hover:bg-sky-100 dark:bg-sky-900/30 dark:text-sky-400 dark:hover:bg-sky-900/50"
            >
              🤖 Botga o'tish
            </a>
          )}

          {s.project_type === "mobile_app" && (
            <>
              {s.play_store_link && (
                <a
                  href={s.play_store_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                >
                  ▶️ Play Store
                </a>
              )}
              {s.app_store_link && (
                <a
                  href={s.app_store_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  🍏 App Store
                </a>
              )}
            </>
          )}

          {s.project_type !== "telegram_bot" && s.project_type !== "mobile_app" && (
            <>
              {s.demo_link && (
                <a
                  href={s.demo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                >
                  🌐 Jonli Demo
                </a>
              )}
              {s.github_link && (
                <a
                  href={s.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  💻 GitHub
                </a>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <span className="text-lg font-bold text-zinc-900 dark:text-white">
            {formatPrice(s.price)}
          </span>
          <Link
            href={`/startups/${s.id}`}
            id={`startup-details-${s.id}`}
            className="inline-flex h-8 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-xs font-medium text-zinc-700 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-300"
          >
            Batafsil →
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─── Bo'sh holat ──────────────────────────────────────────────────────────────

function EmptyState({ query, category }: { query: string; category: string }) {
  const isFiltered = query || category !== "all";
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 py-20 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
      <div className="mb-4 text-5xl">{isFiltered ? "🔍" : "📭"}</div>
      <h3 className="mb-2 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
        {isFiltered ? "Natija topilmadi" : "Hozircha e'lon yo'q"}
      </h3>
      <p className="mb-6 max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
        {isFiltered
          ? `"${query || CATEGORIES.find(c => c.value === category)?.label}" bo'yicha e'lon topilmadi. Boshqa so'z yoki kategoriya sinab ko'ring.`
          : "Birinchi bo'lib loyihangizni joylashtiring va xaridorlarni jalb qiling."}
      </p>
      {isFiltered ? (
        <button
          onClick={() => window.location.href = "/"}
          className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        >
          Filterni tozalash
        </button>
      ) : (
        <Link
          href="/create"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          E&apos;lon berish →
        </Link>
      )}
    </div>
  );
}

// ─── Asosiy Client Component ──────────────────────────────────────────────────

export default function MarketplaceClient({ startups }: { startups: Startup[] }) {
  const [query, setQuery]       = useState("");
  const [category, setCategory] = useState("all");

  // Client-side filtrlash
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return startups.filter((s) => {
      const matchCat = category === "all" || s.project_type === category;
      const matchQ   = !q || (
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tech_stack.toLowerCase().includes(q)
      );
      return matchCat && matchQ;
    });
  }, [startups, query, category]);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">

      {/* ── Qidiruv + Filtr panel ── */}
      <div className="sticky top-16 z-30 -mx-4 mb-8 bg-white/95 px-4 pb-4 pt-5 backdrop-blur-xl dark:bg-zinc-950/95 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">

        {/* Qidiruv input */}
        <div className="relative mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            width="18" height="18"
            className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] shrink-0 -translate-y-1/2 text-zinc-400"
          >
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
          </svg>
          <input
            id="marketplace-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Loyiha nomi, texnologiya bo'yicha qidiring..."
            className="h-12 w-full rounded-xl border border-zinc-200 bg-white pl-11 pr-4 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm outline-none transition-all hover:border-zinc-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500 dark:hover:border-zinc-600 dark:focus:border-indigo-500"
          />
          {/* Natija soni */}
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {filtered.length} ta
          </span>
        </div>

        {/* Kategoriya tugmalari — scroll qilish mumkin */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat.value;
            return (
              <button
                key={cat.value}
                id={`filter-${cat.value}`}
                onClick={() => setCategory(cat.value)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "border-indigo-500 bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Ajratuvchi chiziq */}
        <div className="mt-4 border-b border-zinc-100 dark:border-zinc-800" />
      </div>

      {/* ── Kartalar Grid ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <EmptyState query={query} category={category} />
        ) : (
          filtered.map((s) => <StartupCard key={s.id} s={s} />)
        )}
      </div>
    </section>
  );
}
