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
  is_sold: boolean;
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

const TECH_MAP: Record<string, string[]> = {
  all: ["React", "Python", "Node.js", "Django", "Next.js", "Tailwind CSS", "PostgreSQL"],
  website: ["React", "Next.js", "Vue", "Tailwind CSS", "Node.js", "PHP", "Django"],
  telegram_bot: ["Python", "Aiogram", "Telebot", "Node.js", "Telegraf", "Go"],
  mobile_app: ["Flutter", "React Native", "Swift", "Kotlin", "Java"],
  saas: ["React", "Next.js", "Django", "PostgreSQL", "AWS", "Stripe"],
  ecommerce: ["Shopify", "WooCommerce", "Next.js", "Django", "Node.js"],
  other: ["Figma", "UI/UX", "Marketing", "SEO"],
};

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

export function StartupCard({ s }: { s: Startup }) {
  const techList = s.tech_stack.split(",").map((t) => t.trim()).filter(Boolean);
  const badge = TYPE_BADGE[s.project_type] ?? TYPE_BADGE.other;

  return (
    <article
      id={`startup-card-${s.id}`}
      className="group relative flex flex-col rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/8 dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-indigo-800"
    >
      {/* Premium banner */}
      {s.is_premium && !s.is_sold && (
        <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
      )}

      {/* Sotildi banner (yuqori chiziq) */}
      {s.is_sold && (
        <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-red-500 to-rose-600" />
      )}

      {/* Sotildi badge (absolyut, yuqori-o'ng) */}
      {s.is_sold && (
        <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-500 to-rose-600 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-red-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
            <path fillRule="evenodd" d="M4.5 1A1.5 1.5 0 0 0 3 2.5V3H2a1 1 0 0 0 0 2h.026l.432 7.772A2 2 0 0 0 4.455 14.5h7.09a2 2 0 0 0 1.997-1.728L13.974 5H14a1 1 0 1 0 0-2h-1v-.5A1.5 1.5 0 0 0 11.5 1h-7Zm0 1.5h7V3h-7v-.5Zm-.457 3h7.914l-.406 7.3a.5.5 0 0 1-.499.45h-7.09a.5.5 0 0 1-.499-.45L4.043 5.5Z" clipRule="evenodd" />
          </svg>
          Sotildi
        </div>
      )}

      <div className="flex flex-1 flex-col p-3 md:p-5">
        {/* Header */}
        <div className="mb-2 md:mb-4 flex items-start gap-2 md:gap-3">
          <div className="flex h-9 w-9 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-indigo-50 text-base md:text-xl dark:from-zinc-800 dark:to-indigo-900/30">
            {getProjectIcon(s.project_type)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 md:mb-1.5 flex flex-wrap items-center gap-1 md:gap-1.5">
              <span className={`rounded-md px-1.5 py-0.5 md:px-2 md:py-0.5 text-[10px] md:text-xs font-medium ${badge}`}>
                {s.project_type_display}
              </span>
              {s.is_premium && (
                <span className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-1.5 py-0.5 md:px-2 md:py-0.5 text-[10px] md:text-xs font-semibold text-white">
                  ⭐ Premium
                </span>
              )}
            </div>
            <h3 className="line-clamp-2 text-sm md:text-lg font-semibold leading-snug text-zinc-900 dark:text-white">
              {s.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="mb-2 md:mb-4 line-clamp-2 flex-1 text-[10px] md:text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {s.description}
        </p>

        {/* Tech badges */}
        <div className="mb-2 md:mb-4 flex flex-wrap gap-1">
          {techList.slice(0, 4).map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] md:text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
            >
              {t}
            </span>
          ))}
          {techList.length > 4 && (
            <span className="rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] md:text-xs text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800">
              +{techList.length - 4}
            </span>
          )}
        </div>

        {/* Dinamik Havolalar (Loyiha turiga qarab) */}
        <div className="mb-3 md:mb-4 flex flex-wrap gap-1.5 md:gap-2">
          {s.project_type === "telegram_bot" && s.bot_username && (
            <a
              href={`https://t.me/${s.bot_username.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-1.5 py-1 text-[10px] md:px-2 md:py-1.5 md:text-xs font-semibold text-sky-600 transition hover:bg-sky-100 dark:bg-sky-900/30 dark:text-sky-400 dark:hover:bg-sky-900/50"
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
                  className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-1 text-[10px] md:px-2 md:py-1.5 md:text-xs font-semibold text-emerald-600 transition hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                >
                  ▶️ Play Store
                </a>
              )}
              {s.app_store_link && (
                <a
                  href={s.app_store_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-1.5 py-1 text-[10px] md:px-2 md:py-1.5 md:text-xs font-semibold text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  🍏 App Store
                </a>
              )}
            </>
          )}

          {s.project_type !== "telegram_bot" && s.project_type !== "mobile_app" && (
            <>

              {s.github_link && (
                <a
                  href={s.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-1.5 py-1 text-[10px] md:px-2 md:py-1.5 md:text-xs font-semibold text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  💻 GitHub
                </a>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between gap-2 border-t pt-3 md:pt-4 ${
          s.is_sold
            ? "border-red-100 dark:border-red-900/30"
            : "border-zinc-100 dark:border-zinc-800"
        }`}>
          {s.is_sold ? (
            <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-red-500 dark:text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 md:h-4 md:w-4">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v4.59L7.3 9.24a.75.75 0 0 0-1.1 1.02l3.25 3.5a.75.75 0 0 0 1.1 0l3.25-3.5a.75.75 0 1 0-1.1-1.02l-1.95 2.1V6.75Z" clipRule="evenodd" />
              </svg>
              Sotildi
            </span>
          ) : (
            <span className="text-base md:text-xl font-bold text-zinc-900 dark:text-white">
              {formatPrice(s.price)}
            </span>
          )}
          <Link
            href={`/startups/${s.id}`}
            id={`startup-details-${s.id}`}
            className={`inline-flex h-7 md:h-8 items-center justify-center rounded-lg border px-2.5 md:px-3 text-[10px] md:text-xs font-medium transition-all ${
              s.is_sold
                ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50"
                : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-300"
            }`}
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter States
  const [sortOrder, setSortOrder] = useState<"newest" | "price_asc" | "price_desc">("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isProfitable, setIsProfitable] = useState(false);
  const [selectedTech, setSelectedTech] = useState<string[]>([]);

  // Client-side filtrlash va saralash
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let result = startups.filter((s) => {
      const matchCat = category === "all" || s.project_type === category;
      const matchQ   = !q || (
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tech_stack.toLowerCase().includes(q)
      );

      // Narx
      const priceNum = parseFloat(s.price);
      const matchMinPrice = minPrice === "" || (!isNaN(priceNum) && priceNum >= parseFloat(minPrice));
      const matchMaxPrice = maxPrice === "" || (!isNaN(priceNum) && priceNum <= parseFloat(maxPrice));

      // Daromad keltiruvchi (Premium deb olamiz)
      const matchProfitable = !isProfitable || s.is_premium;

      // Texnologiyalar
      const matchTech = selectedTech.length === 0 || selectedTech.some(t => s.tech_stack.toLowerCase().includes(t.toLowerCase()));

      return matchCat && matchQ && matchMinPrice && matchMaxPrice && matchProfitable && matchTech;
    });

    // Saralash
    if (sortOrder === "price_asc") {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortOrder === "price_desc") {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [startups, query, category, minPrice, maxPrice, isProfitable, selectedTech, sortOrder]);

  const toggleTech = (tech: string) => {
    setSelectedTech(prev => 
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">

      {/* ── Qidiruv + Filtr panel ── */}
      <div className="sticky top-16 z-30 -mx-4 mb-4 md:mb-8 bg-white/95 px-4 pb-3 md:pb-4 pt-4 md:pt-5 backdrop-blur-xl dark:bg-zinc-950/95 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">

        {/* Qidiruv input + Kengaytirilgan Filtr */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
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
              placeholder="Loyiha nomi, texnologiya..."
              className="h-10 md:h-12 w-full rounded-xl border border-zinc-200 bg-white pl-11 pr-4 text-xs md:text-sm text-zinc-900 placeholder-zinc-400 shadow-sm outline-none transition-all hover:border-zinc-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500 dark:hover:border-zinc-600 dark:focus:border-indigo-500"
            />
            {/* Natija soni */}
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] md:text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 hidden sm:block">
              {filtered.length} ta
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="Kengaytirilgan filtrlar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 md:h-6 md:w-6">
              <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.591L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Kategoriya tugmalari — scroll qilish mumkin */}
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-2 [&::-webkit-scrollbar]:hidden scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat.value;
            return (
              <button
                key={cat.value}
                id={`filter-${cat.value}`}
                onClick={() => {
                  setCategory(cat.value);
                  setSelectedTech([]); // Kategoriya o'zgarganda tanlangan texnologiyalarni tozalash
                }}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs md:px-3.5 md:py-1.5 md:text-sm font-medium transition-all duration-150 ${
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filtered.length === 0 ? (
          <EmptyState query={query} category={category} />
        ) : (
          filtered.map((s) => <StartupCard key={s.id} s={s} />)
        )}
      </div>

      {/* ── Advanced Filter Modal / Bottom Sheet ── */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/40 backdrop-blur-sm md:items-center">
          {/* Orqa fonni bosganda yopish */}
          <div 
            className="absolute inset-0" 
            onClick={() => setIsFilterOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-lg rounded-t-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 md:rounded-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto transform transition-all">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Kengaytirilgan Filtrlar</h3>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>

            {/* Saralash */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Saralash
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "newest", label: "Eng yangilari" },
                  { value: "price_asc", label: "Arzondan qimmatga" },
                  { value: "price_desc", label: "Qimmatdan arzonga" }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortOrder(opt.value as any)}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                      sortOrder === opt.value
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                        : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Narx oralig'i */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Narx oralig'i (USD)
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  placeholder="Min narx" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-indigo-500" 
                />
                <span className="text-zinc-400">-</span>
                <input 
                  type="number" 
                  placeholder="Max narx" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-indigo-500" 
                />
              </div>
            </div>

            {/* Texnologiyalar (Dinamik) */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Texnologiyalar
              </label>
              <div className="flex flex-wrap gap-2">
                {(TECH_MAP[category] || TECH_MAP.all).map((tech) => (
                  <button
                    key={tech}
                    onClick={() => toggleTech(tech)}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                      selectedTech.includes(tech)
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                        : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            {/* Qoshimcha parametrlar */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isProfitable}
                  onChange={(e) => setIsProfitable(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600 dark:border-zinc-700 dark:bg-zinc-900 dark:checked:bg-indigo-500" 
                />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Daromad keltiruvchi loyihalar (Premium)
                </span>
              </label>
            </div>

            {/* Tugmalar */}
            <div className="mt-2 flex gap-3">
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="w-full rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Yopish
              </button>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Qo'llash
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
