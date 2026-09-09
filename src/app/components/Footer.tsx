import Link from "next/link";

// ─── Footer bo'limlari ────────────────────────────────────────────────────────

const PLATFORM_LINKS = [
  { href: "/",       label: "Barcha e'lonlar" },
  { href: "/create", label: "E'lon berish"    },
  { href: "/how-it-works", label: "Qanday ishlaydi?" },
  { href: "/pricing",label: "Tariflar"         },
];

const HELP_LINKS = [
  { href: "/contact", label: "Aloqa"         },
  { href: "/faq",     label: "FAQ"           },
  { href: "/blog",    label: "Blog"          },
  { href: "/about",   label: "Biz haqimizda" },
];

const LEGAL_LINKS = [
  { href: "/terms",   label: "Foydalanish shartlari" },
  { href: "/privacy", label: "Maxfiylik siyosati"    },
  { href: "/cookie", label: "Cookie siyosati"       },
];

// ─── Ijtimoiy tarmoqlar ───────────────────────────────────────────────────────

const SOCIALS = [
  {
    id: "footer-telegram",
    href: "https://t.me/Rustamovv_E",
    label: "Telegram",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" className="h-[18px] w-[18px] shrink-0" aria-hidden>
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
  {
    id: "footer-instagram",
    href: "https://instagram.com/rustamovv.09",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" className="h-[18px] w-[18px] shrink-0" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  {
    id: "footer-github",
    href: "https://github.com/erustamovv09-netizen",
    label: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" className="h-[18px] w-[18px] shrink-0" aria-hidden>
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"/>
      </svg>
    ),
  },
];

// ─── Footer komponenti ────────────────────────────────────────────────────────

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800/80 dark:bg-zinc-900/60">

      {/* ── Asosiy qism ── */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-12">

          {/* ── Brand bo'limi ── */}
          <div className="col-span-1 md:col-span-1">

            {/* Logo */}
            <Link
              href="/"
              id="footer-logo"
              className="group mb-4 inline-flex items-center gap-2.5 text-lg font-bold tracking-tight"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-black text-white shadow-md shadow-indigo-500/25 transition-transform duration-200 group-hover:scale-105">
                S
              </span>
              <span className="text-zinc-900 dark:text-white">
                StartUp{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Market
                </span>
              </span>
            </Link>

            {/* Tavsif */}
            <p className="mb-5 max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              O&apos;zbekistondagi IT loyihalar va tayyor bizneslar bozori.
              Xavfsiz va tez savdo platformasi.
            </p>

            {/* Ijtimoiy tarmoqlar */}
            <div className="flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.id}
                  id={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition-all duration-150 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-indigo-700 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Platforma havolalar ── */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Platforma
            </h3>
            <ul className="space-y-2.5">
              {PLATFORM_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Yordam havolalar ── */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Yordam
            </h3>
            <ul className="space-y-2.5">
              {HELP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Huquqiy havolalar ── */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Huquqiy
            </h3>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>


          </div>
        </div>
      </div>

      {/* ── Pastki qism (copyright) ── */}
      <div className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">

          {/* Copyright */}
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            © {year}{" "}
            <span className="font-medium text-zinc-500 dark:text-zinc-400">
              StartUp Market
            </span>
            . Barcha huquqlar himoyalangan.
          </p>

          {/* Qurilgan texnologiyalar */}
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Qurilgan:{" "}
            <span className="font-medium text-zinc-500 dark:text-zinc-400">
              Next.js · Django · Tailwind CSS
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
