import type { Metadata } from "next";
import MarketplaceClient, { type Startup } from "./components/marketplace-client";

// ─── SEO ──────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "StartUp Market — IT loyihalar bozori",
  description:
    "O'zbekistondagi eng yirik B2B IT loyihalar va startaplar bozori. Tayyor biznes xarid qiling yoki o'z loyihangizni soting.",
  keywords: "startup, IT loyiha, sotish, xarid, O'zbekiston, b2b marketplace",
};

// ─── Ma'lumot olish ────────────────────────────────────────────────────────────

async function fetchStartups(): Promise<Startup[]> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/startups/", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// ─── Asosiy sahifa (async SSR) ─────────────────────────────────────────────────

export default async function Home() {
  const startups = await fetchStartups();

  return (
    <div className="flex flex-col">

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative overflow-hidden bg-white dark:bg-zinc-950">

        {/* Orqa fon blobi */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-48 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-100 via-violet-100 to-purple-100 opacity-50 blur-3xl dark:from-indigo-950 dark:via-violet-950 dark:to-purple-950 dark:opacity-30" />
          <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-gradient-to-bl from-sky-100 to-indigo-100 opacity-40 blur-2xl dark:from-sky-950 dark:to-indigo-950 dark:opacity-20" />
          <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-gradient-to-tr from-violet-100 to-pink-100 opacity-30 blur-2xl dark:from-violet-950 dark:to-pink-950 dark:opacity-15" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 sm:pb-12 sm:pt-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">

            {/* Tepa pill badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-4 py-1.5 backdrop-blur dark:border-indigo-800/60 dark:bg-indigo-950/50">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                O&apos;zbekistondagi #1 IT biznes bozori
              </span>
            </div>

            {/* Sarlavha */}
            <h1 className="mb-5 text-4xl font-extrabold leading-[1.15] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-white">
              IT loyihangizni{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                  soting
                </span>
                {/* Pastki chiziq aksenti */}
                <svg
                  aria-hidden
                  viewBox="0 0 200 8"
                  className="absolute -bottom-2 left-0 w-full"
                  preserveAspectRatio="none"
                >
                  <path d="M0 6 Q50 0 100 5 Q150 10 200 4" stroke="url(#u)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="u" x1="0" x2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>{" "}
              yoki tayyor biznes{" "}
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                xarid qiling
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
              Minglab tayyor IT loyihalar, startaplar va raqamli bizneslar
              bir joyda. Xavfsiz va tez savdo platformasi.
            </p>

            {/* CTA tugma — faqat bitta: Startaplarni ko'rish */}
            <div className="flex items-center justify-center">
              <a
                href="#listings"
                id="hero-browse-btn"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:opacity-90 hover:shadow-xl hover:shadow-indigo-500/40 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18" className="h-[18px] w-[18px] shrink-0">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
                </svg>
                Startaplarni ko&apos;rish
              </a>
            </div>
          </div>
        </div>

        {/* ── Stats strip ── */}
        <div className="relative border-t border-zinc-100 bg-gradient-to-r from-zinc-50 via-white to-zinc-50 dark:border-zinc-800 dark:from-zinc-900/60 dark:via-zinc-950 dark:to-zinc-900/60">
          <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-zinc-200 dark:divide-zinc-800">
            {[
              { label: "Faol e'lonlar",          value: `${startups.length}+`,      icon: "📋" },
              { label: "Muvaffaqiyatli savdolar", value: "85+",                     icon: "🤝" },
              { label: "Ro'yxatdan o'tgan",       value: "500+",                    icon: "👥" },
            ].map((stat) => (
              <div key={stat.label} className="px-4 py-4 text-center sm:px-8">
                <div className="mb-1 text-xl">{stat.icon}</div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ MARKETPLACE ══════════════════ */}
      <section
        id="listings"
        className="bg-white pt-10 dark:bg-zinc-950"
      >
        {/* Bo'lim sarlavhasi */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Bozor
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              So&apos;nggi e&apos;lonlar
            </h2>
          </div>
        </div>

        {/* Client komponent — qidiruv + filtr + grid */}
        <MarketplaceClient startups={startups} />
      </section>

    </div>
  );
}
