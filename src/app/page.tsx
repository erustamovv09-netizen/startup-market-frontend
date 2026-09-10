"use client";
import { API_BASE_URL } from "@/lib/api";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StartupCard, type Startup } from "./components/marketplace-client";

// ─── Asosiy sahifa (Himoyalangan Client Component) ─────────────────────────

export default function Home() {
  const router = useRouter();

  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [startups, setStartups]             = useState<Startup[]>([]);
  const [isLoading, setIsLoading]           = useState(true);

  useEffect(() => {
    // 1. Auth tekshirish
    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/login");
      return; // Keyingi qatorlarga o'tmaslik uchun
    }

    setIsAuthChecking(false);

    // 2. Startaplarni yuklash
    async function fetchStartups() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/startups/`, {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (res.status === 401) {
          // Token eskirgan yoki xato
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          router.push("/login");
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setStartups(data);
        } else {
          setStartups([]);
        }
      } catch {
        setStartups([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStartups();
  }, [router]);

  // Auth tekshirilayotganda yuklanish ekranini ko'rsatish
  if (isAuthChecking || isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {isAuthChecking ? "Sessiya tekshirilmoqda..." : "E'lonlar yuklanmoqda..."}
          </p>
        </div>
      </div>
    );
  }

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

            {/* CTA tugma */}
            <div className="flex items-center justify-center">
              <Link
                href="/startups"
                id="hero-browse-btn"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:opacity-90 hover:shadow-xl hover:shadow-indigo-500/40 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18" className="h-[18px] w-[18px] shrink-0">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
                </svg>
                Startaplarni ko&apos;rish
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stats strip ── */}
        <div className="relative border-t border-zinc-100 bg-gradient-to-r from-zinc-50 via-white to-zinc-50 dark:border-zinc-800 dark:from-zinc-900/60 dark:via-zinc-950 dark:to-zinc-900/60">
          <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-zinc-200 dark:divide-zinc-800">

            {/* 1 — Dinamik faol e'lonlar soni */}
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-center sm:flex-row sm:gap-4 sm:px-8 sm:text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                  {startups.length} ta
                </p>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Faol e&apos;lonlar
                </p>
              </div>
            </div>

            {/* 2 — 100% Ochiq */}
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-center sm:flex-row sm:gap-4 sm:px-8 sm:text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                  100% Ochiq
                </p>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Vositachilarsiz to&apos;g&apos;ridan-to&apos;g&apos;ri muloqot
                </p>
              </div>
            </div>

            {/* 3 — 0% Komissiya */}
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-center sm:flex-row sm:gap-4 sm:px-8 sm:text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.75 9.25a.75.75 0 0 0 0 1.5h4.59l-2.1 1.95a.75.75 0 0 0 1.02 1.1l3.5-3.25a.75.75 0 0 0 0-1.1l-3.5-3.25a.75.75 0 1 0-1.02 1.1l2.1 1.95H6.75Z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                  0% Komissiya
                </p>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Sotuv va xaridlar uchun yashirin to&apos;lovlar yo&apos;q
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════ MARKETPLACE ══════════════════ */}
      <section
        id="listings"
        className="bg-white pt-10 dark:bg-zinc-950"
      >
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

        {/* So'nggi 6 ta startap */}
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          {startups.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {startups.slice(0, 6).map((startup) => (
                <StartupCard key={startup.id} s={startup} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-zinc-500">
              Hozircha e&apos;lonlar mavjud emas
            </div>
          )}

          {/* Barcha e'lonlarni ko'rish tugmasi */}
          {startups.length > 6 && (
            <div className="mt-12 flex justify-center w-full">
              <Link href="/startups" className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                Barcha e&apos;lonlarni ko&apos;rish <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
