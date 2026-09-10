import { API_BASE_URL } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// ─── Django API turi ──────────────────────────────────────────────────────────

interface Startup {
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
  owner_info: {
    id: number;
    username: string;
    email: string;
  };
}

// ─── Params turi ─────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ id: string }>;
}

// ─── Dynamic Metadata ─────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${API_BASE_URL}/api/startups/${id}/`, {
      cache: "no-store",
    });
    if (!res.ok) return { title: "Startup topilmadi" };
    const startup: Startup = await res.json();
    return {
      title: `${startup.title} — StartUp Market`,
      description: startup.description.slice(0, 160),
    };
  } catch {
    return { title: "StartUp Market" };
  }
}

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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getProjectIcon(type: string): string {
  const icons: Record<string, string> = {
    bot: "🤖",
    website: "🌐",
    mobile: "📱",
    saas: "☁️",
    ecommerce: "🛒",
    dashboard: "📊",
    api: "⚙️",
  };
  return icons[type.toLowerCase()] ?? "💡";
}

const typeColors: Record<string, string> = {
  bot: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  website: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  mobile: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  saas: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  ecommerce: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  dashboard: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  api: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

// ─── Asosiy sahifa (async SSR) ────────────────────────────────────────────────

export default async function StartupDetailPage({ params }: Props) {
  const { id } = await params;

  // Django dan bitta startup olish
  let startup: Startup;
  try {
    const res = await fetch(`${API_BASE_URL}/api/startups/${id}/`, {
      cache: "no-store",
    });
    if (res.status === 404) notFound();
    if (!res.ok) throw new Error(`API xatoligi: ${res.status}`);
    startup = await res.json();
  } catch {
    notFound();
  }

  const techList = startup.tech_stack
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const typeKey = startup.project_type.toLowerCase();
  const badgeColor =
    typeColors[typeKey] ?? "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950/10">

      {/* Fon dekorativ elementlar */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 right-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 opacity-40 blur-3xl dark:from-indigo-950 dark:to-violet-950 dark:opacity-20" />
        <div className="absolute bottom-20 left-1/4 h-64 w-64 rounded-full bg-gradient-to-tr from-sky-100 to-indigo-100 opacity-30 blur-2xl dark:from-sky-950 dark:to-indigo-950 dark:opacity-15" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">

        {/* ── Orqaga qaytish ── */}
        <Link
          href="/"
          id="back-to-home"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
              clipRule="evenodd"
            />
          </svg>
          Orqaga qaytish
        </Link>

        {/* ── Asosiy karta ── */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xl shadow-zinc-900/5 dark:border-zinc-800/80 dark:bg-zinc-900">

          {/* Gradient aksent chizig'i */}
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

          <div className="p-6 sm:p-8 lg:p-10">

            {/* ── Sarlavha bloki ── */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

              {/* Chap: icon + sarlavha */}
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 text-3xl shadow-sm dark:from-indigo-900/30 dark:to-violet-900/30">
                  {getProjectIcon(startup.project_type)}
                </div>
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${badgeColor}`}>
                      {startup.project_type_display}
                    </span>
                    {startup.is_premium && (
                      <span className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                        ⭐ Premium
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold leading-snug text-zinc-900 dark:text-white sm:text-3xl">
                    {startup.title}
                  </h1>
                </div>
              </div>

              {/* O'ng: narx */}
              <div className="shrink-0 text-right">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Narx
                </p>
                <p className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                  {formatPrice(startup.price)}
                </p>
              </div>
            </div>

            {/* ── Ajratuvchi ── */}
            <div className="mb-8 border-t border-zinc-100 dark:border-zinc-800" />

            {/* ── Tavsif ── */}
            <section className="mb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Loyiha tavsifi
              </h2>
              <p className="whitespace-pre-line text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
                {startup.description}
              </p>
            </section>

            {/* ── Tech stack ── */}
            <section className="mb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Texnologiyalar
              </h2>
              <div className="flex flex-wrap gap-2">
                {techList.map((tech, idx) => (
                  <span
                    key={`${tech}-${idx}`}
                    className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1 font-mono text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            {/* ── Meta ma'lumotlar (2 ustun grid) ── */}
            <section className="mb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Qo&apos;shimcha ma&apos;lumotlar
              </h2>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/40">
                  <dt className="mb-0.5 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                    Loyiha turi
                  </dt>
                  <dd className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {startup.project_type_display}
                  </dd>
                </div>

                <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/40">
                  <dt className="mb-0.5 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                    E&apos;lon sanasi
                  </dt>
                  <dd className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {formatDate(startup.created_at)}
                  </dd>
                </div>

                <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/40">
                  <dt className="mb-0.5 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                    Sotuvchi
                  </dt>
                  <dd className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    @{startup.owner_info.username}
                  </dd>
                </div>

                <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/40">
                  <dt className="mb-0.5 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                    Status
                  </dt>
                  <dd className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Faol e&apos;lon
                  </dd>
                </div>
              </dl>
            </section>

            {/* ── Ajratuvchi ── */}
            <div className="mb-8 border-t border-zinc-100 dark:border-zinc-800" />

            {/* ── Harakatlar ── */}
            <div className="flex flex-col gap-3 sm:flex-row">

              {/* Telegram Bot uchun */}
              {startup.project_type === "telegram_bot" && startup.bot_username && (
                <a
                  href={`https://t.me/${startup.bot_username.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-6 text-sm font-semibold text-sky-700 transition-all duration-200 hover:border-sky-300 hover:bg-sky-100 hover:shadow-md active:scale-95 dark:border-sky-800 dark:bg-sky-900/20 dark:text-sky-300 dark:hover:bg-sky-900/40"
                >
                  🤖 Botga o'tish ↗
                </a>
              )}

              {/* Mobil Ilova uchun */}
              {startup.project_type === "mobile_app" && (
                <>
                  {startup.play_store_link && (
                    <a
                      href={startup.play_store_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-6 text-sm font-semibold text-emerald-700 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-100 hover:shadow-md active:scale-95 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
                    >
                      ▶️ Play Store ↗
                    </a>
                  )}
                  {startup.app_store_link && (
                    <a
                      href={startup.app_store_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 px-6 text-sm font-semibold text-zinc-700 transition-all duration-200 hover:border-zinc-400 hover:bg-zinc-100 hover:shadow-md active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                      🍏 App Store ↗
                    </a>
                  )}
                </>
              )}

              {/* Boshqalar uchun (Veb-sayt, SaaS, E-Commerce, va h.k.) */}
              {startup.project_type !== "telegram_bot" && startup.project_type !== "mobile_app" && (
                <>
                  {startup.demo_link && (
                    <a
                      href={startup.demo_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      id="detail-demo-link"
                      className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-6 text-sm font-semibold text-sky-700 transition-all duration-200 hover:border-sky-300 hover:bg-sky-100 hover:shadow-md active:scale-95 dark:border-sky-800 dark:bg-sky-900/20 dark:text-sky-300 dark:hover:bg-sky-900/40"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                        <path
                          fillRule="evenodd"
                          d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Demo ko&apos;rish ↗
                    </a>
                  )}
    
                  {startup.github_link && (
                    <a
                      href={startup.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      id="detail-github-link"
                      className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 px-6 text-sm font-semibold text-zinc-700 transition-all duration-200 hover:border-zinc-400 hover:bg-zinc-100 hover:shadow-md active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
                      </svg>
                      GitHub ↗
                    </a>
                  )}
                </>
              )}

              {/* Sotib olish / Bog'lanish CTA */}
              <Link
                href={`/chat?receiver_id=${startup.owner_info.id}&startup_id=${startup.id}`}
                id="detail-contact-btn"
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.288Z" />
                </svg>
                Xabar
              </Link>
            </div>
          </div>
        </div>

        {/* ── Shunga o'xshash e'lonlar bo'limi ── */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Boshqa e&apos;lonlar
            </h2>
            <Link
              href="/startups"
              id="more-listings-link"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Hammasini ko&apos;rish →
            </Link>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Ko&apos;proq IT loyihalar va startaplarni ko&apos;rish uchun bosh sahifaga qayting.
          </p>
        </div>
      </div>
    </div>
  );
}
